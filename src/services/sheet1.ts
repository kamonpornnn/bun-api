import { google } from "googleapis";
import type { sheet1 } from "../models/sheet1";

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const SHEET_NAME = process.env.SHEET_NAME_TEST;

export const sheet1Service = {
    async getAll(): Promise<sheet1[]> {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A2:D`,
        });
        return res.data.values?.map((row: any[]) => ({
            name: row[0],
            email: row[1],
            message: row[2],
            created_at: row[3],
        })) || [];
    }
}