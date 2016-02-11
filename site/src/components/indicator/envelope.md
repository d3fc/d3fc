---
layout: section
title: Envelope
component: indicator/algorithm/envelope.js
section: financial
namespace: Indicator
externals:
  envelope-example-js: envelope-example.js
  envelope-example-html: envelope-example.html
  envelope-example-2-js: envelope-example-2.js
  envelope-example-2-html: envelope-example-2.html
---

An [Envelope](http://www.investopedia.com/terms/e/envelope.asp?optm=sa_v2) is an indicator that defines an area around a series as defined by an upper and a lower bound.

The example below creates a line series which is bounded by an envelope:

```js
{{{ codeblock envelope-example-js }}}
```

{{{ dynamic-include 'codepen' html="envelope-example-html" js="envelope-example-js" }}}

{{{envelope-example-html}}}
<script type="text/javascript">
{{{envelope-example-js}}}
</script>

You can specify the value that is bounded by the envelope via the `value` property, also the distance between the upper and lower bounds can be controlled using the `factor` property.

Envelopes are most often used with an [exponential moving average](./exponentialMovingAverage), where the a price that falls outside of the envelope constitutes either a buy or a sell signal. The following example creates a
[candlestick series](../series/candlestick), an [exponential moving average](./exponentialMovingAverage)
and an envelope indicator:

```js
{{{ codeblock envelope-example-2-js }}}
```

{{{ dynamic-include 'codepen' html="envelope-example-2-html" js="envelope-example-2-js" }}}

{{{envelope-example-2-html}}}
<script type="text/javascript">
{{{envelope-example-2-js}}}
</script>
