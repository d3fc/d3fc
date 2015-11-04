---
layout: component
title: Mode Median Sampling
component: data/samplers/modeMedian.js
namespace: samplers

example-code: |
    var data = fc.data.random.financial()(10000);

    var subsampledData = fc.data.samplers.modeMedian()
                                         .number(5)
                                         .field('low')(data);

    d3.select('#subsampled-data')
      .text(JSON.stringify(subsampledData, null, 2));

---

The mode-median sampling component is a fast method of subsampling data to improve performance with large data sets.

The example below creates large array of data points, reducing it to 5.

```js
{{{example-code}}}
```

Which gives the following:

<pre id="subsampled-data">Loading...</pre>
<script type="text/javascript">
    (function() {
        {{{example-code}}}
    })();
</script>

