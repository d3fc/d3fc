---
layout: component
title: Point Series
component: series/point.js
tags:
namespace: series

example-code-1: |
  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(point);

example-code-2: |
  var color = d3.scale.category10();

  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale)
      .size(function(d, i) { return i * i * 3.14; }) //Size is specified in pixels area
      .decorate(function(sel) {
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
          var type;
          switch(i%6) {
              case 0:
                  type = 'circle';
                  break;
              case 1:
                  type = 'cross';
                  break;
              case 2:
                  type = 'diamond';
                  break;
              case 3:
                  type = 'square';
                  break;
              case 4:
                  type = 'triangle-down';
                  break;
              case 5:
                  type = 'triangle-up';
                  break;          
          }
          return type;
      });
      
  container.append('g')
        .datum(data)
        .call(point);
      
---

The point series renders the given data as series of symbols. The symbols are based on the `d3.svg.symbol` element. 
By default, it renders circles with an area of 64 pixels.

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

You can supply a function via the `size` property that specifies the area of each point. You can also modify how 
the series is rendered via the `decorate` function which is supplied the selection containing the `g` element that is 
the parent for each `path`:

```js
{{{example-code-2}}}
```

Which results in the following (slightly odd looking) series:

<div id="series_point_2" class="chart"> </div>
<script type="text/javascript">
(function() {
    var desiredWidth = $('#series_point_2').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#series_point_2', desiredWidth, desiredHeight, null, function() { return true; });
    var container = f.container, data = f.data,
      xScale = f.xScale, yScale = f.yScale;
    {{{example-code-2}}}
}());
</script>

As the series is built using the `d3.svg.symbol`, the following symbol `types` are also supported:

* circle - a circle.
* cross - a Greek cross or plus sign.
* diamond - a rhombus.
* square - an axis-aligned square.
* triangle-down - a downward-pointing equilateral triangle.
* triangle-up - an upward-pointing equilateral triangle.

These can be accessed via the `type` property:

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