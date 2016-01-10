---
layout: component
title: Point Series
component: series/point.js
tags:
  - playground
namespace: series

example-code-1: |
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
      .size(200) // increase the area to 200 pixels
      .decorate(function(sel) {
        // use decorate to set the fill color based on index
        sel.select('path')
          .attr('style', function(d, i) { return 'fill: ' + color(i); });
      });

  container.append('g')
      .datum(data)
      .call(point);

example-code-3: |
  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale)
      .type(function(d, i) {
          // pick a symbol type based on index
          return ['circle', 'cross', 'diamond', 'square'][i % 4];
      });

  container.append('g')
        .datum(data)
        .call(point);

---

The point series renders the given data as a series of symbols which are produced via the [`d3.svg.symbol`](https://github.com/mbostock/d3/wiki/SVG-Shapes#symbol) generator.  By default, it renders circles with an area of 64 pixels.

```js
{{{example-code-1}}}
```

Which gives the following:

<div id="series_point" class="chart"> </div>
<script type="text/javascript">
(function() {
    var desiredWidth = $('#series_point').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#series_point', desiredWidth, desiredHeight, null, function() { return true; });
    var container = f.container, data = f.data,
      xScale = f.xScale, yScale = f.yScale;
    {{{example-code-1}}}
}());
</script>

The series assumes that each object has a `date` property which defines its x-location, and a `close` property which
defines its y-location. However, these can be changed via the `xValue` and `yValue` properties.

As the series is built using the `d3.svg.symbol`, the following symbol `types` are also supported:

* circle - a circle.
* cross - a Greek cross or plus sign.
* diamond - a rhombus.
* square - an axis-aligned square.
* triangle-down - a downward-pointing equilateral triangle.
* triangle-up - an upward-pointing equilateral triangle.

You can specify the symbol via `type` property, e.g. `type('diamond')`, or provide a function as illustrated in the example below:

```js
{{{example-code-3}}}
```

Which shows different kinds of shapes that can be used:

<div id="series_point_3" class="chart"> </div>
<script type="text/javascript">
(function() {
    var desiredWidth = $('#series_point_3').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#series_point_3', desiredWidth, desiredHeight, null, function() { return true; });
    var container = f.container, data = f.data,
      xScale = f.xScale, yScale = f.yScale;
    {{{example-code-3}}}
}());
</script>
