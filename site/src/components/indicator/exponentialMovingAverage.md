---
layout: component
title: Exponential Moving Average
component: indicator/algorithm/exponentialMovingAverage.js
section: financial
namespace: Indicator
externals:
  ema-example-js: exponentialMovingAverage-example.js
  ema-example-html: exponentialMovingAverage-example.html
---

An [Exponential Moving Average](https://en.wikipedia.org/?title=Moving_average#Exponential_moving_average) (EMA) is an indicator that smooths out fluctuations in data.

The example below creates a point series and an EMA:

```js
{{{ codeblock ema-example-js }}}
```

{{{ dynamic-include 'codepen' html="ema-example-html" js="ema-example-js" }}}

{{{ema-example-html}}}
<script type="text/javascript">
{{{ema-example-js}}}
</script>

You can configure the number of datapoints that are included in the moving average via the `windowSize` property, you can also change the object property that is averaged via the `yValue` property.
