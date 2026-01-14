export interface t_opd {
  opd_id: string;
  patient_id: string;
  visit_date: string;
  bp_systolic: number;
  bp_diastolic: number;
  pr: number;
  temperature_c: number;
  pain_score: number;
  chief_complaint: string;
  diagnosis: string;
  treatment: string;
  payment_type: string;
  patient_package_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}
