import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Anil Sahith — AI/ML Engineer';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#070809',
          backgroundImage:
            'radial-gradient(900px circle at 15% 0%, rgba(127,224,194,0.16), transparent 55%)',
          padding: 80,
          color: '#F2F5F6',
          fontFamily: 'sans-serif',
        }}
      >
        {/* top: availability */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: '#7FE0C2', display: 'flex' }} />
          <div style={{ fontSize: 22, letterSpacing: 4, color: '#98A0A6', textTransform: 'uppercase' }}>
            Available for work
          </div>
        </div>

        {/* middle: name + role */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            Anil Sahith
          </div>
          <div style={{ display: 'flex', marginTop: 24, fontSize: 44, color: '#7FE0C2', fontWeight: 600 }}>
            AI / ML Engineer
          </div>
        </div>

        {/* bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24, color: '#98A0A6' }}>
          <div style={{ display: 'flex' }}>Real-world AI/ML systems &amp; full-stack products</div>
          <div style={{ display: 'flex', color: '#646C72' }}>github.com/sahit1011</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
