---
layout: component
title: Envelope
component: indicator/algorithm/envelope.js
tags:
 - playground
namespace: indicator

example-code: |
  // Create the line series
  var line = fc.series.line()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(line);

  // Create and apply the envelopes algorithm
  var envelopeAlgorithm = fc.indicator.algorithm.envelope()
      .factor(0.01)
      .value(function(d) { return d.close; });
  envelopeAlgorithm(data);

  // Create the renderer
  var envelope = fc.indicator.renderer.envelope()
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(envelope);

example-code-2: |
  // Create the candlestick series
  var candlestick  = fc.series.candlestick();

  // Create and apply the EMA
  var movingAverage = fc.indicator.algorithm.exponentialMovingAverage()
  movingAverage(data);

  // Create a line that renders the result
  var emaLine = fc.series.line()
      .yValue(function(d) { return d.exponentialMovingAverage; });

  // Create and apply the envelope algorithm to the exponential moving average
  var envelopeAlgorithm = fc.indicator.algorithm.envelope()
      .factor(0.01)
      .value(function(d) { return d.exponentialMovingAverage; });
  envelopeAlgorithm(data);

  // Create the renderer
  var envelopeArea = fc.indicator.renderer.envelope();

  // create a multi-series to render the various components
  var multi = fc.series.multi()
    .series([envelopeArea, emaLine, candlestick])
    .xScale(xScale)
    .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(multi);
---

An [Envelope](http://www.investopedia.com/terms/e/envelope.asp?optm=sa_v2) is an indicator that defines an area around a series as defined by an upper and a lower bound.

The example below creates a line series which is bounded by an envelope:

```js
{{{example-code}}}
```

{{>example-fixture}}

You can specify the value that is bounded by the envelope via the `value` property, also the distance between the upper and lower bounds can be controlled using the `factor` property.

Envelopes are most often used with an [exponential moving average](./exponentialMovingAverage), where the a price that falls outside of the envelope constitutes either a buy or a sell signal. The following example creates a
[candlestick series](../series/candlestick), an [exponential moving average](./exponentialMovingAverage)
and an envelope indicator:

```js
{{{example-code-2}}}
```

<div id="envelope_2" class="chart"> </div>
<script type="text/javascript">
(function() {
    var desiredWidth = $('#envelope_2').width(),
        desiredHeight = desiredWidth / 2.4; //keeps the width-height ratio at 600-250 (defaults for createFixture)
    var f = createFixture('#envelope_2', desiredWidth, desiredHeight, null, function() { return true; });
    var container = f.container, data = f.data,
      xScale = f.xScale, yScale = f.yScale;
    {{{example-code-2}}}
}());
</script>
