---
layout: component
title: Line Series
component: series/line.js
tags:
namespace: series

example-code: |
  var line = fc.series.line()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(line);
      
example-code-2: |
  var line = fc.series.line()
      .interpolate('basis')
      .tension(0.3)
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(line);
      
example-code-3: |
  var line = fc.series.line()
      .interpolate('step')
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(line);
---

The line series renders the given data as a line, constructed from an SVG `path`:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

This series has the same properties for specifying the x and y value accessors, and decorate as the [point series](#point).

`Line` also exposes the `interpolate` property from the d3 library. To find out which `interpolations` are available
check with the official [D3 Line Documentation](https://github.com/mbostock/d3/wiki/SVG-Shapes#line).
  
The `tension` parameter is also exposed for changing how some of the `interpolation` looks like. You can see the usage
below:

```js
{{{example-code-2}}}
```

<div id="line_2" class="chart"> </div>
<script type="text/javascript">
(function() {
    var desiredWidth = $('#line_2').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#line_2', desiredWidth, desiredHeight, null, function() { return true; });
    var container = f.container, data = f.data,
      xScale = f.xScale, yScale = f.yScale;
    {{{example-code-2}}}
}());
</script>

Another very popular series is the step series. This can be easily achieved by using the `step` `interpolation`:
 
```js
{{{example-code-3}}}
```

<div id="line_3" class="chart"> </div>
<script type="text/javascript">
(function() {
    var desiredWidth = $('#line_3').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#line_3', desiredWidth, desiredHeight, null, function() { return true; });
    var container = f.container, data = f.data,
      xScale = f.xScale, yScale = f.yScale;
    {{{example-code-3}}}
}());
</script>
