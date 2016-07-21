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

The crosshair component renders a crosshair and is intended to be used in conjunction with the pointer behavior. It is typically rendered alongside other series. The following example uses a multi-series component to render a crosshair and a line series:

```js
{{{ codeblock crosshair-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="crosshair-example-html" js="crosshair-example-js" }}}

{{{crosshair-example-html}}}
<script type="text/javascript">
{{{crosshair-example-js}}}
</script>

You can control the snapping behavior of the crosshair by mapping the points through a snapping function. A number of useful snap functions are [supplied as part of the library]({{package.repository.url}}/blob/master/src/util/snap.js). Additionally, you can configure X and Y labels via the `xLabel` and `yLabel` properties.

The crosshair is often used in conjunction with the {{{ hyperlink 'tooltip.html' title='tooltip component' }}}, which renders the data that the crosshair generates (and pushes into the data-joined array).

While the tooltip can be rendered into any suitable container, it often makes sense to render it within the same region as the series. In order to achieve this, the tooltip can be positioned by the {{{ hyperlink 'label.html' title='label layout component' }}}.

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
