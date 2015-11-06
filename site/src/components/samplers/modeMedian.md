---
layout: component
title: Mode Median Sampling
component: data/samplers/modeMedian.js
namespace: samplers

example-code: |
    var data = fc.data.random.financial()(1000);

    var sampler = fc.data.samplers.modeMedian()
                                  .bucketSize(20)
                                  .value(function(d) { return d.low; });

    var sampledData = sampler(data);

    xScale.domain(fc.util.extent().fields('date')(sampledData))
    yScale.domain(fc.util.extent().fields('low')(sampledData));

    var line = fc.series.line();

    line.xScale(xScale)
        .yScale(yScale)
        .yValue(function (d) { return d.low; });

    container.append('g')
             .datum(sampledData)
             .call(line);

---

The mode-median sampling component is a method of subsampling data to improve performance with large data sets.

The example below creates large array of data points, reducing it to around 50.

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}
