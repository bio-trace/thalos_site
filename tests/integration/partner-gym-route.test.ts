import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendMock = vi.fn().mockResolvedValue({ id: 'mock' });
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

import { POST } from '@/app/api/partner-gym/route';

function req(body: unknown) {
  return new Request('http://localhost/api/partner-gym', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  sendMock.mockClear();
  process.env.RESEND_API_KEY = 'test';
  process.env.PARTNER_GYM_INBOX = 'notifications@thalos.at';
});

describe('POST /api/partner-gym', () => {
  it('400 on invalid payload', async () => {
    const res = await POST(req({ inquiryType: 'partner_gym', name: '', gym: '', city: '', email: 'bad' }));
    expect(res.status).toBe(400);
  });

  it('200 + sends email for partner_gym', async () => {
    const res = await POST(
      req({
        inquiryType: 'partner_gym',
        name: 'Max',
        gym: 'DASGYM',
        city: 'Vienna',
        email: 'max@example.com',
        message: 'Would love to partner.',
      }),
    );
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
    const args = sendMock.mock.calls[0][0];
    expect(args.subject).toContain('Partner Gym Application');
    expect(args.subject).toContain('DASGYM');
  });

  it('200 + sends email for general (no gym/city)', async () => {
    const res = await POST(
      req({
        inquiryType: 'general',
        name: 'Max',
        email: 'max@example.com',
        message: 'Question about pricing.',
      }),
    );
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
    const args = sendMock.mock.calls[0][0];
    expect(args.subject).toContain('General Inquiry');
    expect(args.subject).toContain('Max');
  });

  it('200 + sends email for first_customer (country/phone, no message)', async () => {
    const res = await POST(
      req({
        inquiryType: 'first_customer',
        name: 'Max',
        email: 'max@example.com',
        country: 'Austria',
        phone: '+43 660 1234567',
      }),
    );
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
    const args = sendMock.mock.calls[0][0];
    expect(args.subject).toContain('First Customer Registration');
    expect(args.subject).toContain('Max');
    expect(args.text).toContain('Country: Austria');
    expect(args.text).toContain('Phone: +43 660 1234567');
  });

  it('400 if first_customer missing phone', async () => {
    const res = await POST(
      req({
        inquiryType: 'first_customer',
        name: 'Max',
        email: 'max@example.com',
        country: 'Austria',
      }),
    );
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('400 if partner_gym missing gym', async () => {
    const res = await POST(
      req({
        inquiryType: 'partner_gym',
        name: 'Max',
        city: 'Vienna',
        email: 'max@example.com',
        message: 'no gym here',
      }),
    );
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
