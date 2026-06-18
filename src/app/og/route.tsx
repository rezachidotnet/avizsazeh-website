import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const size = { width: 1200, height: 630 };

/** Default branded OpenGraph image — engineering charcoal + gold transformation node. */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #0F1113 0%, #16191D 60%, #1A1D21 100%)',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[0.35, 0.55, 0.78, 1].map((h, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 120 * h,
                background: i === 3 ? '#B89A63' : i === 2 ? '#9aa0a8' : '#3B424C',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#B89A63',
              fontSize: 24,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          >
            Architectural Engineering System
          </div>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: -1,
              marginTop: 20,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Engineered ceiling systems, not products.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #2A2F36',
            paddingTop: 28,
          }}
        >
          <div style={{ color: '#FFFFFF', fontSize: 40, fontWeight: 700, letterSpacing: 8 }}>
            AVIZSAZEH
          </div>
          <div style={{ color: '#7A8491', fontSize: 24 }}>avizsazeh.ir</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
