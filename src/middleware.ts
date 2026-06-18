import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except: api, the OG image route, Next internals,
  // and any file with an extension (robots.txt, sitemap.xml, images, …).
  matcher: ['/((?!api|og|_next|_vercel|.*\\..*).*)'],
};
