---
layout: section
section: core
title: Band
component: annotation/band.js
namespace: Annotation
externals:
  band-example-js: band-example.js
  band-example-html: band-example.html
---

The band annotation component renders horizontal or vertical bands. The orientation of the band is determined by the accessors that are supplied, i.e. if you supply an `x0` and an `x1` value the component renders vertical bands, whereas by supplying `y0` and `y1` values you can render horizontal bands.

The following example demonstrates both vertical and horizontal bands, where each are based on an array of data. For the horizontal bands a few 'random' values from the x scale are used, whereas for the vertical, the y scale ticks are used as a source of data for the bands:

```js
{{{ codeblock band-example-js}}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="band-example-html" js="band-example-js" }}}

{{{band-example-html}}}
<script type="text/javascript">
{{{band-example-js}}}
</script>
