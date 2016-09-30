---
layout: section
section: core
title: Label
namespace: Layout
externals:
  rectangles-example-css: rectangles-example.css
  rectangles-example-measure-js: rectangles-example-measure.js
  rectangles-example-measure-html: rectangles-example-measure.html
---

A D3 layout that places labels avoiding overlaps using either a greedy or simulated annealing strategy. Full details of this component can be found on the [d3fc-label-layout](https://github.com/d3fc/d3fc-label-layout) module GitHub page.

The following example shows how a number of labels can be arranged by this layout component:


```js
{{{codeblock rectangles-example-measure-js}}}
```

Which renders the following:

{{{ dynamic-include 'codepen' html="rectangles-example-measure-html" js="rectangles-example-measure-js" css="rectangles-example-css"}}}

<style>
{{{rectangles-example-css}}}
</style>

{{{rectangles-example-measure-html}}}
<script type="text/javascript">
{{{rectangles-example-measure-js}}}
</script>
