import { GetAllPatientPackages, AddPatientPackage } from "../controllers/PatientPackageController";

export const patientPackagesRoutes = [
  {
    path: "/patient-packages",
    method: "GET",
    handler: GetAllPatientPackages,
  },
  {
    path: "/patient-packages",
    method: "POST",
    handler: AddPatientPackage,
  },
];
