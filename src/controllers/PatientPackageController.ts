import { patientPackageService } from "../services/PatientPackage";
import type { t_patient_package } from "../models/t_patient_package";
import { sendResponse, sendError } from "../utils/response";

export async function GetAllPatientPackages(req: Request): Promise<Response> {
  try {
    const data: t_patient_package[] = await patientPackageService.getAll();
    return sendResponse(data);
  } catch (error) {
    return sendError(500, "Failed to fetch patient packages");
  }
}

export async function AddPatientPackage(req: Request): Promise<Response> {
  try {
    const pp = (await req.json()) as t_patient_package;
    if (!pp.patient_package_id) pp.patient_package_id = `PP-${Date.now()}`;
    if (!pp.purchased_at) pp.purchased_at = new Date().toISOString();
    pp.total_sessions = pp.total_sessions != null ? Number(pp.total_sessions) : 0;
    pp.remaining_sessions = pp.remaining_sessions != null ? Number(pp.remaining_sessions) : pp.total_sessions;
    pp.price = pp.price != null ? Number(pp.price) : 0;
    if (!pp.status) pp.status = "ACTIVE";
    await patientPackageService.addPatientPackage(pp);
    return sendResponse(pp, 201);
  } catch (error) {
    return sendError(500, "Failed to add patient package");
  }
}
