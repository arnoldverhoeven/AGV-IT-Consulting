// Quote request form -> e-mail via Resend. Bereikbaar op POST /api/quote.
const TO = "arnold.verhoeven@agv-it.be";
const FROM = "AGV IT website <website@shopzo.be>";
const headers = { "Cache-Control": "no-store" };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let d;
  try { d = await req.json(); } catch { d = null; }
  if (!d || typeof d !== "object") return Response.json({ error: "bad json" }, { status: 400, headers });

  const name = String(d.name || "").trim().slice(0, 120);
  const email = String(d.email || "").trim().slice(0, 200);
  const company = String(d.company || "").trim().slice(0, 120);
  const type = String(d.type || "").trim().slice(0, 60);
  const message = String(d.message || "").trim().slice(0, 5000);
  if (d.website) return Response.json({ ok: true }, { headers }); // honeypot: stil negeren
  if (!name || !email || !type || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "missing fields" }, { status: 400, headers });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "not configured" }, { status: 500, headers });

  const subject = `Quote request — ${type}${company ? " — " + company : ""} — ${name}`;
  const text = [`Name: ${name}`, `Email: ${email}`, company ? `Company: ${company}` : null, `Project type: ${type}`, "", "Project details:", message, "", "— sent from the quote form on agv-it.be"].filter(Boolean).join("\n");
  const row = (k, v) => `<tr><td style="padding:6px 12px 6px 0;color:#64748B;white-space:nowrap">${k}</td><td style="padding:6px 0">${v}</td></tr>`;
  const html = `<div style="font:15px/1.6 Inter,Arial,sans-serif;color:#0E2240"><h2 style="margin:0 0 14px;font-size:18px">New quote request</h2><table style="border-collapse:collapse">${row("Name", esc(name))}${row("Email", `<a href="mailto:${esc(email)}">${esc(email)}</a>`)}${company ? row("Company", esc(company)) : ""}${row("Project type", esc(type))}</table><p style="margin:18px 0 6px;color:#64748B">Project details</p><div style="white-space:pre-wrap;border-left:3px solid #2563EB;padding:8px 14px;background:#F4F7FC">${esc(message)}</div><p style="margin-top:22px;font-size:12px;color:#94A3B8">Sent from the quote form on agv-it.be · reply to answer the client directly.</p></div>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [TO], reply_to: `${name} <${email}>`, subject, text, html })
  });
  if (!r.ok) {
    console.error("resend error", r.status, await r.text());
    return Response.json({ error: "send failed" }, { status: 502, headers });
  }
  return Response.json({ ok: true }, { headers });
};

export const config = { path: "/api/quote" };
