---
layout: component
title: Point Series
component: series/point.js
tags:
  - frontpage
namespace: series

example2-code: |
  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(point);

example-code: |
  var color = d3.scale.category10();

  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale)
      .radius(function(d, i) { return i; })
      .decorate(function(sel) {
        sel.select('circle')
          .attr('style', function(d, i) { return 'fill: ' + color(i); });
      });

  container.append('g')
      .datum(data)
      .call(point);
---

The point series renders the given data as a series of circles:

```
{{{example2-code}}}
```

Which gives the following:

<div id="series_point" class="chart"> </div>
<script type="text/javascript">
(function() {
    var f = createFixture('#series_point', null, null, null, function() { return true; });
    var container = f.container, data = f.data
      xScale = f.xScale, yScale = f.yScale;
    {{{example2-code }}}
}());
</script>

The series assumes that each object has a `date` property which defines its x-location, and a `close` property which defines its y-location. However, these can be changed via the `xValue` and `yValue` properties.

You can supply a function via the `radius` property that specifies the radius for each point. You can also modify how the series is rendered via the `decorate` function which is supplied the selection containing the `g` element that is the parent for each `circle`:

```js
{{{example-code}}}
```

Which results in the following (slightly odd looking) series:

{{>example-fixture}}
