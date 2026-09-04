// Gedeelde opslag voor de familieweekend-pagina (Netlify Function + Netlify Blobs).
// Bereikbaar op /api/sync — GET geeft de huidige staat, POST bewaart een nieuwe.
import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("familieweekend");
  const headers = { "Cache-Control": "no-store" };

  if (req.method === "GET") {
    const url = new URL(req.url);
    if (url.searchParams.has("check")) {
      return Response.json({ ok: true, hint: "Function draait. Blobs-opslag klaar." }, { headers });
    }
    const data = await store.get("state", { type: "json" });
    return Response.json(data ?? null, { headers });
  }

  if (req.method === "POST") {
    let data;
    try { data = await req.json(); } catch { data = null; }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return Response.json({ error: "bad json" }, { status: 400, headers });
    }
    // Nooit een oudere versie over een nieuwere schrijven
    const current = await store.get("state", { type: "json" });
    if (current && (current.updatedAt || 0) > (data.updatedAt || 0)) {
      return Response.json(current, { headers });
    }
    await store.setJSON("state", data);
    return Response.json({ ok: true }, { headers });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/sync" };
