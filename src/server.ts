import "dotenv/config";
import { serve } from "bun";
import { sheet1Routes } from "./routes/sheet1";
import { patientsRoutes } from "./routes/patients";
import { opdVisitsRoutes } from "./routes/opdVisits";
import { packagesRoutes } from "./routes/packages";
import { patientPackagesRoutes } from "./routes/patientPackages";

const routes = [...sheet1Routes, ...patientsRoutes, ...opdVisitsRoutes, ...packagesRoutes, ...patientPackagesRoutes];

serve({
  fetch(req) {
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

    const reqPath = new URL(req.url).pathname.replace(/\/+$|^$/, (s) => (s === "" ? "/" : ""));
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
  port: 3000,
});

console.log("🚀 Bun API running at http://localhost:3000");

