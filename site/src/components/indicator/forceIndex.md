---
layout: section
title: Force Index
component: indicator/algorithm/forceIndex.js
section: financial
namespace: Indicator
externals:
  forceIndex-example-js: forceIndex-example.js
  forceIndex-example-html: forceIndex-example.html
---

A [Force Index](http://en.wikipedia.org/wiki/Force_index) is an indicator that illustrates how strong the actual buying
or selling pressure is. It is calculated by subtracting today's closing price from yesterday's and
multiplying the result by today's volume. The 13 day {{{ hyperlink 'exponentialMovingAverage.html' title='Exponential Moving Average' }}}
of the Force Index is often used. The Force Index is typically plotted on a chart centered around the 0 line.
Attention is given to the relative size and trends in the Index.

The Force Index rendered on a linear scale:

```js
{{{ codeblock forceIndex-example-js }}}
```

{{{ dynamic-include 'codepen' html="forceIndex-example-html" js="forceIndex-example-js" }}}

{{{forceIndex-example-html}}}
<script type="text/javascript">
{{{forceIndex-example-js}}}
</script>
