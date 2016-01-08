---
layout: component
title: Multi Series
component: series/multi.js
namespace: Series
externals:
  multi-example-js: multi-example.js
  multi-example-html: multi-example.html
  multi-mapping-example-js: multi-mapping-example.js
  multi-mapping-example-html: multi-mapping-example.html
---

The multi series component makes it easier to render a number of components that share the same x and y scales. The following example shows the candlestick, bollinger and gridlines components rendered via the multi series:

```js
{{{ codeblock multi-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="multi-example-html" js="multi-example-js" }}}

{{{multi-example-html}}}
<script type="text/javascript">
{{{multi-example-js}}}
</script>

The multi series component allows using different series with different data sets, using `mapping`. This example shows an area and a line series being created using two sets of data.

```js
{{{ codeblock multi-mapping-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="multi-mapping-example-html" js="multi-mapping-example-js" }}}

{{{multi-mapping-example-html}}}
<script type="text/javascript">
{{{multi-mapping-example-js}}}
</script>
