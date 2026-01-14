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

// Dummy implementations for googleLogin and googleCallback
function googleLogin() {
  return new Response("Google Login Endpoint", { status: 200 });
}
function googleCallback(url: URL) {
  return new Response("Google Callback Endpoint", { status: 200 });
}

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

