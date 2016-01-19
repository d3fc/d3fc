---
layout: component
title: Legend
namespace: Chart
externals:
  legend-example-js: legend-example.js
  legend-example-html: legend-example.html
  legend-example-css: legend-example.css
---

<style>
{{{legend-example-css}}}
</style>

Rather than write our own d3fc legend, we discovered that someone had already [created a pretty awesome one](http://d3-legend.susielu.com), so we decided to integrate that one instead! This project uses the `d3-svg-legend`, component which is included in the d3fc bundle.

The d3-legend doesn't render a background, although this can easily be added via the [container component](/components/tool/container.html).

The d3-legend is constructed from a scale as shown below:

```js
{{{legend-example-js}}}
```

{{{ dynamic-include 'codepen' html="legend-example-html" js="legend-example-js" css="legend-example-css"}}}

{{{legend-example-html}}}
<script type="text/javascript">
{{{legend-example-js}}}
</script>

For further details regarding the extensive API of this component, consult the [project homepage](http://d3-legend.susielu.com).
