export interface t_patient_package {
  patient_package_id: string;
  patient_id: string;
  package_id: string;
  package_name: string;
  total_sessions: number;
  remaining_sessions: number;
  price: number;
  start_date: string;
  expire_date: string;
  status: "ACTIVE" | "EXPIRED" | "USED_UP";
  purchased_at: string;
}
