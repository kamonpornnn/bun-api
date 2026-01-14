import { google } from "googleapis";
import type { t_opd } from "../models/t_opd";

const auth = (() => {
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
      if (creds.private_key && typeof creds.private_key === "string") {
        let pk: string = creds.private_key;
        pk = pk.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();
        if (pk.startsWith('"') && pk.endsWith('"')) pk = pk.slice(1, -1);
        creds.private_key = pk;
      }
      return new google.auth.GoogleAuth({ credentials: creds as any, scopes });
    } catch (e) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", e);
    }
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new google.auth.GoogleAuth({ keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, scopes });
  }
  return new google.auth.GoogleAuth({ scopes });
})();

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const SHEET_NAME = process.env.SHEET_OPD_VISITS!;

export const opdVisitService = {
  async getAll(): Promise<t_opd[]> {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:Z`,
    });
    return (
      res.data.values?.map((row: any[]) => ({
        opd_id: row[0],
        patient_id: row[1],
        visit_date: row[2],
        bp_systolic: row[3] !== undefined && row[3] !== "" ? Number(row[3]) : 0,
        bp_diastolic: row[4] !== undefined && row[4] !== "" ? Number(row[4]) : 0,
        pr: row[5] !== undefined && row[5] !== "" ? Number(row[5]) : 0,
        temperature_c: row[6] !== undefined && row[6] !== "" ? Number(row[6]) : 0,
        pain_score: row[7] !== undefined && row[7] !== "" ? Number(row[7]) : 0,
        chief_complaint: row[8],
        diagnosis: row[9],
        treatment: row[10],
        payment_type: row[11],
        patient_package_id: row[12],
        status: row[13],
        created_at: row[14],
        updated_at: row[15],
      })) || []
    );
  },

  async addOPDVisit(opd: t_opd): Promise<void> {
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
        opd.payment_type,
        opd.patient_package_id,
        opd.status,
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
