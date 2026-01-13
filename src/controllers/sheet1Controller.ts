import { sheet1Service } from "../services/sheet1";
import type { sheet1 } from "../models/sheet1";
import { sendResponse, sendError } from "../utils/response";

export async function getAllSheet1(req: Request): Promise<Response> {
    try {
        const data: sheet1[] = await sheet1Service.getAll();
        return sendResponse(data);
    } catch (error) {
        return sendError(500, "Failed to fetch sheet1 data");
    }
}