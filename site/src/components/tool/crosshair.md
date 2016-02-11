---
layout: section
section: core
title: Crosshair
component: tool/crosshair.js
namespace: Tool
externals:
  crosshair-example-js: crosshair-example.js
  crosshair-example-html: crosshair-example.html
  crosshair-example-2-js: crosshair-example-2.js
  crosshair-example-2-html: crosshair-example-2.html
---

The crosshair component renders an interactive crosshair. The component should be data-joined to an empty array which it will populate with an object that indicates the current crosshair location.

The crosshair is typically rendered alongside other series. The following example uses a multi-series component to render a crosshair and a line series:

```js
{{{ codeblock crosshair-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="crosshair-example-html" js="crosshair-example-js" }}}

{{{crosshair-example-html}}}
<script type="text/javascript">
{{{crosshair-example-js}}}
</script>

You can control the snapping behaviour of the crosshair by supplying a snapping function to the `snap` property. A number of snap functions are [supplied as part of the library]({{package.repository.url}}/blob/master/src/util/snap.js).

You can configure X and Y labels via the `xLabel` and `yLabel` properties. The crosshair emits `trackingstart`, `trackingmove` and `trackingend` events which can be used to add further interactively.

The crosshair is often used in conjunction with the [tooltip component](/components/chart/tooltip.html), which renders the data that the crosshair generates (and pushes into the data-joined array). In order to update the tooltip component, the entire chart should be re-rendered by handling the crosshair tracking events.

While the tooltip can be rendered into any suitable container, it often makes sense to render it within the same region as the series. In order to achieve this, the tooltip can be positioned by the [rectangles layout component](/components/layout/rectangles.html).

The following shows how these various components can be integrated together:

```js
{{{ codeblock crosshair-example-2-js }}}
```

This renders a tooltip in the top-left corner:

{{{ dynamic-include 'codepen' html="crosshair-example-2-html" js="crosshair-example-2-js" }}}

{{{crosshair-example-2-html}}}
<script type="text/javascript">
{{{crosshair-example-2-js}}}
</script>
