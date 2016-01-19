---
layout: example
example: true
title: Basecoin
externals:
    base-coin-js: base-coin.js
    base-coin-html: base-coin.html
    base-coin-css: base-coin.css
---

{{{ dynamic-include 'codepen' html="base-coin-html" js="base-coin-js" css="base-coin-css"}}}

<style>
{{{base-coin-css}}}
</style>

{{{base-coin-html}}}

<script>
{{{base-coin-js}}}
</script>



This example shows how d3fc components can be used to recreate an approximation of the background video on the [Coinbase exchange](https://exchange.coinbase.com/) homepage.

This example makes use of a number of components, including the data generator, series and indicators. It also mixes in some SVG filter effects and 3D transforms for good measure.

For a detailed overview of how this chart was implemented, pop over to the Scott Logic blog which covers the details [in this blog post](http://blog.scottlogic.com/2015/08/06/an-adventure-in-svg-filter-land.html).
