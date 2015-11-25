---
layout: component
title: Crosshair
component: tool/crosshair.js
namespace: tool
tags:
  - playground

example-code: |
  // create a line series and a crosshair
  var line = fc.series.line();
  var crosshair = fc.tool.crosshair();

  // create an array which will hold the crosshair datapoint
  var crosshairData = [];

  // use a multi-series to render both the line and crosshair
  var multi = fc.series.multi()
    .series([line, crosshair])
    .xScale(xScale)
    .yScale(yScale)
    .mapping(function(series) {
        switch (series) {
            case line:
                return data;
            case crosshair:
                return crosshairData;
        }
    });

  container.append('g')
      .datum(data)
      .call(multi);

example-code-2: |
  var numberFormat = d3.format('.2f');

  var line = fc.series.line();

  var crosshair = fc.tool.crosshair()
    .xLabel(function(d) { return numberFormat(d.x); })
    .yLabel(function(d) { return numberFormat(d.y); })
    .on('trackingstart', render)
    .on('trackingmove', render)
    .on('trackingend', render);

  var tooltip = fc.chart.tooltip()
      .items([
          ['X:', function(d) { return numberFormat(d.x); }],
          ['Y:', function(d) { return numberFormat(d.y); }]
      ]);

  var tooltipLayout = fc.layout.rectangles()
      .position([10, 10])
      .size([50, 30])
      .component(tooltip);

  // create an array which will hold the crosshair datapoint
  var crosshairData = [];

  // use a multi-series to render both the line, crosshair and tooltip
  var multi = fc.series.multi()
    .series([line, crosshair, tooltipLayout])
    .xScale(xScale)
    .yScale(yScale)
    .mapping(function(series) {
        switch (series) {
            case line:
                return data;
            case crosshair:
            case tooltipLayout:
                return crosshairData;
        }
    });

  function render() {
    container
        .datum(data)
        .call(multi);
  }
  render();
---

The crosshair component renders an interactive crosshair. The component should be data-joined to an empty array which it will populate with an object that indicates the current crosshair location.

The crosshair is typically rendered alongside other series. The following example uses a multi-series component to render a crosshair and a line series:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

You can control the snapping behaviour of the crosshair by supplying a snapping function to the `snap` property. A number of snap functions are [supplied as part of the library]({{package.repository.url}}/blob/master/src/util/snap.js).

You can configure X and Y labels via the `xLabel` and `yLabel` properties. The crosshair emits `trackingstart`, `trackingmove` and `trackingend` events which can be used to add further interactively.

The crosshair is often used in conjunction with the [tooltip component](/components/chart/tooltip.html), which renders the data that the crosshair generates (and pushes into the data-joined array). In order to update the tooltip component, the entire chart should be re-rendered by handling the crosshair tracking events.

While the tooltip can be rendered into any suitable container, it often makes sense to render it within the same region as the series. In order to achieve this, the tooltip can be positioned by the [rectangles layout component](/components/layout/rectangles.html).

The following shows how these various components can be integrated together:

```js
{{{example-code-2}}}
```

This renders a tooltip in the top-left corner:

<div id="example-code-2" class="chart"> </div>
<script type="text/javascript">
(function() {
    var desiredWidth = $('#example-code-2').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#example-code-2', desiredWidth, desiredHeight, null, function() { return true; });
    var container = f.container, data = f.data,
      xScale = f.xScale, yScale = f.yScale;
    {{{example-code-2}}}
}());
</script>
