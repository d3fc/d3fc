---
layout: component
title: Data Generator
component: dataGenerator/dataGenerator.js
namespace: data

example-code: |
  // construct a data generator
  dataGenerator = fc.data.random.financial();

  // generate some data!
  var data = dataGenerator(10);
---

The data generator component is a useful testing utility that generates data via a random walk algorithm.

```js
{{{example-code}}}
```

<pre id="utilities_generator"></pre>
<script type="text/javascript">
(function() {
    {{{example-code}}}
    d3.select("#utilities_generator").html(JSON.stringify(data, null, 2));
}());
</script>

You can supply a `filter` to skips days (i.e. weekends), and change the start price, volume and date.
