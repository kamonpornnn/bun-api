import { AddPatient, GetAllPatients } from "../controllers/patientsController";

export const patientsRoutes = [
  {
    path: "/patients",
    method: "GET",
    handler: GetAllPatients,
  },
  {
    path: "/patients",
    method: "POST",
    handler: AddPatient,
  }
];
