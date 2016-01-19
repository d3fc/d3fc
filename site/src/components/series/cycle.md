---
layout: component
title: Cycle Series
component: series/cycle.js
namespace: Series
externals:
  cycle-example-js: cycle-example.js
  cycle-example-html: cycle-example.html
---

The cycle series component allows the creation of cycle plots which can help identify cyclical patterns nested in time series data. As well as an `xScale` and a `yScale`, it also accepts a `subScale` and a `subSeries`. The `xScale` is the 'outer' scale, with the cycle series' `xValue` mapping the data onto this scale. While the `subScale` is the inner scale, with the `xValue` of the `subSeries` corresponding to this scale.

The following example shows some arbitrary sales data grouped by weekday:

{{{ dynamic-include 'codepen' html="cycle-example-html" js="cycle-example-js" }}}

{{{cycle-example-html}}}
<script type="text/javascript">
{{{cycle-example-js}}}
</script>

This example also demonstrates a use of the axis series which adapts a D3 axis and allows it to be used as a series. In this case the `baseline` of the axis series is set to the mean of the weekday's values.

```js
{{{ codeblock cycle-example-js }}}
```
