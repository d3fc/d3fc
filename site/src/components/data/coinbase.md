---
layout: component
title: Coinbase
component: data/feed/coinbase.js
namespace: Data
externals:
  coinbase-example-js: coinbase-example.js
  coinbase-example-html: coinbase-example.html
---

The coinbase component fetches data from the [Coinbase exchange API](https://docs.exchange.coinbase.com/#market-data). The `product`, `start`, `end` and `granularity` can be customised via their respective properties. For more information on the parameters see the Coinbase docs. N.B. The implementation does the ISO date conversion allowing `start` and `end` to be provided as JavaScript `Date` instances.

```js
{{{ codeblock coinbase-example-js}}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="coinbase-example-html" js="coinbase-example-js" }}}

{{{coinbase-example-html}}}
<script type="text/javascript">
{{{coinbase-example-js}}}
</script>
