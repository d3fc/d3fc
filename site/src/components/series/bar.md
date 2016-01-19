---
layout: component
title: Bar Series
component: series/bar.js
tags:
  - playground
namespace: Series
externals:
  bar-example-js: bar-example.js
  bar-example-html: bar-example.html
  bar-horizontal-example-js: bar-horizontal-example.js
  bar-horizontal-example-html: bar-horizontal-example.html

---

The bar series renders the given data as a series of vertical bars:

```js
{{{ codeblock bar-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="bar-example-html" js="bar-example-js" }}}

{{{bar-example-html}}}
<script type="text/javascript">
{{{bar-example-js}}}
</script>

This series has the same `xValue`, `yValue` and `decorate` properties as the [point series](./point). You can also specify the width of the bars via the `barWidth` property.

The bar series supports horizonal display, using the `orient` property.

```js
{{{ codeblock bar-horizontal-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="bar-horizontal-example-html" js="bar-horizontal-example-js" }}}

{{{bar-horizontal-example-html}}}
<script type="text/javascript">
{{{bar-horizontal-example-js}}}
</script>
