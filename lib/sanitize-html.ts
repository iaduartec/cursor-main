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

  // Remove script tags entirely
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

  // Remove inline event handlers like onclick="..." or onmouseover='...'
  s = s.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Remove javascript: URLs in href/src attributes
  s = s.replace(/(href|src)\s*=\s*("|')?\s*javascript:[^"'>\s]*/gi, '$1="#"');

  // Remove data: URLs that could embed scripts (allow only images/fonts)
  s = s.replace(/(href|src)\s*=\s*("|')?\s*data:(?!image\/|font\/)[^"'>\s]*/gi, '$1="#"');

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
