import { NextRequest, NextResponse } from 'next/server';

const CANONICAL_HOST = 'www.avizsazeh.ir';

export default function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();
  const pathname = request.nextUrl.pathname;
  const shouldCanonicalizeHost =
    host &&
    host !== 'localhost' &&
    host !== '127.0.0.1' &&
    host !== CANONICAL_HOST &&
    (host === 'avizsazeh.ir' || host.endsWith('.vercel.app'));
  const shouldCanonicalizeProtocol =
    host === CANONICAL_HOST && request.nextUrl.protocol !== 'https:';
  const isRussianPath = pathname === '/ru' || pathname.startsWith('/ru/');

  if (shouldCanonicalizeHost || shouldCanonicalizeProtocol || isRussianPath) {
    const url = request.nextUrl.clone();
    if (shouldCanonicalizeHost || shouldCanonicalizeProtocol) {
      url.protocol = 'https:';
      url.host = CANONICAL_HOST;
    }
    if (isRussianPath) {
      url.pathname = pathname.replace(/^\/ru(?=\/|$)/, '/en');
    }
    return NextResponse.redirect(url, 308);
  }

  if (pathname === '/fa' || pathname.startsWith('/fa/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fa(?=\/|$)/, '') || '/';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Match all pathnames except: api, the OG image route, Next internals,
  // and any file with an extension (robots.txt, sitemap.xml, images, …).
  matcher: ['/((?!api|og|_next|_vercel|.*\\..*).*)'],
};
