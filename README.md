# Personal website of Marc Duiker

This site is based on the [Eleventy Excellent starter](https://github.com/madrilene/eleventy-excellent) by Lene Saile, specifically [v3.7.4](https://github.com/madrilene/eleventy-excellent/releases/tag/v3.7.4) (commit [`2d1e85f`](https://github.com/madrilene/eleventy-excellent/commit/2d1e85f51)).

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
- **Styling:** Tailwind CSS + PostCSS, with design tokens in `src/_data/designTokens/`.
- **Images:** `@11ty/eleventy-img` via the `{% image %}` shortcode (generates optimized/responsive images); `sharp` is the image processing engine.
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
  - `collections.js` — `allPosts`, `onlyMarkdown` (for sitemap), `tagList`.
  - `filters.js`, `shortcodes.js` (incl. `svg`, `image`, `year`), `plugins.js`, `events.js` (e.g. SVG→JPEG OG image generation), and `setup/` scripts (`generate-favicons.js`, `generate-screenshots.js`).
- **`src/_layouts/`** — page shells: `base.njk`, `page.njk`, `post.njk`, `tags.njk` (referenced via layout aliases).
- **`src/_includes/`** — `partials/` (Nunjucks snippets like `card-blog.njk`, `gallery.njk`, `header.njk`, `footer.njk`, `pagination.njk`), `webc/` (WebC components like `custom-card`, `custom-masonry`, `custom-youtube`), plus `head/`, `schemas/`, and generated `css/`/`scripts/`.
- **`src/common/`** — non-page outputs: feeds (`feed-atom.njk`, `feed-json.njk`), `sitemap.njk`, `robots.njk`, `og-images.njk`, `site-manifest.njk`, `tags.njk`/`tagList.njk`, `404.md`, `_redirects.njk`.

### Adding a new article

1. Create `src/posts/<year>/YYYY-MM-DD-your-slug.md` with frontmatter (`title`, `description`, `date`).
2. Add any images under `src/assets/images/blog/<year>/` and reference them with the `{% image %}` shortcode.
3. The post is automatically picked up by the `allPosts` collection, listed on `/articles/`, and published to `/articles/<slugified-title>/` on the next build/deploy.
