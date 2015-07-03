---
layout: component
title: Random Financial
component: data/random/financial.js
namespace: data

example-code: |
  var dataGenerator = fc.data.random.financial();

  // generate some data!
  var data = dataGenerator(10);

  d3.select("#financial")
    .text(JSON.stringify(data, null, 2));
---

The random financial data generator component is a useful testing utility that generates data via a random walk algorithm. You can supply a `filter` to skips days (i.e. weekends), and change the start price, volume and date.

```js
{{{example-code}}}
```

N.B. There is a default skip weekends filter applied after the data is generated for the specified number of days. Therefore the output will contain less than 10 items.

<pre id="financial"></pre>
<script type="text/javascript">
(function() {
    {{{example-code}}}
}());
</script>

