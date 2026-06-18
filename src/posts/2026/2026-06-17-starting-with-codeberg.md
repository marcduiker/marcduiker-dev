---
title: "Getting Started with Codeberg"
description: "A practical guide to registering on Codeberg.org and mirroring an existing GitHub repository."
date: 2026-06-17
draft: true
---

# Getting Started with Codeberg

**TLDR:** Sign up for Codeberg, set up your profile, create an empty repository, and push your existing GitHub repo to it as a complete mirror over HTTPS.

## Introduction

Codeberg is a free, community-driven, non-profit Git hosting platform powered by [Forgejo](https://forgejo.org). If you're looking for a privacy-focused, European-based alternative to GitHub with no tracking, it makes a great second home — or new home — for your code. This post walks through registration, setting up your profile, creating a repository, and pushing a full GitHub repo across, history and all.

> **Scope:** This post is about copying your *code and full Git history* to Codeberg. It does **not** move issues, pull requests, labels, milestones, or releases — those live on GitHub's side and aren't part of the Git repository. If you want to bring those across too, you'll need a full migration via [codeberg.org/repo/migrate](https://codeberg.org/repo/migrate), which is outside the scope of this post.

## 1. Registering an Account

Navigate to [codeberg.org](https://codeberg.org) and click **Register**. Fill in the form with a username (this is permanent, so choose carefully), your email, and a password, then complete the CAPTCHA and submit. Codeberg sends a verification link to your email — you must click it before you can create repositories. Once verified, log in for the first time.

## 2. Creating Your Profile

Head to **Settings → Profile** to add a display name, bio, avatar, and any website or links you want to share. While you're in settings, set your visibility and localization preferences such as language and theme.

This is also where you set up authentication. Because we'll push over HTTPS with two-factor authentication (2FA) enabled, the key step here is creating an access token (covered in the next section). 2FA is strongly recommended — enable it under **Settings → Security** if you haven't already.

## 3. Creating an Access Token (HTTPS with 2FA)

When 2FA is enabled, you can no longer use your account password for Git operations over HTTPS — you authenticate with a personal access token instead. Go to **Settings → Applications**, give a new token a name, grant it the `write:repository` scope, and generate it. Copy the token immediately, as Codeberg only shows it once. You'll paste it in place of a password the first time you push.

> **Prefer SSH?** SSH works too. Generate a key with `ssh-keygen -t ed25519 -C "you@example.com"`, copy the public key (`cat ~/.ssh/id_ed25519.pub`), and add it under **Settings → SSH / GPG Keys**. Test it with `ssh -T git@codeberg.org`. The rest of this post uses HTTPS, but every step works with an SSH remote URL (`git@codeberg.org:<username>/<repo>.git`) if you go that route.

## 4. Creating an Empty Repository

Click **+ → New Repository** and choose a name (it can match your GitHub repo), a description, and a visibility setting. Crucially, **leave it empty** — do not initialize it with a README, license, or `.gitignore`. An empty repository avoids conflicts when you push your existing history into it. Once created, note the HTTPS clone URL, which looks like `https://codeberg.org/<username>/<repo>.git`.

## 5. Pushing a Complete Mirror

The cleanest way to copy everything — every branch, tag, and bit of history — is a bare mirror clone. This avoids a common pitfall: a normal clone only has your checked-out branches locally, so pushing from it would silently leave other branches behind.

Clone your GitHub repo as a mirror, point its push URL at Codeberg, and push:

```bash
git clone --mirror https://github.com/<user>/<repo>.git
cd <repo>.git
git remote set-url --push origin https://codeberg.org/<username>/<repo>.git
git push --mirror
```

The first push prompts for a username and password. Enter your Codeberg username, and paste the access token from step 3 as the password. To avoid re-entering it on every push, configure Git to store the token in your operating system's secure keychain rather than in plaintext:

- **Windows** — use [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager/blob/main/docs/install.md), which ships with Git for Windows and stores credentials in the Windows Credential Store.
- **macOS** — enable the built-in keychain helper with `git config --global credential.helper osxkeychain` ([docs](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git)).
- **Linux** — install [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager/blob/main/docs/install.md#linux) for Secret Service / GNOME Keyring integration, or use `git config --global credential.helper libsecret` ([docs](https://git-scm.com/doc/credential-helpers)).

When the push finishes, open the repository on Codeberg and confirm that all branches, tags, and history are present.

## Keeping the Mirror in Sync (Optional)

Codeberg has *disabled* the automatic pull-mirror feature, so it can't sync from GitHub on a schedule. They explain why in their blog post [Mirror repos: easily created, consuming resources forever](https://blog.codeberg.org/mirror-repos-easily-created-consuming-resources-forever.html) — in short, abandoned mirrors kept updating and consumed resources and traffic indefinitely without benefit to the community.

That means syncing is a manual push from your side. From the bare mirror clone, fetch the latest from GitHub and push it on:

```bash
git fetch -p origin
git push --mirror
```

To automate it, wrap those commands in a small script run via cron, or set up a scheduled GitHub Action that pushes to Codeberg.

## Moving to Codeberg Completely (Optional)

If Codeberg is becoming your new home rather than a backup, you'll want your everyday working clone to push there instead of GitHub, and eventually to retire the GitHub repo.

Start in your normal working clone (not the bare mirror from step 5). Repoint the `origin` remote from GitHub to Codeberg and confirm the change:

```bash
git remote set-url origin https://codeberg.org/<username>/<repo>.git
git remote -v
```

Because the remote keeps the name `origin`, your existing branch tracking still works — `git push` and `git pull` now talk to Codeberg without any further setup. Do a quick `git fetch origin` and a test push to confirm everything resolves to the new URL.

Before pulling the plug on GitHub, update anything that still points there: CI/CD pipelines and Actions, README badges, documentation links, and any webhooks or integrations. Once you've verified Codeberg has the full history and nothing depends on the GitHub repo, archive or delete it under **GitHub → Settings → General → Danger Zone**. Archiving makes it read-only and is reversible; deleting is permanent, so make sure the Codeberg copy is complete first.

## Conclusion

That's the full path: register an account, set up your profile, generate an access token, create an empty repository, and push a complete mirror over HTTPS. With your code and its entire history now living on Codeberg, you have a genuine second home — independent, community-run, and free of tracking.

Further reading: [Codeberg docs](https://docs.codeberg.org) and the [GitHub→Codeberg migration guide](https://docs.codeberg.org/advanced/migrating-repos/).
