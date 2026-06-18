---
title: "Getting Started with Codeberg"
description: "A practical guide to registering on Codeberg.org and mirroring an existing GitHub repository."
date: 2026-06-17
draft: true
---

# Getting Started with Codeberg

**TLDR:** Sign up for Codeberg, set up your profile, create a new repository, and push all your existing GitHub branches to it as a mirror.

## Introduction

- What Codeberg is: a free, community-driven, non-profit Git hosting platform powered by [Forgejo](https://forgejo.org)
- Why you might want it: privacy-focused, European-based, no tracking, a non-commercial alternative or backup for GitHub
- What this post covers: registration → profile → new repo → pushing all GitHub branches across

> **Scope:** This post is about copying your *code and full Git history* to Codeberg. It does **not** move issues / pull requests / labels / milestones / releases — those live on GitHub's side and aren't part of the Git repository. If you want to bring those across too, you'll need a full migration via [codeberg.org/repo/migrate](https://codeberg.org/repo/migrate), which is outside the scope of this post.

## 1. Registering an Account

- Navigate to [codeberg.org](https://codeberg.org) and click **Register**
- Fill in the registration form: username (permanent — choose carefully), email, password
- Complete the CAPTCHA and submit
- Verify your email via the link Codeberg sends (required before you can create repositories)
- Log in for the first time

## 2. Creating Your Profile

- Go to **Settings → Profile**: add a display name, bio, avatar, and website/links
- Set your visibility and localization preferences (language, theme)
- Add an **SSH key** (Settings → SSH / GPG Keys) so you can push over SSH:
  - Generate a key: `ssh-keygen -t ed25519 -C "you@example.com"`
  - Copy the public key: `cat ~/.ssh/id_ed25519.pub`
  - Paste it into Codeberg and give it a title
  - Test the connection: `ssh -T git@codeberg.org`

## 3. Creating a New Repository as a Mirror Target

- Click **+ → New Repository**
- Choose a name (can match your GitHub repo), description, and visibility (public/private)
- **Leave it empty** — do not initialize with a README, license, or .gitignore (an empty repo avoids push conflicts with your existing history)
- Note the new repo's SSH URL: `git@codeberg.org:<username>/<repo>.git`

## 4. Configuring the Repo and Pushing All GitHub Branches

- Make sure you have a local clone of the GitHub repo (or clone a fresh mirror)
- Add Codeberg as a second remote:
  ```bash
  git remote add codeberg git@codeberg.org:<username>/<repo>.git
  git remote -v   # confirm both origin (GitHub) and codeberg
  ```
- Ensure you have every branch locally before pushing:
  ```bash
  git fetch origin
  ```
- Push all branches and tags to Codeberg:
  ```bash
  git push codeberg --all
  git push codeberg --tags
  ```
- (Alternative for a complete one-shot mirror) use a bare mirror clone and `git push --mirror`
- Verify on Codeberg that all branches, tags, and history are present

## Keeping the Mirror in Sync (Optional)

- **Note:** Codeberg has *disabled* the automatic pull-mirror feature, so you can't have Codeberg sync from GitHub on a schedule. They explain why in their blog post [Mirror repos: easily created, consuming resources forever](https://blog.codeberg.org/mirror-repos-easily-created-consuming-resources-forever.html) — in short, abandoned mirrors kept updating and consumed resources/traffic indefinitely without benefit to the community.
- Because of this, keeping in sync is a **manual push**: re-run `git fetch origin && git push codeberg --all --tags` when needed
- To automate it on *your* side, wrap that in a small script run via cron or a CI job (e.g. a scheduled GitHub Action that pushes to Codeberg)

## Conclusion

- Recap: account, profile, repo, and a full branch/tag push to Codeberg
- Closing thought on why a second home (or new home) for your code is worth it
- Links: [Codeberg docs](https://docs.codeberg.org), [GitHub→Codeberg migration guide](https://docs.codeberg.org/advanced/migrating-repos/)
