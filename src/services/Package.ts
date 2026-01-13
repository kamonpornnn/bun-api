import { google } from "googleapis";
import type { Package } from "../models/Package";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const SHEET_NAME = process.env.SHEET_PACKAGES!;

export const packageService = {
  async getAll(): Promise<Package[]> {
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
        remaining_sessions: row[4] !== undefined && row[4] !== "" ? Number(row[4]) : 0,
        price: row[5] !== undefined && row[5] !== "" ? Number(row[5]) : 0,
        start_date: row[6],
        expire_date: row[7],
        status: (row[8] as "ACTIVE" | "EXPIRED" | "USED_UP") || "ACTIVE",
        created_at: row[9],
        updated_at: row[10],
      })) || []
    );
  },

  async addPackage(pkg: Package): Promise<void> {
    const values = [
      [
        pkg.package_id,
        pkg.package_name,
        pkg.description,
        pkg.total_sessions,
        pkg.remaining_sessions,
        pkg.price,
        pkg.start_date,
        pkg.expire_date,
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
