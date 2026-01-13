export function sendResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function sendError(status: number, message: string) {
  return sendResponse({ message }, status);
}