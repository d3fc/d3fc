---
layout: section
title: Moving Average
component: indicator/algorithm/movingAverage.js
section: financial
namespace: Indicator
externals:
  ma-example-js: movingAverage-example.js
  ma-example-html: movingAverage-example.html
---

A [moving average](http://en.wikipedia.org/wiki/Moving_average) is an indicator that smooths out fluctuations in data. This component computes a [simple moving average](http://en.wikipedia.org/wiki/Moving_average#Simple_moving_average) for a given data field, averaging the previous 5 points by default.

D3FC indicators are comprised of two component parts:

 + The indicator algorithm, which is applied to the input data. The algorithm computes the indicator and merges the result back into the source data (although this behaviour is configurable).
 + An optional indicator renderer, that converts the algorithm output into one or more series / annotations.

Simpler indicators do not require renderer with their output readily rendered via a simple series.

The example below creates a point series and a moving average:

```js
{{{ codeblock ma-example-js }}}
```

{{{ dynamic-include 'codepen' html="ma-example-html" js="ma-example-js" }}}

{{{ma-example-html}}}
<script type="text/javascript">
{{{ma-example-js}}}
</script>

You can configure the number of datapoints that are included in the moving average via the `period` property, you can also change the object property that is averaged via the `value` property.
