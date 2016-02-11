---
layout: component
section: core
title: Area Series
component: series/area.js
namespace: Series
externals:
  area-example-js: area-example.js
  area-example-html: area-example.html
  band-example-js: band-example.js
  band-example-html: band-example.html
---

The area series renders the given data as a filled area, constructed from an SVG `path`:

```js
{{{ codeblock area-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="area-example-html" js="area-example-js" }}}

{{{area-example-html}}}
<script type="text/javascript">
{{{area-example-js}}}
</script>

This series has the same `xValue`, `yValue` and `decorate` properties as the [point series](#point). You can also render this series as a band by specifying `y0Value` and `y1Value` properties:

```js
{{{ codeblock band-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="band-example-html" js="band-example-js" }}}

{{{band-example-html}}}
<script type="text/javascript">
{{{band-example-js}}}
</script>
