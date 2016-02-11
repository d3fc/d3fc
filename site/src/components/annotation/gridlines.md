---
layout: component
section: core
title: Gridlines
component: annotation/gridline.js
namespace: Annotation
externals:
  gridlines-example-js: gridlines-example.js
  gridlines-example-html: gridlines-example.html
---

This component renders horizontal and vertical gridlines based on the ticks supplied by the associated axes.

The following is a simple example:

```js
{{{ codeblock gridlines-example-js}}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="gridlines-example-html" js="gridlines-example-js" }}}

{{{gridlines-example-html}}}
<script type="text/javascript">
{{{gridlines-example-js}}}
</script>

You can configure the number of ticks via the `xTicks` and `yTicks` properties.
