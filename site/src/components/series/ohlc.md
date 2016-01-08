---
layout: component
title: OHLC Series
component: series/ohlc.js
namespace: Series
externals:
  ohlc-example-js: ohlc-example.js
  ohlc-example-html: ohlc-example.html
---

An [open-high-low-close (OHLC) series](http://en.wikipedia.org/wiki/Open-high-low-close_chart) renders the open, high, low and close values for each bucketed time period:


```js
{{{ codeblock ohlc-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="ohlc-example-html" js="ohlc-example-js" }}}

{{{ohlc-example-html}}}
<script type="text/javascript">
{{{ohlc-example-js}}}
</script>

The OHLC series shares the same configuration options as the [candlestick series](#candlestick).
