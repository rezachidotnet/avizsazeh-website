import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const size = { width: 1200, height: 630 };

/** Default branded OpenGraph image — transparent-background logo on the dark plate. */
export async function GET(request: Request) {
  // Same-origin as the running deployment (localhost in dev, live domain in prod),
  // so the logo always resolves without depending on a hardcoded host.
  const origin = new URL(request.url).origin;

  let logo = false;
  try {
    const res = await fetch(`${origin}/brand/standard-logo-trans.png`, {
      cache: 'force-cache',
    });
    logo = res.ok;
  } catch {
    logo = false;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0F1113 0%, #16191D 60%, #1A1D21 100%)',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {logo ? (
          <div style={{ display: 'flex', alignSelf: 'flex-start' }}>
            {/* transparent-background logo — sits directly on the dark plate, no box */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${origin}/brand/standard-logo-trans.png`} height={72} alt="AvizSazeh logo" />
          </div>
        ) : (
          <div style={{ color: '#FFFFFF', fontSize: 44, fontWeight: 700, letterSpacing: 8 }}>
            AVIZSAZEH
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#B89A63', fontSize: 24, letterSpacing: 6, textTransform: 'uppercase' }}>
            Architectural Engineering System
          </div>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: -1,
              marginTop: 20,
              lineHeight: 1.1,
              maxWidth: 920,
            }}
          >
            Engineered ceiling systems, not products.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            borderTop: '1px solid #2A2F36',
            paddingTop: 24,
            color: '#7A8491',
            fontSize: 24,
          }}
        >
          avizsazeh.ir
        </div>
      </div>
    ),
    { ...size },
  );
}
