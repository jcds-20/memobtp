import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TURNSTILE_ACTION = 'waitlist_signup';

async function verifyTurnstile(token: unknown, remoteip: string | null): Promise<boolean> {
  if (typeof token !== 'string' || !token) return false;

  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) {
    console.error('TURNSTILE_SECRET manquant : vérification Turnstile impossible.');
    return false;
  }

  const params = new URLSearchParams({ secret, response: token });
  if (remoteip) params.append('remoteip', remoteip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
      signal: AbortSignal.timeout(10_000),
    });

    const result = await res.json().catch(() => null);
    if (!result?.success) return false;
    if (result.action && result.action !== TURNSTILE_ACTION) return false;

    const allowedHostnames = process.env.TURNSTILE_HOSTNAMES
      ?.split(',')
      .map((h) => h.trim())
      .filter(Boolean);
    if (allowedHostnames?.length && !allowedHostnames.includes(result.hostname)) return false;

    return true;
  } catch (err) {
    console.error('Turnstile siteverify error:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { nom, entreprise, email, nb_employes, website, turnstileToken } = body ?? {};

  // Honeypot : un bot qui remplit ce champ caché reçoit un faux succès
  if (website) {
    return NextResponse.json({ success: true });
  }

  if (!nom || !entreprise || !email || !nb_employes) {
    return NextResponse.json({ message: 'Merci de renseigner tous les champs obligatoires.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ message: 'Adresse email invalide.' }, { status: 400 });
  }

  const remoteip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const humanVerified = await verifyTurnstile(turnstileToken, remoteip);
  if (!humanVerified) {
    return NextResponse.json({ message: 'Vérification de sécurité invalide, merci de réessayer.' }, { status: 403 });
  }

  const { error } = await supabase.from('prospects').insert([{ nom, entreprise, email, nb_employes }]);

  if (error) {
    console.error('Supabase insert error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ message: "Cette adresse email est déjà inscrite sur la liste d'attente." }, { status: 409 });
    }
    return NextResponse.json({ message: 'Erreur serveur, merci de réessayer.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
