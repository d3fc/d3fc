---
layout: section
section: core
title: Waterfall Series
component: series/waterfall.js
namespace: Series
externals:
  waterfall-example-js: waterfall-example.js
  waterfall-example-html: waterfall-example.html
---

The [Waterfall series](https://en.wikipedia.org/wiki/Waterfall_chart) renders the given data as a series of vertical bars, showing the cumulative effect of each bar. The series begins and ends with the total values.

All bars are classed with 'waterfall'. Ascending and descending bars are classed with 'up' and 'down' respectively.

The data must be shaped using `fc.series.algorithm.waterfall()`. The new data has a `x` property specifying the x-location, `y0` and `y1` properties specifying the y0 and y1-locations respectively, and a `direction`. The algorithm assumes each object has an `x` property which defines its x-location, and a `y` property which defines its y-location. However, these can be changed via the `xValueKey` and `yValue` properties.

The first column can be declared as a total by using the `startsWithTotal` property. Other total columns can be inserted into the data by using the algorithm's `totals` property. For a given datapoint this property should return the x-location for the total bar to be inserted. If the `totals` are not specified a final total bar will be inserted by default.

```js
{{{ codeblock waterfall-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="waterfall-example-html" js="waterfall-example-js" }}}

{{{waterfall-example-html}}}
<script type="text/javascript">
{{{waterfall-example-js}}}
</script>

The data that identifies the x-value is identified via the `xValueKey` property.

This series has the same `yValue` and `decorate` properties as the [point series](./point). You can also specify the width of the bars via the `barWidth` property.

The waterfall series supports horizontal display, using the `orient` property, similar to [bar](./bar).
