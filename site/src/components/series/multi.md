---
layout: component
title: Multi Series
component: series/multi.js
tags:
  - frontpage
namespace: series

example-code: |
  var candlestick = fc.series.candlestick();
  var gridlines = fc.annotation.gridline();

  // Create a a bollinger series
  var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();
  bollingerAlgorithm(data);
  var bollinger = fc.indicator.renderer.bollingerBands();

  var multi = fc.series.multi()
      .series([gridlines, bollinger, candlestick])
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(multi);

example-mapping: |
  var data = {
    foo: fc.data.random.financial()(25),
    bar: fc.data.random.financial()(25)
  };

  xScale.domain(fc.util.extent().fields('date')([data.foo, data.bar]))
  yScale.domain(fc.util.extent().fields(['high', 'low'])([data.foo, data.bar]));

  var line = fc.series.line();
  var area = fc.series.area();

  var multi = fc.series.multi()
    .xScale(xScale)
    .yScale(yScale)
    .series([area, line])
    .mapping(function(series) {
      switch(series) {
        case line:
          return this.bar;
        case area:
          return this.foo;
      }
    });

  container.datum(data)
    .call(multi);
---

The multi series component makes it easier to render a number of components that share the same x and y scales. The following example shows the candlestick, bollinger and gridlines components rendered via the multi series:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

The multi series component allows using different series with different data sets, using `mapping`. This example shows an area and a line series being created using two sets of data.
```js
{{{example-mapping}}}
```

Which gives the following:

<div id="mapping-example" class="chart"> </div>
<script type="text/javascript">
(function() {
    var desiredWidth = $('#mapping-example').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#mapping-example', desiredWidth, desiredHeight, null, function() { return true; });
    var container = f.container, data = f.data,
      xScale = f.xScale, yScale = f.yScale;
    {{{example-mapping }}}
}());
</script>
