import { packageUsageService } from "../services/PackageUsage";
import type { t_package_usage } from "../models/t_package_usage";
import { sendResponse, sendError } from "../utils/response";

export async function GetAllPackageUsage(req: Request): Promise<Response> {
  try {
    const data: t_package_usage[] = await packageUsageService.getAll();
    return sendResponse(data);
  } catch (error) {
    return sendError(500, "Failed to fetch package usage");
  }
}

export async function AddPackageUsage(req: Request): Promise<Response> {
  try {
    const usage = (await req.json()) as t_package_usage;
    if (!usage.usage_id) usage.usage_id = `PU-${Date.now()}`;
    const now = new Date().toISOString();
    if (!usage.created_at) usage.created_at = now;
    if (!usage.used_at) usage.used_at = now;
    usage.used_sessions = usage.used_sessions != null ? Number(usage.used_sessions) : 0;
    await packageUsageService.addPackageUsage(usage);
    return sendResponse(usage, 201);
  } catch (error) {
    return sendError(500, "Failed to add package usage");
  }
}
