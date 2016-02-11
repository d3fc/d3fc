---
layout: component
section: financial
title: Random Financial
component: data/random/financial.js
namespace: Data
externals:
  financial-example-js: financial-example.js
  financial-example-html: financial-example.html
---

The random financial data generator component is a useful testing utility that generates data via a random walk algorithm.

The following example:

```js
{{{ codeblock financial-example-js}}}
```

Generates the following:

{{{ dynamic-include 'codepen' html="financial-example-html" js="financial-example-js" }}}

{{{financial-example-html}}}
<script type="text/javascript">
{{{financial-example-js}}}
</script>

A `filter` can be supplied to skips other days, or change the start price, volume and date. Pre-defined filters can be used, for example to skip weekends use `fc.data.random.filter.skipWeekends`.
