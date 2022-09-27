---
title: "Making This Website Using Astro"
slug: "ba4d373b-b972-456a-866a-89e894ebe76b"
date: "26 Sep 2022 5:52 PM"
excerpt: "I explain the process of making the website."
---
# Making This Website Using Astro
[![Astro Banner](https://raw.githubusercontent.com/withastro/astro/main/assets/social/banner.svg)](https://astro.build/ "banner")

In this post I explain my process of using 
[![icon](https://raw.githubusercontent.com/withastro/astro/main/assets/brand/file-icon.svg) Astro](https://astro.build/ "icon-text-link") 
to build this website.

The Github Repo: [![icon](https://github.com/fluidicon.png) Personal Website](https://github.com/marcoseiza/PersonalWebsite "icon-text-link")

-----

## What is Astro?
Lovely quote from my favorite creator on programming Youtube:
> Astro is a tool for building static websites with your favorite 
> Javascript frameworks while shipping **0 Javascript** to the user.<br>
> ![icon-rounded middle](https://yt3.ggpht.com/ytc/AMLnZu80d66aj0mK3KEyMfpdGFyrVWdV5tfezE17IwRkhw=s176-c-k-c0x00ffffff-no-rj) Fireship

[![icon](https://www.youtube.com/s/desktop/b8096f4d/img/favicon_32x32.png) Astro in 100 Seconds](https://www.youtube.com/watch?v=dsTXcSeAZq8 "icon-text-link")

-----

## Why Did I Choose Astro?
I thought it was a great solution for this site. I needed a place to document all
the things personal projects I make, and Astro offers a simple and clean way to make 
an easy blog. I could also utilize React to make some nice lazy loaded blogs.

-----

## Things I learned:
1. Astro is awesome!
1. Astro components are great for reusable stuff on the site, however, be careful with what you define a component. Components need a purpose!!
1. Make sure to read the documentation fully!! [More: Reading the Documentation Fully](#reading-the-documentation-fully)
1. Regex lookback is not supported on Safari, Found a [![icon](https://github.com/fluidicon.png) Bug In Astro's Renderer](https://github.com/withastro/astro/issues/4865 "icon-text-link")


### Reading the Documentation Fully
I had an issue with finding out how to make dynamic links to blog posts. The goal
was to have a post be defined with a UUID slug and have the link use it to access the post (e.g. [/posts/ba4d373b-b972-456a-866a-89e894ebe76b](/posts/ba4d373b-b972-456a-866a-89e894ebe76b) is a dynamic link of /post/:uuid).

I was trying to use the `getStaticPaths()` method for almost an entire day until I realized
that I couldn't use it as it was only for client side rendered sites. Mine was 
server side rendered (SSR) using Netlify, but I didn't notice 🤦‍♂️. Lesson Learned: 
**READ THE DOCUMENTATION**. Until I forget it hahahaha.

----

## Verdict 
Loved working with Astro, will definitely build more things with it.

## Goals From This Project
- Learn more about Regex.
- Keep Component structure in mind during future projects.
