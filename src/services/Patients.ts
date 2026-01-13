import { google } from "googleapis";
import type { Patients } from "../models/Patients";

// const auth = new google.auth.GoogleAuth({
//   keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});


const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const SHEET_NAME = process.env.SHEET_PATIENTS!;

export const patientsService = {
    async getAll(): Promise<Patients[]> {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A2:Q`,
        });
        return res.data.values?.map((row: any[]) => ({ 
            patient_id: row[0],
            first_name: row[1],
            last_name: row[2],
            age: row[3],
            phone_number: row[4],
            national_id: row[5],
            date_of_birth: row[6],
            weight_kg: row[7],
            height_cm: row[8],
            chronic_diseases: row[9],
            drug_food_allergies: row[10],
            illness_history: row[11],
            surgery_history: row[12],

            emergency_contact_first_name: row[13],
            emergency_contact_last_name: row[14],
            emergency_contact_phone: row[15],
            emergency_contact_relationship: row[16]
        })) || [];
    },

    async addPatient(patient: Patients): Promise<void> {
        const values = [
            [
                patient.patient_id,
                patient.first_name,
                patient.last_name,
                patient.age,
                patient.phone_number,
                patient.national_id,
                patient.date_of_birth,
                patient.weight_kg,
                patient.height_cm,
                patient.chronic_diseases,
                patient.drug_food_allergies,
                patient.illness_history,
                patient.surgery_history,
                patient.emergency_contact_first_name,
                patient.emergency_contact_last_name,
                patient.emergency_contact_phone,
                patient.emergency_contact_relationship
            ],
        ];
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A2:Q`,
            valueInputOption: "RAW",
            requestBody: {
                values,
            },
        });
    }
}