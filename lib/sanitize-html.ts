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

  return s;
}
