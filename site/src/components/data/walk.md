---
layout: component
title: Random Walk
component: data/random/walk.js
namespace: data

example-code: |
  var dataGenerator = fc.data.random.walk()
    .period(2)   // Projection period, by default = 1
    .steps(30)   // Number of points to generate, by default = 20
    .mu(0.3)     // Drift component, by default = 0.1
    .sigma(0.2); // Volatility, by default = 0.1

  // data is generated here
  var data = dataGenerator(100); // The series starts at 100

  d3.select("#walk")
    .text(JSON.stringify(data, null, 2));
---

The random walk component creates a random series of values based on a [Geometric Brownian Motion](http://stuartreid.co.za/interactive-stochastic-processes/). It 
is useful for generating arbitrary sets of data. The [random financial](./financial.html) component uses this component to create a random price series and a random volume series.

```js
{{{example-code}}}
```

The data generated is returned as a simple numeric array.

<pre id="walk"></pre>
<script type="text/javascript">
(function() {
    {{{example-code}}}
}());
</script>
