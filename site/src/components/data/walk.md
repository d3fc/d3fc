---
layout: section
section: core
title: Random Walk
component: data/random/walk.js
namespace: Data
externals:
  walk-example-js: walk-example.js
  walk-example-html: walk-example.html
---

The random walk component creates a random series of values based on a [Geometric Brownian Motion](http://stuartreid.co.za/interactive-stochastic-processes/). It
is useful for generating arbitrary sets of data. The [random financial](./financial.html) component uses this component to create a random price series and a random volume series.

```js
{{{walk-example-js}}}
```

The data generated is returned as a simple numeric array.

{{{ dynamic-include 'codepen' html="walk-example-html" js="walk-example-js" }}}

{{{walk-example-html}}}
<script type="text/javascript">
{{{walk-example-js}}}
</script>
