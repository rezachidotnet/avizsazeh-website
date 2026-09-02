import { NextResponse, type NextRequest } from 'next/server';
import { publicLocales, routing } from '@/i18n/routing';
import { htmlToMarkdown } from '@/lib/markdown/html-to-markdown';

export const runtime = 'nodejs';

const markdownInternalHeader = 'x-avizsazeh-markdown-internal';
const markdownPathHeader = 'x-avizsazeh-markdown-path';
const bodySpecificHeaders = new Set(['content-encoding', 'content-length', 'content-type', 'etag', 'transfer-encoding']);
const managedPassthroughHeaders = new Set(Array.from(bodySpecificHeaders).concat('vary'));
const excludedPathPrefixes = ['/api', '/_next', '/_vercel', '/.well-known', '/brand', '/downloads', '/og'];
const excludedExactPaths = new Set(['/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/favicon.ico']);

function appendVary(value: string | null) {
  const fields = new Set(
    (value ?? '').split(',').map((field) => field.trim()).filter(Boolean),
  );
  fields.add('Accept');
  return Array.from(fields).join(', ');
}

function hasPathTraversal(rawPath: string) {
  const rawPathname = rawPath.split(/[?#]/)[0];
  try {
    return decodeURIComponent(rawPathname).split(/[\\/]+/).some((segment) => segment === '..');
  } catch {
    return true;
  }
}

function isExcludedPath(pathname: string) {
  if (excludedExactPaths.has(pathname) || /\.[^/]+$/.test(pathname)) return true;
  return excludedPathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function getTargetUrl(request: NextRequest) {
  const rawPath = request.nextUrl.searchParams.get('path') ?? request.headers.get(markdownPathHeader);
  if (!rawPath || !rawPath.startsWith('/') || rawPath.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(rawPath) || hasPathTraversal(rawPath)) {
    return null;
  }

  const target = new URL(rawPath, request.nextUrl.origin);
  if (target.origin !== request.nextUrl.origin || isExcludedPath(target.pathname)) return null;
  target.hash = '';
  return target;
}

function getHtmlFetchUrl(target: URL) {
  const fetchUrl = new URL(target);
  const pathSegments = fetchUrl.pathname.split('/').filter(Boolean);
  if (!publicLocales.includes(pathSegments[0] as (typeof publicLocales)[number]) && fetchUrl.pathname !== '/') {
    fetchUrl.pathname = `/${routing.defaultLocale}${fetchUrl.pathname}`;
  }
  return fetchUrl;
}

function passthroughHeaders(source: Response) {
  const headers = new Headers();
  source.headers.forEach((value, key) => {
    if (!managedPassthroughHeaders.has(key.toLowerCase())) headers.set(key, value);
  });
  const contentType = source.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  headers.set('Vary', appendVary(source.headers.get('vary')));
  return headers;
}

function markdownHeaders(source: Response) {
  const headers = passthroughHeaders(source);
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  return headers;
}

export async function GET(request: NextRequest) {
  const target = getTargetUrl(request);
  if (!target) return NextResponse.json({ error: 'Invalid Markdown target path.' }, { status: 400 });

  const source = await fetch(getHtmlFetchUrl(target), {
    headers: { Accept: 'text/html', [markdownInternalHeader]: '1' },
    redirect: 'manual',
  });
  const contentType = source.headers.get('content-type') ?? '';

  if (source.status >= 300 && source.status < 400) {
    return new Response(null, { status: source.status, headers: passthroughHeaders(source) });
  }

  if (!source.ok || !contentType.includes('text/html')) {
    return new Response(await source.text(), { status: source.status, headers: passthroughHeaders(source) });
  }

  return new Response(htmlToMarkdown(await source.text(), target.toString()), {
    status: source.status,
    headers: markdownHeaders(source),
  });
}
