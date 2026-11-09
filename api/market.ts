export const config = { runtime: "edge" };

export default function handler(request: Request): Response {
  const value = request.headers.get("x-vercel-ip-country") ?? "";
  const country = /^[A-Z]{2}$/.test(value) ? value : null;
  return Response.json({ country }, { headers: { "Cache-Control": "private, no-store" } });
}
