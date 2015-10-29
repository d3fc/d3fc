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

The line series component also exposes the `interpolate` and `tension` properties from the d3 line shape that it uses for rendering. For more information about the interpolation modes refer to the official [D3 Line Documentation](https://github.com/mbostock/d3/wiki/SVG-Shapes#line).

The following example demonstrates how to render a step series via the `step` interpolation mode:

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
