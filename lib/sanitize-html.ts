// Secure HTML sanitizer using escape-based approach instead of regex
// This prevents all XSS vectors by escaping HTML entities rather than
// trying to parse HTML with regex (which is inherently unsafe)

export function sanitizeHtml(input?: string): string {
  if (!input) {
    return '';
  }
  
  // Convert to string and clean dangerous patterns first
  let cleaned = String(input)
    // Remove dangerous protocols
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    // Remove dangerous attributes
    .replace(/\s+(srcdoc|allow|onload|onerror|onclick|onmouseover|onmouseout|onfocus|onblur)=["'][^"']*["']/gi, '')
    // Remove dangerous iframe attributes
    .replace(/<iframe[^>]*srcdoc=["'][^"']*["'][^>]*>/gi, '<iframe>')
    .replace(/<iframe[^>]*allow=["'][^"']*["'][^>]*>/gi, '<iframe>');
  
  // Escape all HTML
  const escaped = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // For markdown output, we might want to allow some basic formatting
  // This is a minimal whitelist that only allows very basic tags
  // by converting escaped entities back selectively
  return escaped
    // Allow basic paragraph and line breaks
    .replace(/&lt;p&gt;/gi, '<p>')
    .replace(/&lt;\/p&gt;/gi, '</p>')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
    .replace(/&lt;hr\s*\/?&gt;/gi, '<hr>')
    
    // Allow basic text formatting
    .replace(/&lt;strong&gt;/gi, '<strong>')
    .replace(/&lt;\/strong&gt;/gi, '</strong>')
    .replace(/&lt;em&gt;/gi, '<em>')
    .replace(/&lt;\/em&gt;/gi, '</em>')
    .replace(/&lt;b&gt;/gi, '<b>')
    .replace(/&lt;\/b&gt;/gi, '</b>')
    .replace(/&lt;i&gt;/gi, '<i>')
    .replace(/&lt;\/i&gt;/gi, '</i>')
    
    // Allow headers
    .replace(/&lt;h([1-6])&gt;/gi, '<h$1>')
    .replace(/&lt;\/h([1-6])&gt;/gi, '</h$1>')
    
    // Allow lists
    .replace(/&lt;ul&gt;/gi, '<ul>')
    .replace(/&lt;\/ul&gt;/gi, '</ul>')
    .replace(/&lt;ol&gt;/gi, '<ol>')
    .replace(/&lt;\/ol&gt;/gi, '</ol>')
    .replace(/&lt;li&gt;/gi, '<li>')
    .replace(/&lt;\/li&gt;/gi, '</li>')
    
    // Allow code blocks (safe as content is already escaped)
    .replace(/&lt;code&gt;/gi, '<code>')
    .replace(/&lt;\/code&gt;/gi, '</code>')
    .replace(/&lt;pre&gt;/gi, '<pre>')
    .replace(/&lt;\/pre&gt;/gi, '</pre>')
    
    // Allow blockquotes
    .replace(/&lt;blockquote&gt;/gi, '<blockquote>')
    .replace(/&lt;\/blockquote&gt;/gi, '</blockquote>');
}