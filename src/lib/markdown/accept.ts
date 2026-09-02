type AcceptPreference = {
  mediaType: string;
  q: number;
  index: number;
};

function parseAcceptHeader(accept: string): AcceptPreference[] {
  return accept
    .split(',')
    .map((entry, index) => {
      const [rawMediaType, ...rawParams] = entry.split(';');
      const mediaType = rawMediaType.trim().toLowerCase();
      const qParam = rawParams
        .map((param) => param.trim())
        .find((param) => param.toLowerCase().startsWith('q='));
      const parsedQ = qParam ? Number(qParam.slice(2)) : 1;
      const q = Number.isFinite(parsedQ) && parsedQ >= 0 ? Math.min(parsedQ, 1) : 0;

      return { mediaType, q, index };
    })
    .filter((entry) => entry.mediaType.length > 0);
}

function getBestQ(preferences: AcceptPreference[], mediaTypes: string[]) {
  return preferences.reduce(
    (best, preference) => {
      if (!mediaTypes.includes(preference.mediaType)) return best;
      if (preference.q > best.q || (preference.q === best.q && preference.index < best.index)) {
        return preference;
      }
      return best;
    },
    { mediaType: '', q: 0, index: Number.POSITIVE_INFINITY },
  );
}

export function prefersMarkdown(accept: string | null) {
  if (!accept) return false;

  const preferences = parseAcceptHeader(accept);
  const markdown = getBestQ(preferences, ['text/markdown']);
  if (markdown.q <= 0) return false;

  const html = getBestQ(preferences, ['text/html', 'application/xhtml+xml']);
  const wildcard = getBestQ(preferences, ['*/*', 'text/*']);
  const bestHtmlLike = html.q >= wildcard.q ? html : wildcard;

  if (bestHtmlLike.q <= 0) return true;
  return markdown.q > bestHtmlLike.q || (markdown.q === bestHtmlLike.q && markdown.index < bestHtmlLike.index);
}
