import { GetAllPackages, AddPackage } from "../controllers/PackageController";

export const packagesRoutes = [
  {
    path: "/packages",
    method: "GET",
    handler: GetAllPackages,
  },
  {
    path: "/packages",
    method: "POST",
    handler: AddPackage,
  },
];
