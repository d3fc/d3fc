---
layout: component
title: Waterfall Series
component: series/waterfall.js
tags:
  - playground
namespace: series

example-code: |
  var waterfall = fc.series.waterfall()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(waterfall);

example-code-2: |
  var waterfall = fc.series.waterfall()
      .xScale(xScale)
      .yScale(yScale)
      .orient('horizontal');

  container.append('g')
      .datum(data)
      .call(waterfall);
---

The [Waterfall series](https://en.wikipedia.org/wiki/Waterfall_chart) renders the given data as a series of vertical bars, showing the cumulative effect of each bar:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

This series has the same `xValue`, `yValue` and `decorate` properties as the [point series](./point). You can also specify the width of the bars via the `barWidth` property.

The waterfall series supports horizonal display, using the `orient` property.

```js
{{{example-code-2}}}
```

<div id="series_waterfall_horizontal" class="chart"> </div>
<script type="text/javascript">
(function() {
    var desiredWidth = $('#series_waterfall_horizontal').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#series_waterfall_horizontal', desiredWidth, desiredHeight, null, function() { return true; });
    var container = f.container, data = f.data,
        yScale = f.xScale,
        xScale = d3.scale.linear()
            .domain(fc.util.extent().fields(['high', 'low'])(data))
            .range([0, desiredHeight]);
    {{{example-code-2}}}
}());
</script>