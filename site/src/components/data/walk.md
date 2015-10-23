---
layout: component
title: Random Walk
component: data/random/walk.js
namespace: data

example-code: |
  var dataGenerator = fc.data.random.walk()
    .period(2)   //by default = 1
    .steps(30)   //by default = 20
    .mu(0.3)     //by default = 0.1
    .sigma(0.2); //by default = 0.1

  // data is generated here
  var data = dataGenerator(100); //100 will be the initial value

  d3.select("#walk")
    .text(JSON.stringify(data, null, 2));
---

The random walk data generator component is a useful generates data via a random walk algorithm. It is useful for
generating data for an arbitrary series. [Random Financial](./financial.html) component is using it 
to generate its data.

```js
{{{example-code}}}
```

The data generated is in the form of a simple numeric array.

<pre id="walk"></pre>
<script type="text/javascript">
(function() {
    {{{example-code}}}
}());
</script>

