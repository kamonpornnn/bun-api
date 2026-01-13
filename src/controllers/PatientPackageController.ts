import { patientPackageService } from "../services/PatientPackage";
import type { PatientPackage } from "../models/PatientPackage";
import { sendResponse, sendError } from "../utils/response";

export async function GetAllPatientPackages(req: Request): Promise<Response> {
  try {
    const data: PatientPackage[] = await patientPackageService.getAll();
    return sendResponse(data);
  } catch (error) {
    return sendError(500, "Failed to fetch patient packages");
  }
}

export async function AddPatientPackage(req: Request): Promise<Response> {
  try {
    const pp = (await req.json()) as PatientPackage;
    if (!pp.patient_package_id) pp.patient_package_id = `PP-${Date.now()}`;
    const now = new Date().toISOString();
    if (!pp.created_at) pp.created_at = now;
    pp.used_sessions = pp.used_sessions != null ? Number(pp.used_sessions) : 0;
    pp.remaining_sessions = pp.remaining_sessions != null ? Number(pp.remaining_sessions) : pp.used_sessions;
    if (!pp.status) pp.status = "ACTIVE";
    await patientPackageService.addPatientPackage(pp);
    return sendResponse(pp, 201);
  } catch (error) {
    return sendError(500, "Failed to add patient package");
  }
}
