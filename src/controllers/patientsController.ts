import { patientsService } from "../services/Patients";
import type { mt_patients } from "../models/mt_patients";
import { sendResponse, sendError } from "../utils/response";

export async function GetAllPatients(): Promise<Response> {
  try {
    const data = await patientsService.getAll();
    return sendResponse(data);
  } catch {
    return sendError(500, "Failed to fetch patients data");
  }
}

export async function AddPatient(req: Request): Promise<Response> {
  try {
    const patientData = await req.json() as mt_patients;
    const newPatient = await patientsService.addPatient(patientData);
    return sendResponse(newPatient, 201);
  } catch {
    return sendError(500, "Failed to add patient");
  }
}
