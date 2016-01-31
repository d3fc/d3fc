---
layout: example
example: true
title: Low Barrel
externals:
    low-barrel-js: low-barrel.js
    low-barrel-html: low-barrel.html
    low-barrel-css: low-barrel.css
---

{{{ dynamic-include 'codepen' html="low-barrel-html" js="low-barrel-js" css="low-barrel-css"}}}

<style>
{{{low-barrel-css}}}
</style>

{{{low-barrel-html}}}

{{{ dynamic-include 'javascript-resize' js="low-barrel-js" }}}

This example shows how a more complex chart can be built using the d3fc components.

The three charts that make up this example are each [cartesian charts](../../components/chart/cartesian.html). The top-most chart uses the [gridlines](../../components/annotation/gridlines.html), [crosshairs](../../components/tool/crosshairs.html) and [candlestick](../../components/series/candlestick.html) components, rendered via the [multi-series](../../components/series/multi.html) component. The volume and navigator charts uses a similar mix of components.

These charts all share the same underlying data, however, this is enhanced with the data that represents the current interactive state.

The top-most chart uses a tooltip component that was written specifically for this example application. It is added as a 'decoration' of the crosshair.
