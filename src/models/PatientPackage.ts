export interface PatientPackage {
  patient_package_id: string;

  patient_id: string;
  package_id: string;

  used_sessions: number;
  remaining_sessions: number;

  start_date: string;
  expire_date: string;

  status: "ACTIVE" | "EXPIRED" | "USED_UP";

  created_at: string;
}
