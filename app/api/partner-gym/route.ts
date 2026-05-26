import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { partnerGymSchema } from '@/lib/validation';

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const parsed = partnerGymSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', issues: parsed.error.issues }, { status: 400 });
  }

  const { name, gym, city, email, message } = parsed.data;
  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: 'Thalos <noreply@thalos.at>',
    to: [process.env.PARTNER_GYM_INBOX!],
    reply_to: email,
    subject: `Partner Gym Application — ${gym} (${city})`,
    text: `Name: ${name}\nGym: ${gym}\nCity: ${city}\nEmail: ${email}\n\n${message}`,
  });

  return NextResponse.json({ ok: true });
}
