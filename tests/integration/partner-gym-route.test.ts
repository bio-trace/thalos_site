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
  process.env.PARTNER_GYM_INBOX = 'hello@thalos.at';
});

describe('POST /api/partner-gym', () => {
  it('400 on invalid payload', async () => {
    const res = await POST(req({ name: '', gym: '', city: '', email: 'bad' }));
    expect(res.status).toBe(400);
  });
  it('200 + sends email on valid payload', async () => {
    const res = await POST(req({ name: 'Max', gym: 'DASGYM', city: 'Vienna', email: 'max@example.com', message: 'hi' }));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
