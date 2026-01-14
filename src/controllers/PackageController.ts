import { packageService } from "../services/Package";
import type { mt_packages } from "../models/mt_package";
import { sendResponse, sendError } from "../utils/response";

export async function GetAllPackages(req: Request): Promise<Response> {
  try {
    const data: mt_packages[] = await packageService.getAll();
    return sendResponse(data);
  } catch (error) {
    return sendError(500, "Failed to fetch packages");
  }
}

export async function AddPackage(req: Request): Promise<Response> {
  try {
    const pkg = (await req.json()) as mt_packages;
    if (!pkg.package_id) pkg.package_id = `PKG-${Date.now()}`;
    const now = new Date().toISOString();
    if (!pkg.created_at) pkg.created_at = now;
    pkg.updated_at = now;
    if (!pkg.status) pkg.status = "ACTIVE";
    pkg.total_sessions = pkg.total_sessions != null ? Number(pkg.total_sessions) : 0;
    pkg.price = pkg.price != null ? Number(pkg.price) : 0;
    pkg.allow_acupuncture = Boolean(pkg.allow_acupuncture);
    pkg.allow_cupping = Boolean(pkg.allow_cupping);
    pkg.allow_mixed = Boolean(pkg.allow_mixed);
    pkg.expire_days = pkg.expire_days != null ? Number(pkg.expire_days) : 0;
    await packageService.addPackage(pkg);
    return sendResponse(pkg, 201);
  } catch (error) {
    return sendError(500, "Failed to add package");
  }
}
