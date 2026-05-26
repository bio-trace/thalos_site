import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #0A1A2F 0%, #0A1A2F 45%, #00E0FF 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80,
          color: 'white', fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, color: '#00E0FF', textTransform: 'uppercase' }}>
          AI PERFORMANCE COACH · VIENNA
        </div>
        <div style={{ fontSize: 92, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>
          Stop guessing.<br />Start adapting.
        </div>
        <div style={{ fontSize: 30, color: '#446C8F', marginTop: 32 }}>thalos.at</div>
      </div>
    ),
    size,
  );
}
