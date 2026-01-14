import { google } from "googleapis";
import type { mt_packages } from "../models/mt_package";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const SHEET_NAME = process.env.SHEET_PACKAGES!;

export const packageService = {
  async getAll(): Promise<mt_packages[]> {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:Z`,
    });
    return (
      res.data.values?.map((row: any[]) => ({
        package_id: row[0],
        package_name: row[1],
        description: row[2],
        total_sessions: row[3] !== undefined && row[3] !== "" ? Number(row[3]) : 0,
        price: row[4] !== undefined && row[4] !== "" ? Number(row[4]) : 0,
        allow_acupuncture: row[5] === "true" || row[5] === true,
        allow_cupping: row[6] === "true" || row[6] === true,
        allow_mixed: row[7] === "true" || row[7] === true,
        expire_days: row[8] !== undefined && row[8] !== "" ? Number(row[8]) : 0,
        status: row[9],
        created_at: row[10],
        updated_at: row[11],
      })) || []
    );
  },

  async addPackage(pkg: mt_packages): Promise<void> {
    const values = [
      [
        pkg.package_id,
        pkg.package_name,
        pkg.description,
        pkg.total_sessions,
        pkg.price,
        pkg.allow_acupuncture,
        pkg.allow_cupping,
        pkg.allow_mixed,
        pkg.expire_days,
        pkg.status,
        pkg.created_at,
        pkg.updated_at,
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
