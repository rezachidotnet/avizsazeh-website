import { NextRequest, NextResponse } from 'next/server';
import { prefersMarkdown } from '@/lib/markdown/accept';

const CANONICAL_HOST = 'www.avizsazeh.com';
const markdownInternalHeader = 'x-avizsazeh-markdown-internal';
const markdownPathHeader = 'x-avizsazeh-markdown-path';

function addAcceptVary(response: NextResponse) {
  const fields = response.headers
    .get('vary')
    ?.split(',')
    .map((field) => field.trim())
    .filter(Boolean) ?? [];

  if (!fields.some((field) => field.toLowerCase() === 'accept')) {
    fields.push('Accept');
  }

  response.headers.set('Vary', fields.join(', '));
  return response;
}

function isMarkdownEligibleRequest(request: NextRequest) {
  if (request.headers.get(markdownInternalHeader) === '1') {
    return false;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return false;
  }

  return prefersMarkdown(request.headers.get('accept'));
}

export default function middleware(request: NextRequest) {
  if (request.headers.get(markdownInternalHeader) === '1') {
    return NextResponse.next();
  }

  const host = request.headers.get('host')?.split(':')[0].toLowerCase();
  const pathname = request.nextUrl.pathname;
  const shouldCanonicalizeHost =
    host &&
    host !== 'localhost' &&
    host !== '127.0.0.1' &&
    host !== CANONICAL_HOST &&
    (host === 'avizsazeh.com' || host.endsWith('.vercel.app'));
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
    return addAcceptVary(NextResponse.redirect(url, 308));
  }

  if (pathname === '/fa' || pathname.startsWith('/fa/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fa(?=\/|$)/, '') || '/';
    return addAcceptVary(NextResponse.redirect(url, 308));
  }

  if (isMarkdownEligibleRequest(request)) {
    const markdownUrl = new URL('/api/markdown', request.url);
    markdownUrl.search = '';
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(markdownInternalHeader, '1');
    requestHeaders.set(markdownPathHeader, `${pathname}${request.nextUrl.search}`);
    return addAcceptVary(NextResponse.rewrite(markdownUrl, { request: { headers: requestHeaders } }));
  }

  return addAcceptVary(NextResponse.next());
}

export const config = {
  // Match all pathnames except: api, the OG image route, Next internals,
  // and any file with an extension (robots.txt, sitemap.xml, images, …).
  matcher: ['/((?!api|og|_next|_vercel|.*\\..*).*)'],
};
