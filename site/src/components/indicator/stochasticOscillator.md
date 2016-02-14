---
layout: section
title: Stochastic Oscillator
component: indicator/algorithm/stochasticOscillator.js
section: financial
namespace: Indicator
externals:
  stochastic-example-js: stochasticOscillator-example.js
  stochastic-example-html: stochasticOscillator-example.html  
---

A [Stochastic Oscillator](https://en.wikipedia.org/wiki/Stochastic_oscillator) consists of two parts: %K and %D. %K relates the closing price to the full trading range over the specified window (5 data points by default). %D is the simple moving average of the %K values over a second window (3 data points by default).

The window lengths can be changed using the `kWindowSize` and `dWindowSize` properties. The calculation requires the High, Low and Close values of each data point. The object property used for these can be set via the `highValue`, `lowValue` and `closeValue` properties.

By default, the results from the calculation will be stored as a `stochastic` property on each point in the data set. The way the values are merged, can be altered using the `merge` property.

The following is a simple example of the Stochastic oscillator. The %K window has been set to 14 data points.

```js
{{{ codeblock stochastic-example-js }}}
```

Which yields the following:

{{{ dynamic-include 'codepen' html="stochastic-example-html" js="stochastic-example-js" }}}

{{{stochastic-example-html}}}
<script type="text/javascript">
{{{stochastic-example-js}}}
</script>
