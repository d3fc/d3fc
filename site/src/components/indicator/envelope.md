---
layout: component
title: Envelope
component: indicator/algorithm/envelope.js
tags:
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
      .value(function (d){return d.close});
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
  var candlestick  = fc.series.candlestick ()
      .xScale(xScale)
      .yScale(yScale);
        
  // Create and apply the EMA
  var movingAverage = fc.indicator.algorithm.exponentialMovingAverage()
  movingAverage(data);
  
  // Create a line that renders the result
  var ema = fc.series.line()
      .yValue(function(d) { return d.exponentialMovingAverage; })
      .xScale(xScale)
      .yScale(yScale);
  
  // Add it to the container
  container.append('g')
      .datum(data)
      .call(ema);

  // Create and apply the envelopes algorithm to the exponential moving average
  var envelopeAlgorithm = fc.indicator.algorithm.envelope()
      .factor(0.01)
      .value(function (d){return d.exponentialMovingAverage});
  envelopeAlgorithm(data);

  // Create the renderer
  var envelope = fc.indicator.renderer.envelope()
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(envelope);
      
  // Adding candlestick to the container
  container.append('g')
      .datum(data)
      .call(candlestick );
---

An [Envelope](http://www.investopedia.com/terms/e/envelope.asp?optm=sa_v2) is an indicator that defines an upper and a lower level for a given timeseries. It can be used on any timeseries by specifying the `value` property. The width of channel can also be controlled using `factor` property.

The example below creates a line series and an envelope indicator:

```js
{{{example-code}}}
```

{{>example-fixture}}

Envelopes are most often used with [Exponential Moving Averages](./exponentialMovingAverage), as the price breaking out
of the channel constitutes either a buy or a sell signal. The following example creates a 
[candlestick chart](../series/candlestick), an [exponential moving average](./exponentialMovingAverage) 
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
