import "dotenv/config";
import { sheet1Routes } from "./routes/sheet1";
import { patientsRoutes } from "./routes/patients";
import { opdVisitsRoutes } from "./routes/opd";
import { packagesRoutes } from "./routes/packages";
import { packageUsageRoutes } from "./routes/packageUsage";
import { patientPackagesRoutes } from "./routes/patientPackages";
import { jwtVerify, createRemoteJWKSet } from "jose";

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

const routes = [
  ...sheet1Routes,
  ...patientsRoutes,
  ...opdVisitsRoutes,
  ...packagesRoutes,
  ...patientPackagesRoutes,
  ...packageUsageRoutes,
];

function googleLogin() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: "http://localhost:3000/auth/google/callback",
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  });

  return Response.redirect(
    "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString(),
    302
  );
}

async function googleCallback(url: URL) {
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("No code", { status: 400 });
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "http://localhost:3000/auth/google/callback",
      grant_type: "authorization_code",
    }),
  });

  type GoogleTokenResponse = {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
};

  const token = (await tokenRes.json()) as GoogleTokenResponse;

  // const token = await tokenRes.json();
  const { id_token } = token;

  const payload = await verifyGoogleToken(id_token);

  // payload คือ user จาก Google
  // { sub, email, name, picture }

  return new Response(
    JSON.stringify({
      user: payload,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

async function verifyGoogleToken(idToken: string) {
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: "https://accounts.google.com",
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  return payload;
}


// function googleCallback(url: URL) {
//   return new Response("Google Callback Endpoint", { status: 200 });
// }

Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Google OAuth endpoints
    if (url.pathname === "/auth/google") {
      return googleLogin();
    }
    if (url.pathname === "/auth/google/callback") {
      return googleCallback(url);
    }

    // API routes
    const reqPath = url.pathname.replace(/\/+$|^$/, (s) => (s === "" ? "/" : ""));
    for (const route of routes) {
      const routePath = route.path.replace(/\/+$|^$/, (s) => (s === "" ? "/" : ""));
      const match = routePath === reqPath;
      if (match && route.method === req.method) {
        const res = route.handler(req);
        // If the handler returns a Response, attach CORS header
        if (res instanceof Promise) {
          return res.then((r) => {
            r.headers.set("Access-Control-Allow-Origin", "*");
            return r;
          });
        }
        res.headers.set("Access-Control-Allow-Origin", "*");
        return res;
      }
    }

    return new Response(JSON.stringify({ message: "NOT_FOUND" }), { status: 404 });
  },
});

console.log("🚀 Bun API running at http://localhost:3000");

