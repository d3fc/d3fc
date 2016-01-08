---
layout: example
title: The Wealth & Health of Nations
namespace: examples
externals:
    wealth-js: wealth.js
    wealth-html: wealth.html
    wealth-css: wealth.css
---

{{{ dynamic-include 'codepen' html="wealth-html" js="wealth-js" css="wealth-css"}}}

<style>
{{wealth-css}}
</style>

{{{wealth-html}}}

<script>
{{{wealth-js}}}
</script>

This example is a recreation of [Mike Bostock's recreation](http://bost.ocks.org/mike/nations/) of Gapminder’s [Wealth &amp; Health of Nations](http://www.gapminder.org/world/).

> It shows the dynamic fluctuation in per-capita income (x), life expectancy (y) and population (radius) of 180 nations over the last 209 years. Nations are colored by geographic region; mouseover to read their names.

Mousing-over the year, in the bottom-right corner of the chart, enables interaction and moves the year displayed forwards and backwards through time.
