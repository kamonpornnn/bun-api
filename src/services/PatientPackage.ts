import { google } from "googleapis";
import type { t_patient_package } from "../models/t_patient_package";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const SHEET_NAME = process.env.SHEET_PATIENT_PACKAGES!;

export const patientPackageService = {
  async getAll(): Promise<t_patient_package[]> {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:K`,
    });
    return (
      res.data.values?.map((row: any[]) => ({
        patient_package_id: row[0],
        patient_id: row[1],
        package_id: row[2],
        package_name: row[3],
        total_sessions: row[4] !== undefined && row[4] !== "" ? Number(row[4]) : 0,
        remaining_sessions: row[5] !== undefined && row[5] !== "" ? Number(row[5]) : 0,
        price: row[6] !== undefined && row[6] !== "" ? Number(row[6]) : 0,
        start_date: row[7],
        expire_date: row[8],
        status: (row[9] as "ACTIVE" | "EXPIRED" | "USED_UP") || "ACTIVE",
        purchased_at: row[10],
      })) || []
    );
  },

  async addPatientPackage(pp: t_patient_package): Promise<void> {
    const values = [
      [
        pp.patient_package_id,
        pp.patient_id,
        pp.package_id,
        pp.package_name,
        pp.total_sessions,
        pp.remaining_sessions,
        pp.price,
        pp.start_date,
        pp.expire_date,
        pp.status,
        pp.purchased_at,
      ],
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:K`,
      valueInputOption: "RAW",
      requestBody: { values },
    });
  },
};
