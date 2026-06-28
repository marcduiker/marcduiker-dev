---
title: "Getting Started with Codeberg"
description: "A practical guide to registering on Codeberg.org and mirroring an existing GitHub repository."
date: 2026-06-28
---

# Getting Started with Codeberg

**TLDR:** Do you also want to reduce your dependency on non-EU-based tech platforms? Start with a free and open source Git provider! Sign up for Codeberg, create a new empty repo and push your code from an existing GitHub clone to mirror it.

## Introduction

There is a lot of concerning stuff happening in the world (geopolitics, AI hype) which is one of the reasons for me to look around for open source, privacy-focused & EU-based alternatives in the tech scene. Take GitHub, for example. I've been using GitHub since 2015, and it has served me well. I'll probably continue to use it for certain things. But should I fully depend on GitHub to keep my source code safe these days? For me, personally, that answer is no. So I started looking around and found Codeberg.

## Codeberg

[Codeberg](https://codeberg.org) is a free, community-driven, non-profit Git hosting platform based in Berlin, Germany. The platform is powered by [Forgejo](https://forgejo.org), a self-hosted Git platform. If you're looking for a privacy-focused, European-based alternative to GitHub, it makes a great second home, or new home, for your code. This post walks through registration, setting up your profile, creating a repository, and pushing a full GitHub repo across, history and all.

> **Scope:** This post is about copying your *code and full Git history* to Codeberg. It does **not** move issues, pull requests, labels, milestones, or releases — those live on GitHub's side and aren't part of the Git repository. If you want to bring those across too, you'll need a full migration via [codeberg.org/repo/migrate](https://codeberg.org/repo/migrate), which is outside the scope of this post.

I'll describe how I moved my personal website, `marcduiker-dev`, to Codeberg.

## 1. Registering an Account

Navigate to [codeberg.org](https://codeberg.org) and click **Register**. Fill in the form with a username (this is permanent, so choose carefully), your email, and a password, then complete the CAPTCHA and submit. Codeberg sends a verification link to your email. You must click it before you can create repositories. Once verified, log in for the first time.

## 2. Creating Your Profile

Head to **Settings → Profile** to add a display name, bio, avatar, and any website or links you want to share. While you're in settings, set your visibility and localization preferences, such as language and theme.

This is also where you set up authentication. Because we'll push over HTTPS with two-factor authentication (2FA) enabled, the key step here is creating an access token (covered in the next section). 2FA is strongly recommended; enable it under **Settings → Security** if you haven't already.

## 3. Creating an Access Token (HTTPS with 2FA)

When 2FA is enabled, you can no longer use your account password for Git operations over HTTPS;  you authenticate with a personal access token instead. Go to **Settings → Applications**, give a new token a name, grant it the `write:repository` scope, and generate it. Copy the token immediately, as Codeberg only shows it once. You'll paste it in place of a password the first time you push.

> **Prefer SSH?** Generate a key with `ssh-keygen -t ed25519 -C "you@example.com"`, copy the public key (`cat ~/.ssh/id_ed25519.pub`), and add it under **Settings → SSH / GPG Keys**. Test it with `ssh -T git@codeberg.org`. The rest of this post uses HTTPS, but every step works with an SSH remote URL (`git@codeberg.org:<username>/<repo>.git`) if you go that route.

## 4. Creating an Empty Repository

In the Codeberg web UI, click **+ → New Repository** and choose a name (matching your GitHub repo makes sense), a description, and a visibility setting. Crucially, **leave it empty**; do not initialize it with a README, license, or `.gitignore`. An empty repository avoids conflicts when you push your existing history into it. Once created, note the HTTPS clone URL, which looks like `https://codeberg.org/<username>/<repo>.git`. For my website, it is `https://codeberg.org/marcduiker/marcduiker-dev.git`.

## 5. Pushing Your Branches and Tags to Codeberg

There are two ways to get every branch, tag, and commit onto Codeberg. Pick whichever fits your situation; the end result is the same:

- **Option A — Fresh mirror clone.** Easiest if you *don't* have the repo on your machine, or if you'd rather not run a script to recreate every branch locally. A bare `--mirror` clone grabs all refs in one shot.
- **Option B — From your existing clone.** Best if you *already* have a working clone and want to push from it. A normal clone only holds local branches for what you checked out, so there's a little more to do if you have a lot of branches.

### Option A: Clone a fresh mirror

A bare mirror clone copies every branch, tag, and bit of history with no per-branch setup. Clone your GitHub repo as a mirror, then push it straight on to Codeberg:

Template commands:

```bash
git clone --mirror https://github.com/<user>/<repo>.git
cd <repo>.git
git push --mirror https://codeberg.org/<username>/<repo>.git
```

For my website repo specifically:

```bash
git clone --mirror https://github.com/marcduiker/marcduiker-dev.git
cd marcduiker-dev.git
git push --mirror https://codeberg.org/marcduiker/marcduiker-dev.git
```

When you trigger the mirror push, you'll need to provide your Codeberg username and access token. Skip ahead to the [Git Credentials section](#git-credentials) to continue.

### Option B: Push from your existing clone

You almost certainly already have a working clone of your GitHub repo, so there's no need to clone it again. There is one catch, though: a normal clone only creates a *local* branch for the one you checked out (usually `main`). Every other branch exists only as a remote-tracking reference (`origin/*`), and `git push` only pushes local branches ; so pushing now would silently leave those other branches behind.

So the job is in three parts: pull every branch down as a local branch, add Codeberg as a *second* remote (leaving your GitHub `origin` untouched), and push everything across.

#### Fetch every branch and tag from GitHub

From inside your existing clone, make sure it knows about all the remote branches and tags:

```bash
git fetch origin --tags
```

This updates your remote-tracking branches but doesn't create local branches for them. Create a local branch for each one so they'll all be included when you push.

On macOS or Linux (bash/zsh):

```bash
for branch in $(git branch -r | grep -v HEAD | sed 's|origin/||'); do
  git branch --track "$branch" "origin/$branch" 2>/dev/null
done
```

On Windows (PowerShell):

```powershell
git branch -r | Where-Object { $_ -notmatch 'HEAD' } | ForEach-Object {
  $branch = $_.Trim() -replace '^origin/', ''
  git branch --track $branch "origin/$branch" 2>$null
}
```

Run `git branch` to confirm you now have a local branch for every branch that was on GitHub. (The `2>/dev/null` — or `2>$null` in PowerShell ; quietly skips branches that already exist locally, like `main`.)

#### Add Codeberg as a second remote

I want to keep using GitHub for now until I've replaced the CI pipeline and the publish to GitHub Pages, so I don't want to repoint `origin` to Codeberg. Instead, I'll add Codeberg as a second remote named `codeberg`. This keeps both remotes side by side and leaves my GitHub setup exactly as it was.

Template commands:

```bash
git remote add codeberg https://codeberg.org/<username>/<repo>.git
git remote -v
```

For my website specifically:

```bash
git remote add codeberg https://codeberg.org/marcduiker/marcduiker-dev.git
git remote -v
```

`git remote -v` should now list **both** remotes: `origin` still pointing at GitHub and `codeberg` at your new repository.

#### Push all branches and tags

Now push every local branch and every tag to Codeberg:

```bash
git push codeberg --all
git push codeberg --tags
```

### Git Credentials 

The first push to Codeberg prompts for a username and password. Enter your Codeberg username, and paste the access token from step 3 as the password. To avoid re-entering it on every push, configure Git to store the token in your operating system's secure keychain rather than in plaintext:

- **Windows** — use [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager/blob/main/docs/install.md#windows), which ships with Git for Windows and stores credentials in the Windows Credential Store.
- **macOS** — enable the built-in keychain helper with `git config --global credential.helper osxkeychain` ([docs](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git)).
- **Linux** — install [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager/blob/main/docs/install.md#linux) for Secret Service / GNOME Keyring integration, or use `git config --global credential.helper libsecret` ([docs](https://git-scm.com/doc/credential-helpers)).

When the push finishes, open the repository on Codeberg and confirm that all branches, tags, and history are present.

## 6. Keeping the Mirror in Sync (Optional)

Codeberg has *disabled* the automatic pull-mirror feature, so it can't sync from GitHub on a schedule. They explain why in their blog post [Mirror repos: easily created, consuming resources forever](https://blog.codeberg.org/mirror-repos-easily-created-consuming-resources-forever.html).
That means syncing is a manual push from your side. How you do it depends on which option you used in step 5.

**If you used Option A (a fresh mirror clone)**, fetch the latest from GitHub and mirror-push it on — `--mirror` automatically includes any new branches and tags, so there's no loop to re-run:

```bash
git fetch -p origin
git push --mirror https://codeberg.org/<username>/<repo>.git
```

**If you used Option B (your existing clone)**, fetch the latest from GitHub and push it on to Codeberg:

```bash
git fetch origin --prune --tags
git push codeberg --all
git push codeberg --tags
```

If new branches were created on GitHub since your initial push, re-run the branch-creation loop from step 5 first so they exist locally and get picked up by `git push codeberg --all`.

To automate either approach, wrap the commands in a small script run via cron, or set up a scheduled GitHub Action that pushes to Codeberg.

## 7. Moving to Codeberg Completely (Optional)

At the moment, my `marcduiker-dev` repo is mirrored to Codeberg, and I still push to GitHub as my main remote. But if Codeberg is becoming your new home rather than a mirror, you'll want your everyday working clone to push there instead of GitHub, and maybe retire the GitHub repo eventually.

From step 5 you already have both remotes side by side: `origin` (GitHub) and `codeberg` (Codeberg). To make Codeberg your default, swap the names so that `codeberg` becomes `origin`. Rename the old GitHub remote out of the way first, then promote Codeberg:

```bash
git remote rename origin github
git remote rename codeberg origin
git remote -v
```

Because the everyday remote is once again named `origin`, now pointing at Codeberg, your existing branch tracking keeps working, so `git push` and `git pull` talk to Codeberg without any further setup. (GitHub is still reachable as `github` if you want to keep pushing there for a while.) Do a quick `git fetch origin` and a test push to confirm everything resolves to the new URL.

Before pulling the plug on GitHub, update anything that still points there: CI/CD pipelines and Actions, README badges, documentation links, and any webhooks or integrations. Once you've verified Codeberg has the full history and nothing depends on the GitHub repo, archive or delete it under **GitHub → Settings → General → Danger Zone**. Archiving makes it read-only and is reversible; deleting is permanent, so make sure the Codeberg copy is complete first.

## 8. What's Next?

Even though changing Git providers is a relatively small technical step for a personal website, it's a bigger step to get used to another interface. The developer experience is different, and I need to get used to it. Once I've used Codeberg for a few months, I'll write a follow-up post about my experience with the platform.

The next practical step for me is to move my GitHub Pages site to [Codeberg Pages](https://docs.codeberg.org/codeberg-pages/), I'll write about this in my next post. Once this is done, I plan to archive the GitHub repo and use Codeberg as my main remote for `marcduiker-dev`.

The great thing about Codeberg & Forgejo is that they are open source and community-driven. If you want to contribute to the platform and make the developer experience better, check out their [contributing guide](https://codeberg.org/Codeberg/Contributing)!