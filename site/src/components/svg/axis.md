---
layout: component
title: Axis
component: svg/axis.js
namespace: SVG
externals:
  offset-example-js: offset-labels-example.js
  offset-example-html: offset-labels-example.html
  rotated-example-js: rotated-labels-example.js
  rotated-example-html: rotated-labels-example.html
  colored-example-js: colored-labels-example.js
  colored-example-html: colored-labels-example.html
  example-css: example.css
---

<style type="text/css">
{{example-css}}
</style>

The d3fc axis is a drop-in replacement for the `d3.svg.axis` component, which implements the d3fc decorate pattern. As a result it is much easier to customise the construction of the axis.

For example, the decorate pattern can be used to rotate the tick labels:

```js
{{{ rotated-example-js }}}
```

{{{ dynamic-include 'codepen' html="rotated-example-html" js="rotated-example-js" css="example-css"}}}

{{{rotated-example-html}}}
<script type="text/javascript">
{{{rotated-example-js}}}
</script>

Or alternatively the tick index can be used to offset alternating labels:

```js
{{{offset-example-js}}}
```

{{{ dynamic-include 'codepen' html="offset-example-html" js="offset-example-js" css="example-css"}}}

{{{offset-example-html}}}
<script type="text/javascript">
{{{offset-example-js}}}
</script>

In the example below, the value bound to each tick is used to colour values greater than or equal to 100:

```js
{{{colored-example-js}}}
```

{{{ dynamic-include 'codepen' html="colored-example-html" js="colored-example-js" css="example-css"}}}

{{{colored-example-html}}}
<script type="text/javascript">
{{{colored-example-js}}}
</script>
