---
layout: section
title: Relative Strength Index
component: indicator/algorithm/relativeStrengthIndex.js
section: financial
namespace: Indicator
externals:
  rsi-example-js: relativeStrengthIndex-example.js
  rsi-example-html: relativeStrengthIndex-example.html  
---

A [Relative Strength Index](http://en.wikipedia.org/wiki/Relative_strength_index) is an indicator that plots the historical strength or weakness of a stock based on closing prices. It is typically plotted on a 14-day timeframe and is displayed next to overbought (70%) and oversold lines (30%) lines.

The RSI indicator is rendered on a percent scale:

```js
{{{ codeblock rsi-example-js }}}
```

Which yields the following:

{{{ dynamic-include 'codepen' html="rsi-example-html" js="rsi-example-js" }}}

{{{rsi-example-html}}}
<script type="text/javascript">
{{{rsi-example-js}}}
</script>

You can configure the number of datapoints that are included in the RSI via the `windowSize` property, you can also change how the close values are read via the `closeValue` property.
