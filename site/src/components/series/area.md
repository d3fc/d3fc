---
layout: component
title: Area Series
component: series/area.js
tags:
namespace: series

example-code: |
  var area = fc.series.area()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(area);

example-band-code: |
  var area = fc.series.area()
      .xScale(xScale)
      .yScale(yScale)
      .y1Value(function (d) { return d.high; } )
      .y0Value(function (d) { return d.low; } );

  container.append('g')
      .datum(data)
      .call(area);
---

The area series renders the given data as a filled area, constructed from an SVG `path`:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

This series has the same `xValue`, `yValue` and `decorate` properties as the [point series](#point). You can also render this series as a band by specifying `y0Value` and `y1Value` properties:

```js
{{{example-band-code}}}
```

Which gives the following:

<div id="series_area_band" class="chart band"> </div>
<script type="text/javascript">
(function () {
    var desiredWidth = $('#series_area_band').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#series_area_band', desiredWidth, desiredHeight, null, function () { return true; });
    var container = f.container, data = f.data,
      xScale = f.xScale, yScale = f.yScale;
    {{{example-band-code}}}
}());
</script>
