const MAX = 155;

// Derives a plain-text excerpt from raw markdown/Nunjucks post source.
// Used as a fallback meta description when a post has no `description`.
export const getExcerpt = (rawInput = '') => {
  const text = rawInput
    .replace(/{%[\s\S]*?%}/g, ' ') // {% shortcode %}
    .replace(/{{[\s\S]*?}}/g, ' ') // {{ expression }}
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // ![alt](src)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [text](href) -> text
    .replace(/<[^>]*>/g, ' ') // html tags
    .replace(/^[ \t]*[#>*\-+]+[ \t]*/gm, ' ') // leading md markers (#, >, *, -, +)
    .replace(/[*_~`]+/g, ' ') // remaining emphasis markers
    .replace(/-{3,}/g, ' ') // --- horizontal rules
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();

  if (text.length <= MAX) return text;
  const cut = text.slice(0, MAX);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '…';
};
