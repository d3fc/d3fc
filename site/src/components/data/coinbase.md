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

Fetch data from the [Coinbase exchange API](https://docs.exchange.coinbase.com/#market-data). The `product`, `start`, `end` and `granularity` can be customised, for more information on the parameters see the Coinbase docs. N.B. The implementation does the ISO date conversion so `start` and `end` should be provided as JavaScript Dates.

```js
{{{example-code}}}
```

<pre id="coinbase">Loading...</pre>
<script type="text/javascript">
(function() {
    {{{example-code}}}
}());
</script>
