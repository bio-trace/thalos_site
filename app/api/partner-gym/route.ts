import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema, type InquiryType } from '@/lib/validation';

const SUBJECT_PREFIX: Record<InquiryType, string> = {
  partner_gym: 'Partner Gym Application',
  general: 'General Inquiry',
  founding_athlete: 'Founding Athlete',
  press: 'Press Inquiry',
  other: 'Inquiry',
};

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const prefix = SUBJECT_PREFIX[data.inquiryType];

  const subject =
    data.inquiryType === 'partner_gym'
      ? `${prefix} — ${data.gym} (${data.city})`
      : `${prefix} — ${data.name}`;

  const lines: string[] = [
    `Type: ${prefix}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
  ];
  if (data.inquiryType === 'partner_gym') {
    lines.push(`Gym: ${data.gym}`);
    lines.push(`City: ${data.city}`);
  }
  lines.push('', data.message);

  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: 'Thalos <noreply@thalos.at>',
    to: [process.env.PARTNER_GYM_INBOX!],
    reply_to: data.email,
    subject,
    text: lines.join('\n'),
  });

  return NextResponse.json({ ok: true });
}
