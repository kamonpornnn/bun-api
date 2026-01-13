import { packageService } from "../services/Package";
import type { Package } from "../models/Package";
import { sendResponse, sendError } from "../utils/response";

export async function GetAllPackages(req: Request): Promise<Response> {
  try {
    const data: Package[] = await packageService.getAll();
    return sendResponse(data);
  } catch (error) {
    return sendError(500, "Failed to fetch packages");
  }
}

export async function AddPackage(req: Request): Promise<Response> {
  try {
    const pkg = (await req.json()) as Package;
    if (!pkg.package_id) pkg.package_id = `PKG-${Date.now()}`;
    const now = new Date().toISOString();
    if (!pkg.created_at) pkg.created_at = now;
    pkg.updated_at = now;
    if (!pkg.status) pkg.status = "ACTIVE";
    pkg.total_sessions = pkg.total_sessions != null ? Number(pkg.total_sessions) : 0;
    pkg.remaining_sessions = pkg.remaining_sessions != null ? Number(pkg.remaining_sessions) : pkg.total_sessions;
    pkg.price = pkg.price != null ? Number(pkg.price) : 0;
    await packageService.addPackage(pkg);
    return sendResponse(pkg, 201);
  } catch (error) {
    return sendError(500, "Failed to add package");
  }
}
