const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderInline = (value: string): string => {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
};

const renderList = (lines: string[]): string => {
  const items = lines
    .map((line) => line.replace(/^[-*]\s+/, '').trim())
    .filter((line) => line.length > 0)
    .map((line) => `<li>${renderInline(line)}</li>`);
  return `<ul>${items.join('')}</ul>`;
};

const renderParagraph = (block: string): string => {
  const trimmed = block.trim();
  if (!trimmed) {
    return '';
  }

  if (/^#{1,6}\s+/.test(trimmed)) {
    const level = Math.min(trimmed.match(/^#+/)?.[0].length ?? 1, 6);
    const text = trimmed.replace(/^#{1,6}\s+/, '');
    return `<h${level}>${renderInline(text)}</h${level}>`;
  }

  if (/^[-*]\s+/.test(trimmed)) {
    const lines = block.split(/\n+/);
    return renderList(lines);
  }

  return `<p>${renderInline(trimmed)}</p>`;
};

export const renderMarkdown = (markdown: string): string => {
  return markdown
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => renderParagraph(block))
    .filter((fragment) => fragment.length > 0)
    .join('\n');
};
