# Upgrade marcduiker-dev to latest Eleventy Excellent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `marcduiker-dev` up to the architecture of Eleventy Excellent v4.6.1 (build-event pipeline, image transform plugin, generated OKLCH color system, a11y testing, submenu nav) while preserving all of Marc's personal content, branding, analytics, and GitHub Pages deployment.

**Architecture:** The upstream template moved CSS/JS compilation from runtime Eleventy template-format plugins (`css-config.js`/`js-config.js`) to pre-build `eleventy.before` events (`build-css.js`/`build-js.js`) using `fast-glob`; replaced `markdown-it-eleventy-img` with a custom markdown image renderer + the official `eleventyImageTransformPlugin`; and replaced the static `colors.json` with a palette generated from `colorsBase.json` via `colorjs.io` (OKLCH). This plan applies those changes, copying verbatim infrastructure files from the local checkout at `C:\dev\personal\eleventy-excellent` and hand-merging the files that carry Marc's personalizations.

**Tech Stack:** Eleventy 3.1.x, Nunjucks, WebC, Tailwind 3.4 + CUBE CSS, PostCSS, esbuild, colorjs.io, pa11y-ci, Node ≥ 20.

**Decisions locked in (from brainstorming):**
- **Full architectural match** — adopt the new build-events pipeline, image transform plugin, and `markdown-it-attrs`.
- **Migrate to generated color palette** — adopt `colorjs.io` + `create-colors.js` + `colorsBase.json`. Re-tune base colors to match Marc's brand.
- Spec saved to `docs/superpowers/plans/`.

**Reference paths:**
- CURRENT repo (the one we modify): `C:\dev\personal\marcduiker-dev` → bash `/c/dev/personal/marcduiker-dev`
- TEMPLATE checkout (read-only source of truth): `C:\dev\personal\eleventy-excellent` → bash `/c/dev/personal/eleventy-excellent`
- In commands below, `$TPL` = `/c/dev/personal/eleventy-excellent`.

---

## Personalizations to PRESERVE (do not overwrite with template versions)

These are Marc's, not template infrastructure. Every task below is written to keep them intact. Treat this as a guard rail — if a step would clobber one of these, stop.

| Area | Keep | Notes |
|---|---|---|
| Analytics | `src/_includes/head/plausible.njk` + its `{% include %}` in `base.njk` | Template removed Plausible; we keep it. |
| Deployment | `.github/workflows/deploy.yml`, `.github/dependabot.yml`, `.devcontainer/`, `.vscode/` | GitHub Pages flow. Do **not** add `netlify.toml`/`vercel.json` from template. |
| Header logo | `src/assets/images/main/marcduiker_name_anim.gif` + animated-GIF header markup | Template uses an SVG logo; we keep the GIF branding. |
| Blog URL | `permalink: /articles/{{ title \| slugify }}/index.html` in `src/posts/posts.json` | Template uses `/blog/`; keep `/articles/`. |
| Custom pages | `src/pages/generative-art.*`, `src/pages/pixel-art.njk` | Do **not** import template `docs/`, `built-with.njk`, `get-started.md`, `sustainability.md`, `accessibility.md`. |
| Custom data | `src/_data/about.json`, `generativeart.json`, `pixelart.json`, `personal.yaml` | Keep. Do not copy template `builtwith.json`. |
| Navigation | `src/_data/navigation.js` content (Articles, Generative Art, Pixel Art, About) | Keep Marc's items; only add submenu *capability* if/when used. |
| Author image | `src/assets/images/main/marcduiker_360.png` | Keep. |
| Brand colors | Pink/gold/blue accents (`#feae34`, `#0095e9`, etc.) | Re-tune `colorsBase.json` to these in Phase 5. |

---

## File Structure (what this plan creates / modifies / deletes)

**Create:**
- `src/_config/events/build-css.js`, `src/_config/events/build-js.js`
- `src/_config/setup/create-colors.js`
- `src/_data/designTokens/colorsBase.json`, `src/_data/designTokens/borderRadius.json`
- `src/assets/css/local/` (renamed from `bundle/`) + `forms.css`, `nav-main-drawer-cls.css`
- `src/assets/css/global/utilities/grayscale.css`
- `src/assets/scripts/bundle/nav-sub.js`, `src/assets/scripts/bundle/dialog.js`
- `src/_includes/webc/custom-peertube.webc`, `custom-peertube-link.webc`
- `src/common/pa11y.njk`
- `src/_includes/schemas/WebSite.njk`, `BlogPosting.njk` (replacing the kebab-case names)

**Modify:**
- `package.json`, `eleventy.config.js`, `src/_config/plugins.js`, `src/_config/collections.js`
- `src/_config/plugins/markdown.js`, `src/_config/shortcodes.js`, `src/_config/shortcodes/image.js`
- `src/_config/utils/clamp-generator.js`
- `tailwind.config.js`, `src/assets/css/global/global.css`, `src/assets/css/global/base/variables.css`
- `src/_data/meta.js`, `src/_data/helpers.js`
- `src/_layouts/{base,page,post,tags}.njk`, `src/_includes/partials/{header,footer,main-nav}.njk`
- `src/_includes/head/{css-inline,meta-info}.njk`

**Delete:**
- `src/_config/plugins/css-config.js`, `src/_config/plugins/js-config.js`
- `src/assets/css/global/blocks/tag.css`, `site-header.css` (only if unused after CSS audit — see Task 5.3)
- `src/assets/css/global/utilities/blur.css` (if unused)
- Stale compiled output in `src/_includes/css/` and `src/_includes/scripts/` (regenerated by build)

---

## Phase 0 — Preparation & baseline

### Task 0.1: Create a working branch and capture a baseline

**Files:** none (git + build only)

- [ ] **Step 1: Create an upgrade branch**

> Per the user's global instructions, do NOT run git state-changing commands unless explicitly asked. Confirm with Marc before running this. If he prefers to branch himself, skip.

```bash
cd /c/dev/personal/marcduiker-dev
git switch -c upgrade/eleventy-excellent-4.6
```

- [ ] **Step 2: Confirm the current build works (baseline)**

Run:
```bash
cd /c/dev/personal/marcduiker-dev
npm run build
```
Expected: completes with no errors; `dist/` is populated. Note any existing warnings so they aren't mistaken for regressions later.

- [ ] **Step 3: Capture baseline screenshots for visual comparison**

Start the dev server and save reference screenshots of: home, an article page, the article list (`/articles/`), generative-art, pixel-art, about, styleguide, and tag page. These are the visual oracle for Phase 5 (color migration).

```bash
cd /c/dev/personal/marcduiker-dev
npm run start
```
Expected: server at `http://localhost:8080`. Screenshot each page (light + dark theme via the theme toggle). Stop the server when done.

- [ ] **Step 4: Record the baseline `dist/` file list**

Run:
```bash
cd /c/dev/personal/marcduiker-dev && find dist -type f | sort > /tmp/dist-baseline.txt && wc -l /tmp/dist-baseline.txt
```
Expected: a file count to diff against after the upgrade.

---

## Phase 1 — Dependencies

### Task 1.1: Update package.json dependencies and scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Bump dependency versions and add new packages**

In `package.json` `dependencies`, set:
```json
"@11ty/eleventy": "^3.1.6",
"@11ty/eleventy-fetch": "^5.1.2",
"@11ty/eleventy-img": "^6.0.4",
"@11ty/eleventy-plugin-rss": "^3.0.0",
"@11ty/eleventy-plugin-syntaxhighlight": "^5.0.2",
"@11ty/eleventy-plugin-webc": "^0.11.2",
"@11ty/is-land": "^4.0.1",
"lite-youtube-embed": "^0.3.4",
"tailwindcss": "^3.4.17"
```

In `devDependencies`, **add**:
```json
"colorjs.io": "^0.6.1",
"fast-glob": "^3.3.3",
"markdown-it-attrs": "^5.0.0",
"pa11y-ci": "^4.1.1"
```

In `devDependencies`, **remove**:
```json
"markdown-it-eleventy-img": "^0.10.2"
```

In `devDependencies`, bump these to match the template:
```json
"autoprefixer": "^10.5.0",
"cross-env": "^10.1.0",
"cssnano": "^8.0.2",
"dayjs": "^1.11.21",
"dotenv": "^17.4.2",
"esbuild": "^0.28.1",
"html-minifier-terser": "^7.2.0",
"js-yaml": "^4.2.0",
"markdown-it": "^14.2.0",
"markdown-it-anchor": "^9.2.0",
"markdown-it-prism": "^3.0.1",
"postcss": "^8.5.15",
"postcss-cli": "^11.0.1",
"postcss-import": "^16.1.1",
"postcss-import-ext-glob": "^2.1.1",
"postcss-js": "^5.1.0",
"prettier-plugin-jinja-template": "^2.2.0",
"rimraf": "^6.1.3",
"sanitize-html": "^2.17.5",
"sharp": "^0.35.1",
"slugify": "^1.6.9",
"svgo": "^4.0.1"
```

> Marc has extra markdown-it plugins the template lacks: `markdown-it-footnote`, `markdown-it-mark`, `markdown-it-abbr`, `markdown-it-emoji`. **Keep them** — they are used in `markdown.js`. Note the template ALSO dropped `markdown-it-link-attributes`? No — both keep it. Do not remove any markdown-it plugin Marc currently uses.

- [ ] **Step 2: Add the `overrides` block from the template**

Add at top level of `package.json` (the template pins a transitive dep):
```json
"overrides": {
  "nanoid": "5.1.7"
}
```

- [ ] **Step 3: Update npm scripts**

Replace the `scripts` block with (note: keep Marc's `dev:11ty` with `ELEVENTY_ENV=development`):
```json
"scripts": {
  "clean": "rimraf dist src/_includes/css src/_includes/scripts",
  "clean:og": "rimraf src/assets/og-images",
  "favicons": "node ./src/_config/setup/generate-favicons.js",
  "colors": "node ./src/_config/setup/create-colors.js",
  "screenshots": "node ./src/_config/setup/generate-screenshots.js",
  "dev:11ty": "cross-env ELEVENTY_ENV=development eleventy --serve",
  "build:11ty": "cross-env ELEVENTY_ENV=production eleventy",
  "start": "npm run dev:11ty",
  "build": "npm run clean && npm run build:11ty",
  "pa11y:build": "npm run clean && cross-env ELEVENTY_ENV=test eleventy",
  "pa11y:test": "sleep 3 && pa11y-ci --config ./dist/pa11y.json",
  "pa11y:serve": "ELEVENTY_ENV=test eleventy --serve --ignore-initial",
  "test:a11y": "npm run pa11y:build && (npm run pa11y:serve &) && sleep 5 && npm run pa11y:test"
}
```

> Rationale: the old `dev:clean`/`--watch` are no longer needed (`--serve` watches, and the new build events handle CSS/JS rebuilds). `clean:og` replaces `dev:clean`.

- [ ] **Step 4: Install**

Run:
```bash
cd /c/dev/personal/marcduiker-dev && npm install
```
Expected: installs cleanly, no peer-dependency errors. If `npm` reports breaking peer deps, resolve before continuing.

- [ ] **Step 5: Commit** *(only if Marc has asked for commits; otherwise pause)*

```bash
git add package.json package-lock.json
git commit -m "chore: bump dependencies to Eleventy Excellent 4.6 baseline"
```

---

## Phase 2 — Build pipeline migration (runtime plugins → before-build events)

### Task 2.1: Add the build-event files

**Files:**
- Create: `src/_config/events/build-css.js`
- Create: `src/_config/events/build-js.js`
- Modify: `src/_config/events.js`

- [ ] **Step 1: Copy the two new event files verbatim from the template**

```bash
TPL=/c/dev/personal/eleventy-excellent
cp "$TPL/src/_config/events/build-css.js" /c/dev/personal/marcduiker-dev/src/_config/events/build-css.js
cp "$TPL/src/_config/events/build-js.js"  /c/dev/personal/marcduiker-dev/src/_config/events/build-js.js
```

These glob `src/assets/css/{global/global.css,local/**/*.css,components/**/*.css}` and `src/assets/scripts/{bundle,components}/**/*.js`, compiling to `src/_includes/css/`, `src/_includes/scripts/`, and `dist/assets/...`. (Confirmed contents — `build-css.js` uses `postcssImportExtGlob, postcssImport, tailwindcss, autoprefixer, cssnano`; `build-js.js` uses esbuild `target: es2020`, bundle, minify.)

- [ ] **Step 2: Update `src/_config/events.js` to export the new builders**

Replace the file with:
```js
import {svgToJpeg} from './events/svg-to-jpeg.js';
import {buildAllCss} from './events/build-css.js';
import {buildAllJs} from './events/build-js.js';

export default {
  svgToJpeg,
  buildAllCss,
  buildAllJs
};
```

### Task 2.2: Rename the CSS source folder `bundle/` → `local/`

**Files:**
- Move: `src/assets/css/bundle/*` → `src/assets/css/local/`

> The new `build-css.js` globs `src/assets/css/local/**/*.css`. Marc's files currently live in `src/assets/css/bundle/`. The 8 files (`custom-card, details, footnotes, gallery, pagination, post, styleguide, table`) must move.

- [ ] **Step 1: Move the folder**

```bash
cd /c/dev/personal/marcduiker-dev
git mv src/assets/css/bundle src/assets/css/local   # if not asked to use git, use: mkdir -p src/assets/css/local && mv src/assets/css/bundle/* src/assets/css/local/ && rmdir src/assets/css/bundle
```

- [ ] **Step 2: Verify the move**

```bash
ls /c/dev/personal/marcduiker-dev/src/assets/css/local
```
Expected: `custom-card.css details.css footnotes.css gallery.css pagination.css post.css styleguide.css table.css`

### Task 2.3: Remove the runtime plugins and wire events into `eleventy.config.js`

**Files:**
- Delete: `src/_config/plugins/css-config.js`, `src/_config/plugins/js-config.js`
- Modify: `src/_config/plugins.js`
- Modify: `eleventy.config.js`

- [ ] **Step 1: Delete the runtime template-format plugins**

```bash
cd /c/dev/personal/marcduiker-dev
rm src/_config/plugins/css-config.js src/_config/plugins/js-config.js
```

- [ ] **Step 2: Update `src/_config/plugins.js`**

Replace with (drops `cssConfig`/`jsConfig`, adds `eleventyImageTransformPlugin`):
```js
// Eleventy
import {EleventyRenderPlugin} from '@11ty/eleventy';
import rss from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import webc from '@11ty/eleventy-plugin-webc';
import {eleventyImageTransformPlugin} from '@11ty/eleventy-img';

// custom
import {markdownLib} from './plugins/markdown.js';
import {drafts} from './plugins/drafts.js';

// Custom transforms
import {htmlConfig} from './plugins/html-config.js';

export default {
  EleventyRenderPlugin,
  rss,
  syntaxHighlight,
  webc,
  eleventyImageTransformPlugin,
  markdownLib,
  drafts,
  htmlConfig
};
```

- [ ] **Step 3: Edit `eleventy.config.js` — add the before-build event hook**

After `export default async function (eleventyConfig) {` and before the watch targets, add:
```js
  // --------------------- Events: before build
  eleventyConfig.on('eleventy.before', async () => {
    await events.buildAllCss();
    await events.buildAllJs();
  });
```

- [ ] **Step 4: Edit `eleventy.config.js` — drop the CSS/JS plugin registrations**

Remove these two lines from the Plugins block:
```js
  eleventyConfig.addPlugin(plugins.cssConfig);
  eleventyConfig.addPlugin(plugins.jsConfig);
```

- [ ] **Step 5: Edit `eleventy.config.js` — register the image transform plugin**

After the `webc` plugin registration, add:
```js
  eleventyConfig.addPlugin(plugins.eleventyImageTransformPlugin, {
    formats: ['webp', 'jpeg'],
    widths: ['auto'],
    htmlOptions: {
      imgAttributes: {
        loading: 'lazy',
        decoding: 'async'
      },
      pictureAttributes: {}
    }
  });
```

- [ ] **Step 6: Edit `eleventy.config.js` — recursive WebC glob**

Change:
```js
    components: ['./src/_includes/webc/*.webc'],
```
to:
```js
    components: ['./src/_includes/webc/**/*.webc'],
```

- [ ] **Step 7: Edit `eleventy.config.js` — remove `setDataDeepMerge`**

The template removed `eleventyConfig.setDataDeepMerge(true);` (deep-merge is the Eleventy 3 default). Delete that line and its `// --------------------- Build Settings` comment.

- [ ] **Step 8: Build and verify the new pipeline produces CSS + JS**

Run:
```bash
cd /c/dev/personal/marcduiker-dev && npm run build
```
Expected: build succeeds. Confirm `src/_includes/css/global.css` and the per-component CSS (e.g. `post.css`) plus `src/_includes/scripts/*.js` were regenerated by the event (check timestamps), and `dist/` is populated.

> NOTE: the collections rename (`onlyMarkdown`→`showInSitemap`), shortcodes, and markdown changes happen in later phases. If the build errors on `showInSitemap` it's because Task 4 not yet done — at this point `eleventy.config.js` still references `onlyMarkdown`, which is fine.

---

## Phase 3 — Image handling (eleventy-img v6 + markdown-it-attrs)

### Task 3.1: Replace the markdown image pipeline

**Files:**
- Modify: `src/_config/plugins/markdown.js`

- [ ] **Step 1: Replace `markdown.js` with the template version, re-adding Marc's extra plugins**

The template dropped `markdown-it-eleventy-img` (now handled by the transform plugin + a custom renderer) and added `markdown-it-attrs`. Marc additionally uses `markdown-it-footnote`, `markdown-it-mark`, `markdown-it-abbr`, `markdown-it-emoji` — **keep these**. Write `src/_config/plugins/markdown.js` as:

```js
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItPrism from 'markdown-it-prism';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItClass from '@toycode/markdown-it-class';
import markdownItLinkAttributes from 'markdown-it-link-attributes';
import {full as markdownItEmoji} from 'markdown-it-emoji';
import markdownItFootnote from 'markdown-it-footnote';
import markdownitMark from 'markdown-it-mark';
import markdownitAbbr from 'markdown-it-abbr';
import {slugifyString} from '../filters/slugify.js';

export const markdownLib = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
})
  .disable('code')
  .use(markdownItAttrs)
  .use(markdownItPrism, {
    defaultLanguage: 'plaintext'
  })
  .use(markdownItAnchor, {
    slugify: slugifyString,
    tabIndex: false,
    permalink: markdownItAnchor.permalink.headerLink({
      class: 'heading-anchor'
    })
  })
  .use(markdownItClass, {})
  .use(markdownItLinkAttributes, [
    {
      // match external links
      matcher(href) {
        return href.match(/^https?:\/\//);
      },
      attrs: {
        rel: 'noopener'
      }
    }
  ])
  .use(markdownItEmoji)
  .use(markdownItFootnote)
  .use(markdownitMark)
  .use(markdownitAbbr)
  .use(md => {
    md.renderer.rules.image = (tokens, idx) => {
      const token = tokens[idx];
      const src = token.attrGet('src');
      const alt = token.content || '';
      const caption = token.attrGet('title');

      // Collect attributes
      const attributes = token.attrs || [];
      const hasEleventyWidths = attributes.some(([key]) => key === 'eleventy:widths');
      if (!hasEleventyWidths) {
        attributes.push(['eleventy:widths', '650,960,1400']);
      }

      const attributesString = attributes.map(([key, value]) => `${key}="${value}"`).join(' ');
      const imgTag = `<img src="${src}" alt="${alt}" ${attributesString}>`;
      return caption ? `<figure>${imgTag}<figcaption>${caption}</figcaption></figure>` : imgTag;
    };
  });
```

> Behaviour change: markdown images now emit a plain `<img eleventy:widths="650,960,1400">` that the `eleventyImageTransformPlugin` (Task 2.3 Step 5) rewrites into responsive `<picture>`. Images referenced in markdown must resolve relative to the input file. **Verify** in Task 3.3 that existing article images still resolve — if a path breaks, prepend the correct relative path in the markdown or add an explicit `eleventy:widths`/path.

> Note: the old config passed `{ol:'list', ul:'list'}` to `markdownItClass` and the template passes `{}`. The template default means `<ol>`/`<ul>` no longer get the `list` class automatically. If Marc's `post.css`/`prose.css` relies on `.list`, **keep** `{ol:'list', ul:'list'}` instead of `{}`. Decide during the CSS audit (Task 5.3); default to keeping Marc's `{ol:'list', ul:'list'}` to avoid regressions.

### Task 3.2: Update the image shortcodes

**Files:**
- Modify: `src/_config/shortcodes/image.js`
- Modify: `src/_config/shortcodes.js`
- Modify: `eleventy.config.js`

- [ ] **Step 1: Copy the template's `image.js` shortcode (adds `imageKeysShortcode`)**

```bash
cp /c/dev/personal/eleventy-excellent/src/_config/shortcodes/image.js \
   /c/dev/personal/marcduiker-dev/src/_config/shortcodes/image.js
```
This exports both `imageShortcode` (positional, backward compatible) and `imageKeysShortcode` (named params), sharing an internal `processImage()`. Defaults: widths `[650,960,1400]`, formats `['avif','webp','jpeg']`, auto `sizes`.

- [ ] **Step 2: Export the new shortcode from `src/_config/shortcodes.js`**

Add `imageKeysShortcode` to the imports and the default export. The file should export `imageShortcode`, `imageKeysShortcode`, `svgShortcode` (match the template's `shortcodes.js` exactly).

- [ ] **Step 3: Register `imageKeys` in `eleventy.config.js`**

After the existing `image` shortcode registration add:
```js
  eleventyConfig.addShortcode('imageKeys', shortcodes.imageKeysShortcode);
```

### Task 3.3: Verify image rendering

- [ ] **Step 1: Build and spot-check images**

```bash
cd /c/dev/personal/marcduiker-dev && npm run build
```
Expected: build succeeds. Open a built article HTML that contains an inline markdown image and confirm a responsive `<picture>` with `avif`/`webp`/`jpeg` sources was generated and the file exists under `dist/assets/images/`.

- [ ] **Step 2: Check the `{% image %}` shortcode usages still render**

Search for shortcode usage and verify each page builds with correct images:
```bash
cd /c/dev/personal/marcduiker-dev && grep -rn "{% image" src --include=*.njk
```
Expected: each call still works (positional signature unchanged: `src, alt, caption, loading, containerClass, imageClass, widths, sizes, formats`). The post layout author image and any `custom-card`/gallery images should render.

---

## Phase 4 — Collections, schemas & sitemap

### Task 4.1: Rename `onlyMarkdown` collection → `showInSitemap`

**Files:**
- Modify: `src/_config/collections.js`
- Modify: `eleventy.config.js`
- Modify: `src/common/sitemap.njk` (if it references the collection)

- [ ] **Step 1: Rename in `collections.js`**

In `src/_config/collections.js` rename the export `onlyMarkdown` → `showInSitemap` and update the comment to `/** All relevant pages as a collection for sitemap.xml */`. Body is unchanged (`collection.getFilteredByGlob('./src/**/*.{md,njk}')`). Keep Marc's `tagList` exclusion list as-is (`['posts', 'docs', 'all']`).

- [ ] **Step 2: Update the import + registration in `eleventy.config.js`**

Change the import `{getAllPosts, onlyMarkdown, tagList}` → `{getAllPosts, showInSitemap, tagList}` and the registration:
```js
  eleventyConfig.addCollection('showInSitemap', showInSitemap);
```

- [ ] **Step 3: Update sitemap template reference if present**

```bash
cd /c/dev/personal/marcduiker-dev && grep -rn "onlyMarkdown" src
```
Expected: any remaining `collections.onlyMarkdown` in `src/common/sitemap.njk` → `collections.showInSitemap`. After edits, the grep returns nothing.

### Task 4.2: Rename JSON-LD schema partials

**Files:**
- Rename: `src/_includes/schemas/base-schema.njk` → `WebSite.njk`
- Rename: `src/_includes/schemas/blogpost-schema.njk` → `BlogPosting.njk`
- Modify: references in layouts

- [ ] **Step 1: Rename the files**

```bash
cd /c/dev/personal/marcduiker-dev/src/_includes/schemas
mv base-schema.njk WebSite.njk
mv blogpost-schema.njk BlogPosting.njk
```

- [ ] **Step 2: Update includes**

```bash
cd /c/dev/personal/marcduiker-dev && grep -rn "base-schema\|blogpost-schema" src
```
Expected: update each `{% include "schemas/base-schema.njk" %}` → `schemas/WebSite.njk` and `blogpost-schema.njk` → `BlogPosting.njk`. Also update any `schema:` front-matter value if layouts switch on it (template uses `schema: BlogPosting`). After edits the grep returns nothing.

---

## Phase 5 — Color system migration (HIGHEST RISK)

> This is the only change that can visibly alter the site. The template generates `colors.json` from `colorsBase.json` (neutral + vibrant palettes via OKLCH) and the new `tailwind.config.js` references **semantic** CSS variables (`--color-light/-dark/-mid/-text/-text-accent/-bg/-bg-accent/-primary/-secondary/-tertiary`) defined in `variables.css`. Marc's current `colors.json` uses flat named tokens (`Base Dark/Light`, `Primary/Secondary/Tertiary/Dark Highlight`). We migrate the system but re-tune the base colors to Marc's brand and verify against Phase 0 screenshots.

### Task 5.1: Add the color generation infrastructure

**Files:**
- Create: `src/_config/setup/create-colors.js`
- Create: `src/_data/designTokens/colorsBase.json`
- Create: `src/_data/designTokens/borderRadius.json`
- Modify: `src/_config/utils/clamp-generator.js`

- [ ] **Step 1: Copy the color generator and borderRadius token verbatim**

```bash
TPL=/c/dev/personal/eleventy-excellent
DST=/c/dev/personal/marcduiker-dev
cp "$TPL/src/_config/setup/create-colors.js"        "$DST/src/_config/setup/create-colors.js"
cp "$TPL/src/_data/designTokens/borderRadius.json"  "$DST/src/_data/designTokens/borderRadius.json"
```

- [ ] **Step 2: Update `clamp-generator.js` to the template version**

The template's `clampGenerator` always returns `{name, value}` objects (the current one returns a bare string when `min === max`). Copy it:
```bash
cp /c/dev/personal/eleventy-excellent/src/_config/utils/clamp-generator.js \
   /c/dev/personal/marcduiker-dev/src/_config/utils/clamp-generator.js
```

- [ ] **Step 3: Create `colorsBase.json` tuned to Marc's brand**

Marc's current accents: Primary Highlight `#feae34` (gold/orange), Secondary Highlight `#0095e9` (blue), base dark `#343434`, base light `#FBFBFB`. Create `src/_data/designTokens/colorsBase.json` as a starting point (re-tuned in Step 4 against screenshots):
```json
{
  "title": "Colors",
  "description": "Hex color codes converted to OKLCH palettes by create-colors.js. neutral and vibrant become palettes; light_dark and standalone are kept as-is.",
  "shades_neutral": [
    {
      "name": "Gray",
      "value": "#343434"
    }
  ],
  "shades_vibrant": [
    {
      "name": "Gold",
      "value": "#feae34"
    },
    {
      "name": "Blue",
      "value": "#0095e9"
    }
  ],
  "light_dark": [
    {
      "name": "Base Dark",
      "value": "#343434"
    },
    {
      "name": "Base Light",
      "value": "#FBFBFB"
    }
  ],
  "standalone": [
    {
      "name": "Tertiary Highlight",
      "value": "#fee761"
    },
    {
      "name": "Dark Highlight",
      "value": "#124e89"
    }
  ]
}
```

- [ ] **Step 4: Generate `colors.json`**

```bash
cd /c/dev/personal/marcduiker-dev && npm run colors
```
Expected: `src/_data/designTokens/colors.json` is regenerated with palette entries (e.g. `Gold 100`…`Gold 900`, `Blue 100`…`Blue 900`, `Gray 100`…`Gray 900`, plus `Base Dark`, `Base Light`, their `Subdued` variants, and standalone colors). Open the file and sanity-check the hex values look right.

### Task 5.2: Update Tailwind config and CSS layers/variables

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/assets/css/global/global.css`
- Modify: `src/assets/css/global/base/variables.css`

- [ ] **Step 1: Adopt the template `tailwind.config.js`**

Copy the template config (adds `borderRadius`, `tokenPrefixes`, `semanticColors`, `ltnavigation` screen, `spot-color` utility):
```bash
cp /c/dev/personal/eleventy-excellent/tailwind.config.js \
   /c/dev/personal/marcduiker-dev/tailwind.config.js
```

> The semantic colors map to `var(--color-light)`, `var(--color-dark)`, `var(--color-mid)`, `var(--color-text)`, `var(--color-text-accent)`, `var(--color-bg)`, `var(--color-bg-accent)`, `var(--color-primary)`, `var(--color-secondary)`, `var(--color-tertiary)`. These variables must exist in `variables.css` (Step 3).

- [ ] **Step 2: Add CSS `layer()` to `global.css`**

Replace `src/assets/css/global/global.css` with the layered version:
```css
@import 'tailwindcss/base' layer(tailwindBase);

@import 'base/reset.css' layer(reset);
@import 'base/fonts.css' layer(fonts);

@import 'tailwindcss/components' layer(tailwindComponents);

@import 'base/variables.css' layer(variables);
@import 'base/global-styles.css' layer(global);

@import-glob 'compositions/*.css' layer(compositions);
@import-glob 'blocks/*.css' layer(blocks);
@import-glob 'utilities/*.css' layer(utilities);

/* debugging */
/* @import-glob 'tests/*.css' layer(test); */

@import 'tailwindcss/utilities' layer(tailwindUtilities);
```

- [ ] **Step 3: Reconcile `variables.css` with the new semantic theme variables**

Open both `src/assets/css/global/base/variables.css` (current) and `$TPL/src/assets/css/global/base/variables.css` (template). The template defines the semantic theme variables (`--color-light/-dark/-mid/-text/-text-accent/-bg/-bg-accent/-primary/-secondary/-tertiary`) and their light/dark-mode mappings, referencing the generated palette steps (e.g. `--color-gold-500`). Update Marc's `variables.css` so that:
  - Every semantic variable referenced by `tailwind.config.js` is defined.
  - Light and dark theme blocks point Marc's brand intent (gold primary, blue secondary) at the new palette tokens.
  - The theme-toggle script's expected variables still exist (see Task 6.x).

This is a hand-merge; show the diff and verify against screenshots in Step 4. Do NOT blindly copy the template `variables.css` — it carries the template's color names.

- [ ] **Step 4: Build and visually compare against Phase 0 baseline**

```bash
cd /c/dev/personal/marcduiker-dev && npm run build && npm run start
```
Expected: home, articles, post, generative-art, pixel-art, about, styleguide, tags all render. Compare light + dark themes against the Phase 0 screenshots. Tune `colorsBase.json` (re-run `npm run colors`) and `variables.css` until the brand colors match acceptably. Stop the server when done.

### Task 5.3: CSS block/utility reconciliation

**Files:**
- Possibly add: `src/assets/css/global/utilities/grayscale.css`
- Possibly add: `src/assets/css/local/forms.css`, `nav-main-drawer-cls.css`
- Audit/remove: `blocks/tag.css`, `blocks/site-header.css`, `utilities/blur.css`

- [ ] **Step 1: Add the new template CSS files that the new nav/forms need**

```bash
TPL=/c/dev/personal/eleventy-excellent
DST=/c/dev/personal/marcduiker-dev
cp "$TPL/src/assets/css/global/utilities/grayscale.css" "$DST/src/assets/css/global/utilities/grayscale.css"
cp "$TPL/src/assets/css/local/forms.css"                "$DST/src/assets/css/local/forms.css"
cp "$TPL/src/assets/css/local/nav-main-drawer-cls.css"  "$DST/src/assets/css/local/nav-main-drawer-cls.css"
```
> `nav-main-drawer-cls.css` is required by the upgraded `main-nav.njk` (Phase 6). `forms.css` styles the new form elements. `grayscale.css` is a utility some template components use.

- [ ] **Step 2: Audit Marc-only block CSS for continued use**

Marc has `blocks/tag.css`, `blocks/site-header.css`, `blocks/site-logo.css`, `blocks/prose.css` and `utilities/blur.css` that the template lacks. These back Marc's custom header/tag styling — **keep any that are still referenced** by his templates.

```bash
cd /c/dev/personal/marcduiker-dev
grep -rn "site-header\|post-tag\|\btag\b\|blur" src/_layouts src/_includes
```
Decision rule: keep `site-header.css` (Marc keeps the GIF header), keep `tag.css` only if Marc's tag markup still uses its classes (the template switched tags to `.button`; Marc keeps `post-tag` per current `post.njk`). Remove `blur.css` only if nothing references `.blur`. Document what was removed.

- [ ] **Step 3: Build**

```bash
cd /c/dev/personal/marcduiker-dev && npm run build
```
Expected: success, no missing-import errors from `@import-glob`.

---

## Phase 6 — Templates, partials & data (with personalization merges)

### Task 6.1: Accessibility & meta improvements (low risk, high value)

**Files:**
- Modify: `src/_data/helpers.js`
- Modify: `src/_includes/head/meta-info.njk`
- Modify: `src/_includes/head/css-inline.njk`

- [ ] **Step 1: Add `aria-current` in `helpers.js`**

In `src/_data/helpers.js`, the active-nav helper currently does `response += ' data-state="active"'`. Change to:
```js
response += ' aria-current="page" data-state="active"';
```

- [ ] **Step 2: Dual theme-color meta tags**

In `src/_includes/head/meta-info.njk`, replace the single theme-color tag with light/dark variants:
```html
<meta name="theme-color" content="{{ meta.themeDark }}" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="{{ meta.themeLight }}" media="(prefers-color-scheme: light)" />
```
> Requires `meta.themeLight` / `meta.themeDark` (Task 6.2). Keep Marc's existing `rel=me`/Mastodon handling, OR adopt the template's `meta.author.me` array loop if Marc adds it in Task 6.2 — pick one and keep it consistent.

- [ ] **Step 3: CSS bundle id `inline` → `local`**

The new build writes per-page CSS under names matched by `getBundle "css", "local"`. In `src/_includes/head/css-inline.njk` change `{% getBundle "css", "inline" %}` → `{% getBundle "css", "local" %}`. Then search every `{%- css "inline" -%}` / `{% css "inline" %}` usage in layouts/partials and change `"inline"` → `"local"`:
```bash
cd /c/dev/personal/marcduiker-dev && grep -rn '"inline"' src/_layouts src/_includes
```
Expected after edits: no `"inline"` bundle references remain; all use `"local"`.

### Task 6.2: Merge `meta.js` (personalization-sensitive)

**Files:**
- Modify: `src/_data/meta.js`

- [ ] **Step 1: Add new template keys without losing Marc's values**

Diff Marc's `src/_data/meta.js` against `$TPL/src/_data/meta.js`. **Add** the new structural keys the upgraded templates expect, keeping Marc's actual values:
  - `themeLight` and `themeDark` (hex strings; use Marc's base light/dark, e.g. `#FBFBFB` / `#343434`) — required by Task 6.1 Step 2.
  - `domain` (Marc's domain).
  - `dialog` object (if Marc adopts the dialog component / search) — otherwise omit and skip `dialog.js`.
  - `subMenu` flag in the navigation object only if Marc uses submenus (his current nav is flat — default to NOT enabling).
  - `tests` object (used by `common/pa11y.njk`, Phase 8) — set the URLs to test.
  - Keep Marc's `author`, `creator`, greenweb/Plausible-related keys. If adopting the template's `meta.author.me` array for `rel=me`, populate with Marc's profiles; otherwise leave his existing structure and keep `meta-info.njk` matching it.

Do not copy the template file wholesale — it carries Lene's data.

### Task 6.3: Layouts (`base`, `page`, `post`, `tags`)

**Files:**
- Modify: `src/_layouts/base.njk`, `page.njk`, `post.njk`, `tags.njk`

- [ ] **Step 1: `base.njk` — keep Plausible, add `indicateActiveHome`**

Keep Marc's `{% include "head/plausible.njk" %}`. Add the template's `{% set indicateActiveHome %}…{% endset %}` block (used by `main-nav.njk` to mark the home link active). Reference `$TPL/src/_layouts/base.njk` lines ~44–48 for the exact block; adapt to Marc's nav structure.

- [ ] **Step 2: `post.njk` — keep `/articles/` + `post-tag`, adopt draft badge & `eleventy:ignore` on author image**

- KEEP Marc's tag markup using `post-tag` class and his article styling (`text-secondary-highlight` is fine if his CSS defines it; only switch to `gradient-text` if he wants the template look).
- ADD the draft badge block (template `post.njk` lines ~25–27) so drafts are visually flagged.
- ADD `eleventy:ignore` attribute to the author image `<img>` so the transform plugin skips the already-processed shortcode output (prevents double processing).
- KEEP `schema:` consistent with the renamed `BlogPosting.njk` (Task 4.2).
- The CSS bundle id must be `"local"` not `"inline"` (Task 6.1 Step 3).
- If Marc wants the named-param image syntax, optionally migrate `{% image … %}` calls to `imageKeys { … }`; otherwise leave positional calls (both work).

- [ ] **Step 3: `page.njk` / `tags.njk` — optional class refresh**

Template switched `text-secondary-highlight` → `gradient-text` and added `text-step-4` on tags. These are cosmetic; apply only if Marc wants the new look. No functional requirement. Default: leave Marc's classes.

### Task 6.4: Partials (`header`, `footer`, `main-nav`)

**Files:**
- Modify: `src/_includes/partials/header.njk`, `footer.njk`, `main-nav.njk`

- [ ] **Step 1: `header.njk` — KEEP Marc's animated GIF logo**

Do **not** switch to the template's `{% svg "misc/logo" %}` + siteName. Keep `{% image "./src/assets/images/main/marcduiker_name_anim.gif" %}`. Keep Marc's `site-header` wrapper (this is why `blocks/site-header.css` stays). If adopting `indicateActiveHome` from Task 6.3, wire it where the home link is.

- [ ] **Step 2: `main-nav.njk` — add drawer/submenu capability**

Adopt the template structure: `data-no-flash` (was `no-flash`), `data-drawer-toggle` on the burger, the `{% css "local" %}` include for `nav-main-drawer-cls.css`, and the optional submenu block guarded by `{% if subMenu %}`/`item.submenu`. Since Marc's nav is flat, the submenu branch is dormant unless `navigation.js` items gain a `submenu` array. Reference `$TPL/src/_includes/partials/main-nav.njk` for exact markup. Ensure the `nav-sub.js` include only fires when a submenu exists.

- [ ] **Step 3: `footer.njk` — selectively adopt button styling**

Optional cosmetic: template gives RSS/platform links `class="button" data-icon` and adds an Eleventy credit. Keep Marc's "Made with love by {{ meta.creator.name }}" attribution. Adopt the `.button`/`data-icon` link styling only if Marc wants it (requires the icon CSS). Default: keep Marc's footer, optionally apply spacing utilities (`mt-l-xl p-s-m`).

### Task 6.5: WebC components & scripts

**Files:**
- Create: `src/_includes/webc/custom-peertube.webc`, `custom-peertube-link.webc`
- Create: `src/assets/scripts/bundle/nav-sub.js`
- Optional: `src/assets/scripts/bundle/dialog.js`

- [ ] **Step 1: Copy the PeerTube WebC components (optional but low-cost)**

```bash
TPL=/c/dev/personal/eleventy-excellent
DST=/c/dev/personal/marcduiker-dev
cp "$TPL/src/_includes/webc/custom-peertube.webc"      "$DST/src/_includes/webc/custom-peertube.webc"
cp "$TPL/src/_includes/webc/custom-peertube-link.webc" "$DST/src/_includes/webc/custom-peertube-link.webc"
```
> Marc may never use PeerTube; these are inert until referenced. Skip if undesired. Marc's `custom-youtube.webc` `border-radius` (`0.5em`) is his choice — keep it.

- [ ] **Step 2: Add `nav-sub.js` (required if submenu enabled)**

```bash
cp /c/dev/personal/eleventy-excellent/src/assets/scripts/bundle/nav-sub.js \
   /c/dev/personal/marcduiker-dev/src/assets/scripts/bundle/nav-sub.js
```
> The new build globs `scripts/bundle/**` so this compiles automatically. Marc's existing `nav-drawer.js`, `theme-toggle.js`, `details.js`, `gallery.js`, `is-land.js` stay. (Template renamed/added; keep Marc's `gallery.js`.)

- [ ] **Step 3: `dialog.js` — only if Marc adopts the dialog component**

Skip unless Marc adds a search/dialog UI and the `dialog` key in `meta.js`. Listed for completeness.

---

## Phase 7 — Accessibility testing (pa11y)

### Task 7.1: Wire up pa11y-ci

**Files:**
- Create: `src/common/pa11y.njk`
- Already done: scripts in Task 1.1, `pa11y.njk` ignore in config (Task 7.1 Step 2)

- [ ] **Step 1: Copy the pa11y config template**

```bash
cp /c/dev/personal/eleventy-excellent/src/common/pa11y.njk \
   /c/dev/personal/marcduiker-dev/src/common/pa11y.njk
```
This generates `dist/pa11y.json` from `meta.tests` URLs (set in Task 6.2). Adjust the templated URL list to Marc's pages (home, an article, articles list, generative-art, pixel-art, about).

- [ ] **Step 2: Add the test-env ignore to `eleventy.config.js`**

Before the `return {…}` general config block, add:
```js
  // ----------------------  ignore test files
  if (process.env.ELEVENTY_ENV != 'test') {
    eleventyConfig.ignores.add('src/common/pa11y.njk');
  }
```

- [ ] **Step 3: Run the a11y test suite**

```bash
cd /c/dev/personal/marcduiker-dev && npm run test:a11y
```
Expected: pa11y builds the test env, serves, and runs against the configured URLs. Triage any reported issues (some may pre-exist). A clean run (or only known/accepted issues) means the harness works.

---

## Phase 8 — Final verification

### Task 8.1: Full build and regression check

- [ ] **Step 1: Clean production build**

```bash
cd /c/dev/personal/marcduiker-dev && npm run build
```
Expected: completes with no errors.

- [ ] **Step 2: Diff the output tree against baseline**

```bash
cd /c/dev/personal/marcduiker-dev && find dist -type f | sort > /tmp/dist-after.txt && diff /tmp/dist-baseline.txt /tmp/dist-after.txt
```
Expected: differences are explained by intended changes (new image formats/widths, renamed CSS bundles, regenerated assets). No unexpected missing pages. Investigate any removed HTML page.

- [ ] **Step 3: Serve and walk every page type**

```bash
cd /c/dev/personal/marcduiker-dev && npm run start
```
Manually verify against Phase 0 screenshots, in BOTH light and dark themes:
  - Home, `/articles/` list, a single article (images, code highlighting, footnotes, tags link to tag pages)
  - Generative-art, pixel-art (custom data-driven pages)
  - About, styleguide, a tag page, 404
  - Header GIF logo renders; nav works; theme toggle works; footer + Plausible script present
  - RSS feed (`/feed.xml` or configured path) and sitemap (`/sitemap.xml`) build and are valid

- [ ] **Step 4: Verify Plausible + GitHub Pages deploy untouched**

```bash
cd /c/dev/personal/marcduiker-dev
grep -rn "plausible" src/_includes
ls .github/workflows/deploy.yml .github/dependabot.yml
```
Expected: Plausible include intact; deploy workflow + dependabot present and unmodified.

- [ ] **Step 5: Commit** *(only if Marc has asked for commits)*

```bash
git add -A
git commit -m "feat: upgrade to Eleventy Excellent 4.6 architecture (build events, image transform, generated colors, a11y testing)"
```

---

## Self-Review (completed by plan author)

**Spec coverage:** Every diff surfaced in analysis maps to a task — dependencies (P1), build-event pipeline + `bundle`→`local` + config (P2), image transform + markdown-it-attrs + `imageKeys` (P3), collection rename + schema rename (P4), generated OKLCH colors + tailwind/layers/variables + CSS reconciliation (P5), a11y/meta/theme-color + meta.js + layouts + partials + WebC/scripts (P6), pa11y (P7), verification (P8). Personalizations are enumerated up front and guarded in each task.

**Risk hot-spots flagged:** Phase 5 (color migration — visual) and Task 3.1 (markdown image resolution + `markdownItClass` list classes) carry the most regression risk; both have explicit verify-against-baseline steps. `variables.css` is a hand-merge, not a copy.

**Open items requiring Marc's input during execution (not blockers for the plan):** whether to adopt cosmetic `gradient-text`/button-styled footer looks; whether to enable submenus, dialog/search, and PeerTube; final tuned values in `colorsBase.json`/`variables.css`. Defaults are specified for each (keep Marc's current look unless he opts in).
