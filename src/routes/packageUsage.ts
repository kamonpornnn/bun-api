import { GetAllPackageUsage, AddPackageUsage } from "../controllers/PackageUsageController";

export const packageUsageRoutes = [
  {
    method: "GET",
    path: "/package-usage",
    handler: GetAllPackageUsage,
  },
  {
    method: "POST",
    path: "/package-usage",
    handler: AddPackageUsage,
  },
];
