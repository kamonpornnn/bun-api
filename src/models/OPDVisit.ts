export interface OPDVisit {
   opd_id: string;
  patient_id: string;

  visit_date: string;

  // Vitals
  bp_systolic: number | null;
  bp_diastolic: number | null;
  pr: number | null;
  temperature_c: number | null;
  pain_score: number | null;

  // Medical
  chief_complaint: string;
  diagnosis: string;
  treatment: string;

  // Flow control
  status: "DRAFT" | "CLOSED";
  payment_type: "cash" | "package" | null;
  package_id?: string | null;

  created_at: string;
  updated_at: string;
}
