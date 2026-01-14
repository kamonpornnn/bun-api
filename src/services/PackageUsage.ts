import { google } from "googleapis";
import type { t_package_usage } from "../models/t_package_usage";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const SHEET_NAME = process.env.SHEET_PAKAGE_USAGES!;

export const packageUsageService = {
  async getAll(): Promise<t_package_usage[]> {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:I`,
    });
    return (
      res.data.values?.map((row: any[]) => ({
        usage_id: row[0],
        patient_package_id: row[1],
        opd_id: row[2],
        patient_id: row[3],
        treatment_type: row[4],
        used_sessions: row[5] !== undefined && row[5] !== "" ? Number(row[5]) : 0,
        used_at: row[6],
        note: row[7],
        created_at: row[8],
      })) || []
    );
  },

  async addPackageUsage(usage: t_package_usage): Promise<void> {
    const values = [
      [
        usage.usage_id,
        usage.patient_package_id,
        usage.opd_id,
        usage.patient_id,
        usage.treatment_type,
        usage.used_sessions,
        usage.used_at,
        usage.note,
        usage.created_at,
      ],
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:I`,
      valueInputOption: "RAW",
      requestBody: { values },
    });
  },
};
