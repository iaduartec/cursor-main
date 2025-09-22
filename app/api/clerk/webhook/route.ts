import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Clerk sends webhook signatures in header 'Clerk-Signature' with format: t=timestamp,v1=signature
// We'll verify using HMAC SHA256 with the CLERK_WEBHOOK_SECRET

function parseClerkSignature(header: string | null) {
  if (!header) return null;
  const parts = header.split(',').map(p => p.split('='));
  const map: Record<string, string> = {};
  for (const [k, v] of parts as Array<[string, string]>) {
    map[k] = v;
  }
  return map;
}

async function sendAdminEmail(email: string, name?: string, event?: string) {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !ADMIN_NOTIFICATION_EMAIL
  ) {
    console.warn('SMTP or admin email not configured, skipping email');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: `No-Reply <${SMTP_USER}>`,
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `Clerk webhook: ${event || 'user event'} - ${email}`,
    text: `Evento: ${event}\nCorreo: ${email}\nNombre: ${name || 'N/A'}`,
  });
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  const raw = await req.text();
  const sigHeader =
    req.headers.get('Clerk-Signature') || req.headers.get('clerk-signature');

  if (!secret || !sigHeader) {
    return NextResponse.json(
      { ok: false, error: 'Missing webhook secret or signature' },
      { status: 400 }
    );
  }

  const sig = parseClerkSignature(sigHeader);
  if (!sig || !sig.v1) {
    return NextResponse.json(
      { ok: false, error: 'Invalid signature header' },
      { status: 400 }
    );
  }

  // Compute HMAC SHA256 of the raw body using the secret
  const hmac = crypto.createHmac('sha256', secret).update(raw).digest('hex');

  if (hmac !== sig.v1) {
    return NextResponse.json(
      { ok: false, error: 'Signature mismatch' },
      { status: 401 }
    );
  }

  // Parse payload
  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  // Clerk event types may vary; handle user.created and user.verified
  const { type, data } = payload;

  try {
    if (type === 'user.created' || type === 'user.verified') {
      const email =
        data?.primary_email_address ||
        data?.email ||
        data?.email_addresses?.[0]?.email_address;
      const name = data?.first_name || data?.name;
      if (email) {
        await sendAdminEmail(email, name, type);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error processing clerk webhook:', err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
