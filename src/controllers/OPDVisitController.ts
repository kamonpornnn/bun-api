import { opdVisitService } from "../services/OPDVisit";
import type { OPDVisit } from "../models/OPDVisit";
import { sendResponse, sendError } from "../utils/response";

export async function GetAllOPDVisits(req: Request): Promise<Response> {
  try {
    const data: OPDVisit[] = await opdVisitService.getAll();
    return sendResponse(data);
  } catch (error) {
    return sendError(500, "Failed to fetch OPD visits");
  }
}

export async function AddOPDVisit(req: Request): Promise<Response> {
  try {
    const opd = (await req.json()) as OPDVisit;
    // Normalize and set defaults
    if (!opd.opd_id) opd.opd_id = `OPD-${Date.now()}`;
    const now = new Date().toISOString();
    if (!opd.created_at) opd.created_at = now;
    opd.updated_at = now;
    if (!opd.status) opd.status = "DRAFT";
    if (opd.payment_type === undefined) opd.payment_type = null;

    // Ensure numeric fields are numbers or null
    opd.bp_systolic = opd.bp_systolic != null ? Number(opd.bp_systolic) : null;
    opd.bp_diastolic = opd.bp_diastolic != null ? Number(opd.bp_diastolic) : null;
    opd.pr = opd.pr != null ? Number(opd.pr) : null;
    opd.temperature_c = opd.temperature_c != null ? Number(opd.temperature_c) : null;
    opd.pain_score = opd.pain_score != null ? Number(opd.pain_score) : null;

    await opdVisitService.addOPDVisit(opd);
    return sendResponse(opd, 201);
  } catch (error) {
    return sendError(500, "Failed to add OPD visit");
  }
}
