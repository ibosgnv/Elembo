import { NextResponse } from "next/server";

/**
 * Contact endpoint.
 *
 * No mail provider is wired up yet. When CONTACT_WEBHOOK_URL is set (e.g. a
 * Make/Zapier/n8n webhook, Formspree endpoint or your own mailer), the
 * validated message is POSTed there as JSON and the visitor sees a success
 * message only if that call succeeds. Without it, the route answers 503 and
 * the form offers e-mail and phone instead — it never fakes a success.
 */

const SUBJECTS = ["client", "livraison", "revendeur"] as const;

type Payload = {
  sujet: (typeof SUBJECTS)[number];
  nom: string;
  telephone: string;
  email?: string;
  ville?: string;
  message: string;
  website?: string; // honeypot
};

function validate(body: unknown): { ok: true; data: Payload } | { ok: false; errors: Record<string, string> } {
  const b = (body ?? {}) as Record<string, unknown>;
  const str = (k: string) => (typeof b[k] === "string" ? (b[k] as string).trim() : "");
  const errors: Record<string, string> = {};
  const sujet = str("sujet");
  if (!SUBJECTS.includes(sujet as Payload["sujet"])) errors.sujet = "Choisissez le type de demande.";
  if (str("nom").length < 2) errors.nom = "Indiquez votre nom.";
  if (!/^\+?[0-9 ().-]{8,20}$/.test(str("telephone"))) errors.telephone = "Indiquez un numéro de téléphone valide.";
  if (str("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str("email"))) errors.email = "Adresse e-mail invalide.";
  if (str("message").length < 10) errors.message = "Votre message doit faire au moins 10 caractères.";
  if (str("message").length > 3000) errors.message = "Votre message est trop long (3 000 caractères maximum).";
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      sujet: sujet as Payload["sujet"],
      nom: str("nom"),
      telephone: str("telephone"),
      email: str("email") || undefined,
      ville: str("ville") || undefined,
      message: str("message"),
      website: str("website"),
    },
  };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) return NextResponse.json({ error: "validation", errors: result.errors }, { status: 422 });

  // Bots fill the hidden field: reject without forwarding.
  if (result.data.website) return NextResponse.json({ error: "rejected" }, { status: 400 });

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const { website: _honeypot, ...message } = result.data;
  void _honeypot;
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...message, source: "elembo-rdc.com", receivedAt: new Date().toISOString() }),
    });
    if (!res.ok) return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
