---
name: writing-speaking-blog-posts
description: Use when Marc asks to write/create/draft a blog post about speaking at (or attending) a conference, meetup, or event for this Eleventy site (src/posts/). Triggers include "speaking at <event>", "blog post about <conference>", "write a speaking post".
---

# Writing Speaking Blog Posts

## Overview

Generates a "Speaking at <Event>" blog post for this Eleventy site that matches the
established format in `src/posts/<year>/`. Every post follows the same skeleton: hero
image, a TLDR linking the GitHub repo, an intro line, body paragraphs that weave in the
fun fact and location, a thank-you paragraph, and the standard Dapr supporter footer.

Read 2-3 existing posts in `src/posts/2026/` before writing so the voice stays consistent.

## Required inputs (interview if missing)

Collect these from the prompt. For any that are missing, **ask for them one at a time in an
interview style** (don't write the post until you have all 8). Do not invent values.

1. **Event name** — e.g. "DevSum"
2. **Event website URL** — the event's official site; the intro links the event name to it
3. **Event date(s)** — e.g. "June 2-3, 2026" (used for the post date + intro line)
4. **Event location** — e.g. "Stockholm" (woven into the intro/body)
5. **Session title** — e.g. "Durable execution battle: comparing open-source workflow-as-code platforms"
6. **Sessionize link** — the URL of the session on Sessionize
7. **One interesting/fun fact** — about the event or the session
8. **GitHub repo link** — slides & code demos repo

## Steps

1. **Gather inputs** — interview for anything missing (above).
2. **Pick the post number** — find the highest numeric image prefix in
   `src/assets/images/blog/*/` and add 1. This is a single global sequence (latest is the
   max across ALL year folders, not per-year):
   ```bash
   ls src/assets/images/blog/*/ | grep -oE '^[0-9]+\.' | tr -d '.' | sort -n | tail -1
   ```
3. **Build the slug** — a short, lowercase, hyphenated event slug used in both the filename
   and the image names (e.g. `devsum`, `ndc-london`, `techorama-be`, `updateconf`). Keep it
   short; abbreviate long names. Confirm the slug with Marc if unsure.
4. **Determine the date** — use the event's **last day** in `YYYY-MM-DD` form for both the
   filename and frontmatter `date`.
5. **Choose tense** — compare the event date to today:
   - Past event → recap (default style of all existing posts): "On <dates>, I was at ...".
   - Future event → anticipatory: "On <dates>, I'll be at ...", and replace the thank-you
     paragraph with a "hope to see you there" close. Keep the same skeleton.
6. **Write the file** to `src/posts/<year>/<YYYY-MM-DD>-speaking-at-<slug>-<year>.md` using
   the template below.
7. **Report** the created path, the post number used, and the exact image filename(s) Marc
   still needs to drop into `src/assets/images/blog/<year>/` (the skill only references them;
   it does not create images).

## Template

Replace `<...>` placeholders. `<N>` = post number, `<slug>` = event slug, `<year>` = event year.

```markdown
---
title: "Speaking at <Event name> <year>"
description: ""
date: <YYYY-MM-DD>
---

{% image "./src/assets/images/blog/<year>/<N>.1.<slug>.jpg", "Speaking at <Event name> <year>", "Speaking at <Event name> <year>", [960] %}

**TLDR:** <a href="<GitHub repo link>" target="_blank">Slides & code demos on GitHub</a>

---
On <Event date(s)>, I was at [<Event name>](<event website>) in <Location> to give my session, [*'<Session title>'*](<Sessionize link>).

<Paragraph 2: a sentence or two about the session content. Keep it grounded — only use
details Marc gave you. Do not fabricate demo specifics.>

<Paragraph 3: weave in the fun/interesting fact here, in Marc's enthusiastic first-person voice.>

This is the [repo with the demos](<GitHub repo link>). It comes with a devcontainer configuration so you can run it yourself easily, either on GitHub Codespaces or locally. And you can use DemoTime to run through the slides and all the demos.

A big thank you to the <Event name> organizers and sponsors for making this event happen, and thanks to the attendees for joining my session and the great conversations afterwards!

---
Do you like Dapr and want to show your support? Claim this [community supporter Holopin badge](https://bit.ly/dapr-supporter)!

<a href="https://bit.ly/dapr-supporter">{% image "./src/assets/images/blog/common/dapr-community-supporter.png", "Dapr community supporter badge" %}</a>
```

### Future-event variant

When the event is upcoming, keep the same skeleton but swap two parts:

- **Intro line:** `On <Event date(s)>, I'll be at [<Event name>](<event website>) in <Location> to give my session, [*'<Session title>'*](<Sessionize link>).`
- **Closing paragraph** (replaces the thank-you line): `If you're attending <Event name>, I hope to see you there — come say hi and join my session!`

Body paragraphs shift to future tense ("I'll show ...", "I'm looking forward to ...").

### Optional inline images

Existing posts often include 1-2 extra inline images in the body (`<N>.2.<slug>.jpg`,
`<N>.3.<slug>.jpg`), usually at `[960]` or a smaller width like `[440]`. Only add these if
Marc provides/asks for them, and list any extra filenames in your final report.

## Field → placement map

| Input | Where it goes |
|-------|----------------|
| Event name | `title`, hero image alt text, intro line (linked to event website if known), thank-you line |
| Event date(s) | frontmatter `date` (last day), intro line ("On <dates>, ...") |
| Location | intro line ("... in <Location> ...") |
| Session title | intro line, italic + linked to the Sessionize link: `[*'...'*](sessionize)` |
| Sessionize link | wraps the italic session title |
| Fun fact | a body paragraph in Marc's voice |
| GitHub repo link | TLDR line + the "repo with the demos" line |
| Event website | wraps the event name in the intro line: `[<Event name>](<event website>)` |

## Quick reference

- File path: `src/posts/<year>/<YYYY-MM-DD>-speaking-at-<slug>-<year>.md`
- Hero image ref: `<N>.1.<slug>.jpg` at `[960]` (use `"lazy", "portrait"` instead of `[960]` for a portrait hero)
- Footer (Dapr supporter badge block) is **constant** — copy it verbatim, every post ends with it.
- `description` frontmatter is intentionally left empty (`""`) — matches existing posts.

## Common mistakes

- **Inventing session/demo details.** Only the fun fact and any details Marc provides are
  yours to use. If a body paragraph needs more substance, ask Marc rather than guessing.
- **Wrong post number.** It's a single global sequence across all year folders. Don't reset
  per year, don't reuse an existing number.
- **Forgetting the Sessionize link.** It belongs wrapping the italic session title, not on its own line.
- **Dropping the footer.** Every post ends with the Dapr supporter badge block.
- **Creating image files.** The skill only writes the markdown reference; tell Marc which
  `.jpg` filename to add. Don't generate or fake images.
