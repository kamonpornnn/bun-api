import { google } from "googleapis";
import type { PatientPackage } from "../models/PatientPackage";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const SHEET_NAME = process.env.SHEET_PATIENT_PACKAGES!;

export const patientPackageService = {
  async getAll(): Promise<PatientPackage[]> {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:Z`,
    });
    return (
      res.data.values?.map((row: any[]) => ({
        patient_package_id: row[0],
        patient_id: row[1],
        package_id: row[2],
        used_sessions: row[3] !== undefined && row[3] !== "" ? Number(row[3]) : 0,
        remaining_sessions: row[4] !== undefined && row[4] !== "" ? Number(row[4]) : 0,
        start_date: row[5],
        expire_date: row[6],
        status: (row[7] as "ACTIVE" | "EXPIRED" | "USED_UP") || "ACTIVE",
        created_at: row[8],
      })) || []
    );
  },

  async addPatientPackage(pp: PatientPackage): Promise<void> {
    const values = [
      [
        pp.patient_package_id,
        pp.patient_id,
        pp.package_id,
        pp.used_sessions,
        pp.remaining_sessions,
        pp.start_date,
        pp.expire_date,
        pp.status,
        pp.created_at,
      ],
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:Z`,
      valueInputOption: "RAW",
      requestBody: { values },
    });
  },
};
