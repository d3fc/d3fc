---
layout: component
title: Candlestick Series
component: series/candlestick.js
namespace: Series
section: financial
externals:
  candlestick-example-js: candlestick-example.js
  candlestick-example-html: candlestick-example.html
---

A [candlestick series](http://en.wikipedia.org/wiki/Candlestick_chart) renders the open, high, low and close values for each bucketed time period:

```js
{{{ codeblock candlestick-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="candlestick-example-html" js="candlestick-example-js" }}}

{{{candlestick-example-html}}}
<script type="text/javascript">
{{{candlestick-example-js}}}
</script>

You can configure how the series obtains the high, low, open close values via the `yOpenValue`, `yHighValue`, `yLowValue` and `yCloseValue` properties. You can configure the width of each candlestick via the `barWidth` property, and also modify how they are rendered via the `decorate` property.
