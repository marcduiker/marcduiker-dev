# Personal website of Marc Duiker

This site is based on the [Eleventy Excellent starter](https://github.com/madrilene/eleventy-excellent) by Lene Saile. It was originally forked from v3.7.4 and upgraded to [v4.6.1](https://github.com/madrilene/eleventy-excellent/releases/tag/v4.6.1).

[marcduiker.dev](https://marcduiker.dev)

## Using this repo

1. Use the devcontainer to set up your environment.
2. Run `npm install --include=optional sharp` to install dependencies.
3. Run `npm run start` to start the Eleventy dev server.

## How it works (technical overview)

This is a static website built with [Eleventy (11ty) v3](https://www.11ty.dev/). There is no runtime backend; everything is generated into static HTML/CSS/JS at build time and served from GitHub Pages.

### Tech stack

- **Static site generator:** Eleventy v3 (ESM config in `eleventy.config.js`).
- **Templating:** Nunjucks (`.njk`), Markdown (`.md`), and [WebC](https://www.11ty.dev/docs/languages/webc/) components.
- **Styling:** Tailwind CSS + PostCSS, with design tokens in `src/_data/designTokens/`. The color palette in `designTokens/colors.json` is **generated** from `designTokens/colorsBase.json` by `npm run colors` (OKLCH via `colorjs.io`) — edit `colorsBase.json`, not `colors.json`. CSS and JS are compiled by `eleventy.before` build events (see below), not committed.
- **Images:** `@11ty/eleventy-img` via the `{% image %}` shortcode (generates optimized/responsive images); `sharp` is the image processing engine. Animated GIFs are preserved as animated WebP — see [Customizations to re-apply after upgrading](#customizations-to-re-apply-after-upgrading-eleventy-excellent).
- **Feeds & SEO:** RSS/Atom + JSON feeds, sitemap, robots, Open Graph images — all generated from templates in `src/common/`.

### Build & deploy

- `npm run start` — dev server with live reload (`ELEVENTY_ENV=development`).
- `npm run build` — production build into `dist/` (`ELEVENTY_ENV=production`).
- **Deployment:** `.github/workflows/deploy.yml` builds and deploys `dist/` to **GitHub Pages** on every push to `main`. The Eleventy `.cache/` (used by `@11ty/eleventy-fetch`) and npm cache are persisted between runs.
- `dist/`, `.cache/`, and generated CSS/JS under `src/_includes/` are git-ignored build artifacts — do not edit them by hand.

### Where the content lives

| Content | Location | Notes |
|---|---|---|
| **Blog articles** | `src/posts/<year>/YYYY-MM-DD-slug.md` | One Markdown file per article, grouped into year folders. Frontmatter: `title`, `description`, `date`. Defaults (`layout: post`, `tags: posts`, permalink `/articles/<slugified-title>/`) come from `src/posts/posts.json`. |
| **Standalone pages** | `src/pages/*.njk` and `*.md` | e.g. `about.njk`, `blog.njk` (articles index, paginated), `index.njk` (home), `generative-art.md`, `pixel-art.njk`, `legal.md`, `privacy.md`, `styleguide.njk`. |
| **Generative art gallery** | data: `src/_data/generativeart.json` · images: `src/assets/images/generativeart/` | Each entry has `name`, `link` (fxhash), `filename`. |
| **Pixel art gallery** | data: `src/_data/pixelart.json` · images: `src/assets/images/pixelart/` | Each entry has `name`, `description`, `filename`. |
| **About page images** | data: `src/_data/about.json` · images: `src/assets/images/about/` | Prose for the About page is inline in `src/pages/about.njk`. |
| **Blog images** | `src/assets/images/blog/<year>/` (plus `blog/common/`) | Referenced from posts via the `{% image %}` shortcode. |
| **Social links** | `src/_data/personal.yaml` | Platform URLs (Bluesky, LinkedIn, Sessionize, GitHub, etc.). |
| **Site metadata** | `src/_data/meta.js` | Site name, description, author, theme colors, RSS feed config, default OG image. |
| **Top navigation** | `src/_data/navigation.js` | Header menu items. |

### How the site is assembled

- **`src/_config/`** holds the Eleventy configuration modules wired up in `eleventy.config.js`:
  - `collections.js` — `allPosts`, `showInSitemap` (for sitemap), `tagList`.
  - `filters.js`, `shortcodes.js` (incl. `svg`, `image`, `imageKeys`, `year`), `plugins.js`, `events.js`, and `setup/` scripts (`generate-favicons.js`, `generate-screenshots.js`, `create-colors.js`).
  - `events.js` wires up the `eleventy.before` build step that compiles all CSS (`events/build-css.js`) and JS (`events/build-js.js`) into `src/_includes/`, plus SVG→JPEG OG image generation (`events/svg-to-jpeg.js`).
- **`src/_layouts/`** — page shells: `base.njk`, `page.njk`, `post.njk`, `tags.njk` (referenced via layout aliases).
- **`src/_includes/`** — `partials/` (Nunjucks snippets like `card-blog.njk`, `gallery.njk`, `header.njk`, `footer.njk`, `pagination.njk`), `webc/` (WebC components like `custom-card`, `custom-masonry`, `custom-youtube`), plus `head/`, `schemas/`, and generated `css/`/`scripts/`.
- **`src/common/`** — non-page outputs: feeds (`feed-atom.njk`, `feed-json.njk`), `sitemap.njk`, `robots.njk`, `og-images.njk`, `site-manifest.njk`, `tags.njk`/`tagList.njk`, `404.md`, `_redirects.njk`.

### Customizations to re-apply after upgrading Eleventy Excellent

This site is a customized fork of Eleventy Excellent. Some customizations are not part of the upstream template and **must be re-applied (or verified) after pulling in a newer Eleventy Excellent version**, because an upgrade can overwrite the relevant files with the upstream versions.

#### Animated GIFs → animated WebP

**Problem:** Upstream Eleventy Excellent has no animated-GIF support. Its `src/_config/shortcodes/image.js` runs every image through `sharp` without enabling multi-frame reading, so animated GIFs are flattened to a single static frame (and the default `<img>` fallback is a static JPEG). All animated GIFs on this site (the header logo `marcduiker_name_anim.gif` and several in blog posts) are rendered with the `{% image %}` shortcode, so the fix lives entirely in that one file.

**Fix:** In `src/_config/shortcodes/image.js`, inside `processImage()`:

1. Pass `sharpOptions` to the `Image()` call so `sharp` reads all frames:

   ```js
   const metadata = await Image(src, {
     widths: [...widths],
     formats: [...formats],
     urlPath: '/assets/images/',
     outputDir: './dist/assets/images/',
     // Preserve animation for animated sources (e.g. .gif). With `animated: true`,
     // eleventy-img reads every frame and auto-restricts the output of animated
     // images to animation-capable formats (webp/gif), dropping avif/jpeg. Static
     // images are unaffected. `limitInputPixels: false` allows large multi-frame GIFs.
     sharpOptions: {
       animated: true,
       limitInputPixels: false
     },
     filenameFormat: (id, src, width, format, options) => {
       const extension = path.extname(src);
       const name = path.basename(src, extension);
       return `${name}-${width}w.${format}`;
     }
   });
   ```

2. Make the `<img>` fallback format-agnostic. eleventy-img v6 auto-filters animated sources down to webp/gif only (its `ANIMATED_TYPES`), so an animated GIF produces **no** `metadata.jpeg` and the upstream `const lowsrc = metadata.jpeg[...]` would crash:

   ```js
   // Fallback <img src>: prefer a static raster format, but fall back to whatever
   // was generated (animated GIFs yield only webp, so metadata.jpeg is undefined).
   const fallbackFormat = metadata.jpeg || metadata.png || metadata.webp || Object.values(metadata)[0];
   const lowsrc = fallbackFormat[fallbackFormat.length - 1];
   ```

**Notes for eleventy-img v6+:** You no longer need to hard-code `formats: ['webp']` for GIFs (as older versions required) — eleventy-img detects animation and automatically drops the non-animatable formats, so static images keep the full `avif`/`webp`/`jpeg` treatment while GIFs become animated WebP.

**How to verify:** Run `npm run build` (it runs `clean` first, which is important — eleventy-img reuses deterministic on-disk filenames, so an incremental rebuild can leave a stale static version behind). Then confirm a generated file is animated, e.g. it contains the WebP `ANIM` chunk:

```bash
grep -c -a "ANIM" dist/assets/images/marcduiker_name_anim-207w.webp   # > 0 means animated
```

### Eleventy Excellent 4.6 features not used yet (but available)

The upgrade to v4.6.1 brought capabilities this site doesn't lean on yet. They're listed here so they're easy to pick up later.

#### Ready to use now (already wired into this repo)

- **`{% imageKeys %}` shortcode** — a named-parameter alternative to `{% image %}`, handy when you only want to set a couple of options without remembering positional order. Example: `{% imageKeys { src: "/assets/images/blog/2025/foo.png", alt: "Foo", widths: [800], loading: "eager" } %}`. (Defined alongside `image` in `src/_config/shortcodes/image.js`.)
- **Automatic optimization of plain Markdown images** — standard `![alt](path 'caption')` images are now run through `@11ty/eleventy-img` automatically (the Markdown renderer adds `eleventy:widths` and the image transform plugin generates responsive `<picture>` output). This means new posts don't strictly need the `{% image %}` shortcode for simple cases. Override widths per image with `![alt](path){eleventy:widths="400,800"}`.
- **`markdown-it-attrs`** — add classes/IDs/attributes directly in Markdown, e.g. `## My heading {.fancy #intro}` or `Some text {.lead}`. Enabled in `src/_config/plugins/markdown.js`.
- **Semantic theme color utilities** — Tailwind classes mapped to the theme custom properties: `text-theme-primary`, `text-theme-secondary`, `text-theme-tertiary`, `bg-theme-bg`, `bg-theme-bg-accent`, `text-theme-text-accent`, etc. (defined in `tailwind.config.js`). These follow light/dark mode automatically. The article/page H1s already use `text-theme-secondary`.
- **`spot-color-*` utility** — sets the `--spot-color` custom property (e.g. `spot-color-gold`, `spot-color-blue`) for components that key an accent off a single variable.
- **Border-radius tokens** — `rounded-small` / `rounded-medium` Tailwind classes (and `--border-radius-*` custom properties), configured from `src/_data/designTokens/borderRadius.json`.
- **`ltnavigation` breakpoint** — a `max-width` variant matching the navigation breakpoint, for styling below the point where the nav collapses.
- **Accessibility testing with pa11y** — `npm run test:a11y` builds the site in test mode and runs `pa11y-ci` (WCAG2AA) against the URLs in `meta.tests.pa11y.customPaths` (`src/_data/meta.js`). Requires a local headless Chrome. The `src/common/pa11y.njk` config is only emitted when `ELEVENTY_ENV=test`.
- **`forms.css` / `grayscale` utility** — styling for form elements (`src/assets/css/local/forms.css`) and a grayscale image utility are present should the design need them.

#### Available upstream (would need pulling in from the template)

These exist in Eleventy Excellent v4.6.1 but were intentionally **not** added during the upgrade. To adopt one, copy the relevant file(s) from a checkout of the template and wire them up.

- **PeerTube video embeds** — `custom-peertube.webc` and `custom-peertube-link.webc` WebC components (a privacy-friendly alternative to the YouTube components this site already has).
- **Submenu navigation** — upstream `partials/main-nav.njk` supports nested submenus, driven by a `submenu` array on items in `src/_data/navigation.js` and the `nav-sub.js` script. (The matching `nav-main-drawer-cls.css` is already in this repo.)
- **Dialog / search component** — `assets/scripts/bundle/dialog.js` plus a `dialog` config block in `meta.js`.
- **Cosmetic looks** — the template's `gradient-text` headings and the button-styled footer links (with an Eleventy credit). Purely visual; this site keeps its own header/footer styling.

### Adding a new article

1. Create `src/posts/<year>/YYYY-MM-DD-your-slug.md` with frontmatter (`title`, `description`, `date`).
2. Add any images under `src/assets/images/blog/<year>/` and reference them with the `{% image %}` shortcode.
3. The post is automatically picked up by the `allPosts` collection, listed on `/articles/`, and published to `/articles/<slugified-title>/` on the next build/deploy.
