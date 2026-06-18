import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getExcerpt} from './excerpt.js';

test('strips shortcodes, markdown and html', () => {
  const raw = `{% image "x.jpg", "alt", "cap", [960] %}\n\n**TLDR:** see [the repo](https://example.com).\n\n---\nThis is the body text.`;
  const result = getExcerpt(raw);
  assert.ok(!result.includes('{%'), 'no shortcode braces');
  assert.ok(!result.includes(']('), 'no markdown link syntax');
  assert.ok(!result.includes('**'), 'no bold markers');
  assert.ok(result.includes('see the repo'), 'keeps link text');
  assert.ok(result.includes('This is the body text'), 'keeps body');
});

test('truncates to <=156 chars at a word boundary with ellipsis', () => {
  const raw = 'word '.repeat(100);
  const result = getExcerpt(raw);
  assert.ok(result.length <= 156, `length was ${result.length}`);
  assert.ok(result.endsWith('…'), 'ends with ellipsis');
  assert.ok(!result.endsWith('wor…'), 'cut at word boundary, not mid-word');
});

test('short input is returned without ellipsis', () => {
  assert.equal(getExcerpt('Hello world.'), 'Hello world.');
});

test('empty input returns empty string', () => {
  assert.equal(getExcerpt(), '');
  assert.equal(getExcerpt(''), '');
});
