---
title: "Using Codeberg Pages with Forgejo Actions"
description: ""
date: 2026-07-26
draft: true
---

**TLDR:** 

---

## Introduction

A couple of weeks ago, I [wrote about my decision to move my personal website from GitHub to Codeberg](/articles/getting-started-with-codeberg/). Since then I've learned a bit about Forjego Actions and [setting up a local runner](/articles/setting-up-a-local-forgejo-runner-for-codeberg/). Now it's time to set up Codeberg Pages for my personal website and deploy it using Forgejo Actions.

## Codeberg Pages

[Codeberg Pages](https://codeberg.page/) allows you to publish static websites based on repos hosted on Codeberg. You can either deploy the site via CI/CD using Forgejo Actions (what this article is about) or use the built-in deployment feature of Codeberg Pages that is based on a `pages` branch and a webhook.

Codeberg Pages are very similar to GitHub Pages, but there are some differences. Here are the main features of Codeberg Pages:
- Host static websites directly from your Codeberg repositories.
- Support for user/organization websites and repository-specific websites.
- Custom domains and advanced features like custom 404 pages, redirects, and rewrites.

For more details, see the [Codeberg Pages documentation](https://docs.codeberg.org/codeberg-pages/).

## Differences with GitHub Pages

While both Codeberg Pages and GitHub Pages allow you to host static websites directly from your repositories, there are some key differences:

1. **Deployment Engine**: Codeberg Pages uses [git-pages](https://git-pages.org/), while GitHub Pages uses Jekyll by default.
2. **CI/CD Integration**: Codeberg Pages can be deployed directly from Forgejo Actions, whereas GitHub Pages can be deployed from GitHub Actions.
3. **Custom Domains**: Both support custom domains, but the setup process and configuration may differ.
4. **Caching**: Codeberg Pages caches files under a certain size (currently 1 MiB) to improve performance and reduce server load.

For more information on setting up custom domains with Codeberg Pages, see the [custom domains documentation](https://docs.codeberg.org/codeberg-pages/using-custom-domain/).

## Setting Up Forgejo Actions

To set up Forgejo Actions for deploying your website to Codeberg Pages, follow these steps:

1. **Enable Forgejo Actions**: Go to your repository settings, navigate to **Settings > Units > Overview**, and enable the **Actions** checkbox.

2. **Create a Workflow File**: Create a `.forgejo/workflows/publish.yaml` file in your repository with the following content:

```yaml
name: Preview Publish
on:
  pull_request:
jobs:
  publish:
    runs-on: marcduiker-medium
    steps:
      - uses: actions/checkout@v5
      #      - run: |
      #          # Use your favorite static site generator here!
      #          mkdir _site
      #          cp *.html _site/
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Persist npm cache
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package.json') }}

      - name: Persist Eleventy .cache
        uses: actions/cache@v4
        with:
          path: ./.cache
          key: ${{ runner.os }}-eleventy-fetch-cache
      - run: npm install --os=linux --cpu=x64 sharp
      - run: npm install
      - run: npm run build
      - if: ${{ forge.event_name == 'pull_request' }}
        uses: actions/git-pages@v2
        with:
          site: https://${{ forge.event.repository.owner.username }}.preview.codeberg.page/${{ forge.event.repository.name }}@${{ forge.event.number }}/
          token: ${{ forge.token }}
          source: ./dist
```

3. **Explanation of the Workflow**:
   - **Checkout**: The `actions/checkout@v5` step checks out your repository.
   - **Setup Node.js**: The `actions/setup-node@v4` step sets up Node.js with the specified version.
   - **Cache**: The `actions/cache@v4` steps persist the npm cache and Eleventy cache to speed up subsequent builds.
   - **Install and Build**: The `npm install` and `npm run build` steps install dependencies and build your site.
   - **Deploy**: The `actions/git-pages@v2` step deploys your site to Codeberg Pages.

For more details on deploying from Forgejo Actions, see the [Forgejo Actions documentation](https://docs.codeberg.org/codeberg-pages/forgejo-actions/).

## Troubleshooting

Here are some common issues and their solutions when using Codeberg Pages:

1. **Security Warnings**: If your username or repository name contains a dot, the URL may not work with Let's Encrypt wildcard certificates. Use the alternative URL `https://pages.codeberg.org/user.name/` as a workaround or rename your repository.

2. **Content Not Updated**: The Codeberg Pages server caches files under a certain size (currently 1 MiB). Wait a few minutes for the cache to invalidate.

3. **Cloudflare and Codeberg Pages**: Ensure that every DNS record used for Codeberg Pages is set to **DNS only** (gray cloud) in Cloudflare to avoid issues with SSL certificates and redirects.

4. **Post-git-pages Errors**: Use the git-pages manifest to diagnose errors. You can fetch the manifest using:
   ```sh
   curl https://example.org/.git-pages/manifest.json
   # Or use the dedicated tool from git-pages
   git-pages-cli --debug-manifest https://example.org
   ```

For more troubleshooting tips, see the [Codeberg Pages troubleshooting documentation](https://docs.codeberg.org/codeberg-pages/troubleshooting/).

## What's Next?

