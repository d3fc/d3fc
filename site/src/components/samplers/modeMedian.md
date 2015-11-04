---
layout: component
title: Mode Median Sampling
component: data/samplers/modeMedian.js
namespace: samplers

example-code: |
    var data = fc.data.random.financial()(20);

    var sampler = fc.data.samplers.modeMedian()
                                  .number(5)
                                  .value(function(d) { return d.low; });

    var sampledData = sampler(data);

    d3.select('#subsampled-data')
      .text(JSON.stringify(sampledData, null, 2));

    d3.select('#full-data')
      .text(JSON.stringify(data, null, 2));

---

The mode-median sampling component is a fast method of subsampling data to improve performance with large data sets.

The example below creates large array of data points, reducing it to 5.

```js
{{{example-code}}}
```

Which gives the following subsampled data:

<pre id="subsampled-data">Loading...</pre>

...when given the following data:

<pre id="full-data">Loading...</pre>

<script type="text/javascript">
    (function() {
        {{{example-code}}}
    })();
</script>

