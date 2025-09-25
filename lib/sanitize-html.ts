// Minimal server-side HTML sanitizer for Markdown output.
// This is intentionally conservative: it strips <script> tags, event handler
// attributes (on*), and javascript: URLs. It's not a full-featured sanitizer
// like DOMPurify, but it reduces the most-common XSS vectors for generated
// HTML coming from trusted markdown sources. Replace with a vetted library
// (e.g. isomorphic-dompurify) if stricter guarantees are required.

export function sanitizeHtml(input?: string): string {
  if (!input) {
    return '';
  }
  let s = String(input);

  // Remove script tags entirely (improved pattern to handle edge cases)
  s = s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove inline event handlers like onclick="..." or onmouseover='...' (improved pattern)
  s = s.replace(/\bon[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

  // Remove javascript: URLs in href/src attributes (improved to handle encoding)
  s = s.replace(/(href|src)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, (match, attr) => {
    const decoded = match.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
                         .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
                         .toLowerCase();
    if (decoded.includes('javascript:') || decoded.includes('vbscript:') || decoded.includes('data:text/html')) {
      return `${attr}="#"`;
    }
    return match;
  });

  // Remove data: URLs that could embed scripts (improved pattern)
  s = s.replace(/(href|src)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, (match, attr) => {
    if (match.toLowerCase().includes('data:') && !match.toLowerCase().match(/data:(image\/|font\/)/)) {
      return `${attr}="#"`;
    }
    return match;
  });

  // Strip style attributes that may contain expressions or urls
  s = s.replace(/\sstyle\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (m) => {
    const val = m.split('=')[1] || '';
    const low = val.toLowerCase();
    if (low.includes('expression(') || low.includes('url(') || low.includes('javascript:')) {
      return '';
    }
    // keep benign style attributes
    return m;
  });

  // Remove srcdoc attribute on iframes
  s = s.replace(/\ssrcdoc\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Ensure iframes (if any) do not allow scripts by removing allow attributes (very conservative)
  s = s.replace(/\sallow\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  return s;
}
