---
layout: component
title: Error Bar Series
component: series/errorBar.js
tags:
  - playground
namespace: series

example-code: |
  //Generating the error information for the data
  data.forEach(function(d) {
      d.yUpError = Math.random() * 2;
      d.yDownError = Math.random() * 2;
  });

  var errorBar = fc.series.errorBar()
      .xScale(xScale)
      .yScale(yScale)
      .errorLow(function(d,i) { return d.close - d.yDownError; })
      .errorHigh(function(d,i) { return d.close + d.yUpError; });

  container.append('g')
      .datum(data)
      .call(errorBar);

example-multi: |
  //Generating the error information for the data
  data.forEach(function(d) {
      d.yUpError = Math.random();
      d.yDownError = Math.random();
  });

  var barSeries = fc.series.bar();

  var errorBar = fc.series.errorBar()
      .errorLow(function(d,i) { return d.close - d.yDownError; })
      .errorHigh(function(d,i) { return d.close + d.yUpError; });

  var multiSeries = fc.series.multi()
      .series([barSeries, errorBar])
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(multiSeries);
---

An [error bar series](http://en.wikipedia.org/wiki/Error_bar) renders the error or uncertainty area around each datapoint. Error bars can be renderer vertically or horizontally based on the value of the `orient` property. The upper and lower bounds of each bar are defined by the `errorUpper` and `errorLower` properties.

The following example generates a random error around each datapoint:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

Error bars are typically combined with other series (e.g. bar or point) using the multi-series component. The following example shows a bar series with associated error bars:

```js
{{{example-multi}}}
```

Which gives the following:

<div id="multi-example" class="chart"> </div>
<script type="text/javascript">
(function() {
    var desiredWidth = $('#multi-example').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#multi-example', desiredWidth, desiredHeight, null, function() { return true; });
    var container = f.container, data = f.data,
      xScale = f.xScale, yScale = f.yScale;
    {{{example-multi}}}
}());
</script>
