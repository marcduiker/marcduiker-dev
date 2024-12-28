---
title: "Changing my website tech stack (again)"
description: ""
date: 2024-12-27
---

It seems that every couple of years, I change my website, not just the design, but nearly the complete tech stack 😬. In 2016, I moved to Jekyll, in 2021, I chose [Nuxt](https://nuxt.com/), and now, at the end of 2024, I've moved it all to [Eleventy](https://www.11ty.dev/).

## If it isn't broken, don't try to fix it

I was pretty happy with my Nuxt setup, I understand just enough Vue to be able to update the layouts to my needs, and I wrote all my content in Markdown, as I love to do. Blogging life was good.

The front-end world moves quickly though, and I added a Dependabot configuration to create PRs with npm package updates to stay up to date. Most of the time this worked well, until there were some breaking changes... and I couldn't easily figure out how to fix it 😭.

I do think updating dependencies in general is a good thing, keeping everything secure and preventing software rot. But this breaking change was something I couldn't fix, and I got __so frustrated__ by the whole thing. To be fair, this isn't an issue with Nuxt. I chose a theme that was not so popular, received very little updates, and therefore got out of sync with Nuxt itself. I was too eager updating something I didn't fully understand the impact of. I think all static site generator themes/templates suffer from this. And while updating dependencies is important, __if it isn't broken, don't try to 'fix' it__.

So instead of fixing my Nuxt setup, I decided to start over with a new tech stack... again.

## Choosing a new static site generator

I really like static site generators! They are fast, deploying is relatively easy, and hosting is cheap.

There are a ton of static site generators out there. If you're looking for one, I recommend looking at [jamstack.org/generators/](https://jamstack.org/generators/).

I have experience with Jekyll, Hugo, Nuxt, and now I wanted to try something new because I like to learn new things 😁 (and apparently I'm a static site generator masochist 😣).

These are my criteria for choosing a static site generator:

- Flexible but doesn't require a PhD in computer science to change/extend it.
- Actively maintained project (incl the themes/templates!).
- Enough themes/templates available to start with and update it to my needs.
- Good documentation.

I heard good things about Astro and Eleventy recently. I looked at some templates from both projects and liked the [AstroWind theme](https://astro.build/themes/details/astrowind/) a lot, so I gave that a try. I started to migrate my blog posts but somewhere I got stuck and the site didn't render at all 🫤. This is definitely a 'me problem', not an Astro problem. But since I couldn't easily figure out what the issue was, I decided to move away from Astro.

> In general, I think a lot of static site generators can benefit from better error messages. I often found those messages to generic to be helpful. If something is wrong with a blog post I wrote, then please let me know which front-matter field is missing or incorrect!

## Eleventy

The next generator on the list to try was Eleventy. I found a great template by [Lene Saile](https://bsky.app/profile/lenesaile.com), named [Eleventy Excellent](https://github.com/madrilene/eleventy-excellent).

One of the features I like a lot in this template is _image optimization_, this was something I didn't have in my Nuxt setup. This also proved to be a bit of a challenge while migrating, since this Eleventy template was not configured to handle animated gifs, and this is something I use __a lot__ to show my pixel art and UI animations in blog posts. Lene was very helpful and made a couple of updates to the template. Thanks Lene! 🙏

The other big change I had to do was some 'content massaging' for the blog posts. Since I wanted the URLs to stay the same, I had to add _permalinks_ to all my blog posts. I did this manually for 90 posts, but I could have automated this with a script. Also, the image links had to be updated to use the new image optimization feature.

I spent quite some hours on migrating the posts. It all seems to be in a good state now, and I'm already writing new posts without being frustrated! 🎉

I wonder how long this setup will last... 🤔