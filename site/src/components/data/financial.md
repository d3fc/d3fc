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

The random financial data generator component is a useful testing utility that generates data via a random walk algorithm.

```js
{{{example-code}}}
```

To skip weekends call the `skipWeekends` property. A `filter` can be supplied to skips other days, or change the start price, volume and date.

<pre id="financial"></pre>
<script type="text/javascript">
(function() {
    {{{example-code}}}
}());
</script>

