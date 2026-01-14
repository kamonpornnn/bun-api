export interface mt_patients {
  patient_id: string;  
  first_name: string;
  last_name: string;
  age: number;
  phone_number: string;
  national_id: string;
  date_of_birth: string;
  weight_kg: number;
  height_cm: number;
  chronic_diseases: string;
  drug_food_allergies: string;
  illness_history: string;
  surgery_history: string;

  emergency_contact_first_name: string;
  emergency_contact_last_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
}