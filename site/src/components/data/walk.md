---
layout: component
title: Random Walk
component: data/random/walk.js
namespace: Data
externals:
  walk-example-js: walk-example.js
  walk-example-html: walk-example.html
---

The random walk component creates a series of values based on the [Geometric Brownian Motion](http://stuartreid.co.za/interactive-stochastic-processes/) stochastic process.
The [random financial](./financial.html) component uses it to create random open-high-low-close (OHLC) price data.

```js
{{{walk-example-js}}}
```

The data generated is returned as a simple numeric array.

{{{ dynamic-include 'codepen' html="walk-example-html" js="walk-example-js" }}}

{{{walk-example-html}}}
<script type="text/javascript">
{{{walk-example-js}}}
</script>
