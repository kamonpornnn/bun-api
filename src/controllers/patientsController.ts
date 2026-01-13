import { patientsService } from "../services/Patients";
import type { Patients } from "../models/Patients";
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
    const patientData = await req.json() as Patients;
    const newPatient = await patientsService.addPatient(patientData);
    return sendResponse(newPatient, 201);
  } catch {
    return sendError(500, "Failed to add patient");
  }
}
