---
layout: component
title: MACD
component: indicator/algorithm/macd.js
section: financial
namespace: Indicator
externals:
  macd-example-js: macd-example.js
  macd-example-html: macd-example.html  
---

A [MACD](https://en.wikipedia.org/wiki/MACD) indicator (short for Moving Average Convergence / Divergence) is computed from the difference between a fast (short period) Exponential Moving Average (EMA) and a slow (long period) EMA. It is rendered against a signal line, which is an EMA of the MACD itself, and a bar chart that shows the difference between the two.

The following is a simple example of the MACD indicator, where the fast, slow and signal periods have been set explicitly (it is more typically used with the defaults of 12, 29 & 9).

```js
{{{ codeblock macd-example-js }}}
```

Which yields the following:

{{{ dynamic-include 'codepen' html="macd-example-html" js="macd-example-js" }}}

{{{macd-example-html}}}
<script type="text/javascript">
{{{macd-example-js}}}
</script>
