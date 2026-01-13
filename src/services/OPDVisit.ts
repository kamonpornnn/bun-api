import { google } from "googleapis";
import type { OPDVisit } from "../models/OPDVisit";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const SHEET_NAME = process.env.SHEET_OPD_VISITS!;

export const opdVisitService = {
  async getAll(): Promise<OPDVisit[]> {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:Z`,
    });
    return (
      res.data.values?.map((row: any[]) => ({
        opd_id: row[0],
        patient_id: row[1],
        visit_date: row[2],
        bp_systolic: row[3] !== undefined && row[3] !== "" ? Number(row[3]) : null,
        bp_diastolic: row[4] !== undefined && row[4] !== "" ? Number(row[4]) : null,
        pr: row[5] !== undefined && row[5] !== "" ? Number(row[5]) : null,
        temperature_c: row[6] !== undefined && row[6] !== "" ? Number(row[6]) : null,
        pain_score: row[7] !== undefined && row[7] !== "" ? Number(row[7]) : null,
        chief_complaint: row[8],
        diagnosis: row[9],
        treatment: row[10],
        status: (row[11] as "DRAFT" | "CLOSED") || "DRAFT",
        payment_type: row[12] || null,
        package_id: row[13] || null,
        created_at: row[14],
        updated_at: row[15],
      })) || []
    );
  },

  async addOPDVisit(opd: OPDVisit): Promise<void> {
    const values = [
      [
        opd.opd_id,
        opd.patient_id,
        opd.visit_date,
        opd.bp_systolic,
        opd.bp_diastolic,
        opd.pr,
        opd.temperature_c,
        opd.pain_score,
        opd.chief_complaint,
        opd.diagnosis,
        opd.treatment,
        opd.status,
        opd.payment_type,
        opd.package_id,
        opd.created_at,
        opd.updated_at,
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
