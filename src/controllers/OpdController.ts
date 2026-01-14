
import { opdVisitService } from "../services/OPDVisit";
import type { t_opd } from "../models/t_opd";
import { sendResponse, sendError } from "../utils/response";

export async function GetAllOPDVisits(req: Request): Promise<Response> {
  try {
    const data: t_opd[] = await opdVisitService.getAll();
    return sendResponse(data);
  } catch (error) {
    return sendError(500, "Failed to fetch OPD visits");
  }
}

export async function AddOPDVisit(req: Request): Promise<Response> {
  try {
    const opd = (await req.json()) as t_opd;
    // Normalize and set defaults
    if (!opd.opd_id) opd.opd_id = `OPD-${Date.now()}`;
    const now = new Date().toISOString();
    if (!opd.created_at) opd.created_at = now;
    opd.updated_at = now;
    if (!opd.status) opd.status = "DRAFT";
    if (opd.payment_type === undefined) opd.payment_type = "";

    // Ensure numeric fields are numbers
    opd.bp_systolic = opd.bp_systolic != null ? Number(opd.bp_systolic) : 0;
    opd.bp_diastolic = opd.bp_diastolic != null ? Number(opd.bp_diastolic) : 0;
    opd.pr = opd.pr != null ? Number(opd.pr) : 0;
    opd.temperature_c = opd.temperature_c != null ? Number(opd.temperature_c) : 0;
    opd.pain_score = opd.pain_score != null ? Number(opd.pain_score) : 0;

    await opdVisitService.addOPDVisit(opd);
    return sendResponse(opd, 201);
  } catch (error) {
    return sendError(500, "Failed to add OPD visit");
  }
}


