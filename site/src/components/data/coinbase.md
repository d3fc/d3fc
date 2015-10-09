---
layout: component
title: Coinbase
component: data/feed/coinbase.js
namespace: data

example-code: |
  var feed = fc.data.feed.coinbase();

  // fetch some data!
  feed(function(error, data) {
    d3.select("#coinbase")
      .text(JSON.stringify(error ? error : data, null, 2));
  });
---

The coinbase component fetches data from the [Coinbase exchange API](https://docs.exchange.coinbase.com/#market-data). The `product`, `start`, `end` and `granularity` can be customised via their respective properties. For more information on the parameters see the Coinbase docs. N.B. The implementation does the ISO date conversion allowing `start` and `end` to be provided as JavaScript `Date` instances.

```js
{{{example-code}}}
```

<pre id="coinbase">Loading...</pre>
<script type="text/javascript">
(function() {
    {{{example-code}}}
}());
</script>
