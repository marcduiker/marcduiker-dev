/**
 * Builds a nested table-of-contents <nav> from rendered post HTML.
 *
 * Relies on `markdown-it-anchor` having already added slugified `id`
 * attributes to the headings (see src/_config/plugins/markdown.js), so this
 * filter only has to read those ids back out and nest them by level.
 */

// Matches <h2|h3|h4 ... id="slug" ...>inner content</h2|3|4>.
const HEADING_RE = /<h([234])\b[^>]*?\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi;

const stripTags = html =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const collectHeadings = content => {
  const headings = [];
  let match;
  while ((match = HEADING_RE.exec(content)) !== null) {
    const [, level, id, inner] = match;
    const text = stripTags(inner);
    if (text) {
      headings.push({level: Number(level), id, text});
    }
  }
  return headings;
};

const renderList = headings => {
  const baseLevel = Math.min(...headings.map(h => h.level));
  let html = '<ul role="list">';
  let prevLevel = baseLevel;

  headings.forEach((heading, index) => {
    if (index === 0) {
      // first item, list already opened
    } else if (heading.level > prevLevel) {
      // Descend: open a nested list for every level we step down into.
      for (let level = prevLevel; level < heading.level; level += 1) {
        html += '<ul role="list">';
      }
    } else if (heading.level < prevLevel) {
      // Ascend: close the current item and every nested list we leave.
      html += '</li>';
      for (let level = prevLevel; level > heading.level; level -= 1) {
        html += '</ul></li>';
      }
    } else {
      // Same level: close the previous item.
      html += '</li>';
    }

    html += `<li><a href="#${heading.id}">${heading.text}</a>`;
    prevLevel = heading.level;
  });

  // Close the final item and any lists still open.
  html += '</li>';
  for (let level = prevLevel; level > baseLevel; level -= 1) {
    html += '</ul></li>';
  }
  html += '</ul>';

  return html;
};

/**
 * @param {string} content - rendered post HTML
 * @param {number} minHeadings - suppress the TOC below this many headings
 * @returns {string} TOC markup, or an empty string when there is nothing worth listing
 */
export const tableOfContents = (content, minHeadings = 2) => {
  if (typeof content !== 'string') {
    return '';
  }

  const headings = collectHeadings(content);
  if (headings.length < minHeadings) {
    return '';
  }

  return `<nav class="toc" aria-label="Table of contents">${renderList(headings)}</nav>`;
};
