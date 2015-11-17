---
layout: component
title: Mode Median
component: data/sampler/modeMedian.js
namespace: samplers

example-code: |
    // create some random data
    var data = fc.data.random.financial()(1000);

    // configure the sampler
    var sampler = fc.data.sampler.modeMedian()
      .bucketSize(20)
      .value(function(d) { return d.low; });

    // sample the data
    var sampledData = sampler(data);

    xScale.domain(fc.util.extent().fields('date')(sampledData))
    yScale.domain(fc.util.extent().fields('low')(sampledData));

    // render the sampled data
    var sampledLine = fc.series.line()
        .xScale(xScale)
        .yScale(yScale)
        .yValue(function (d) { return d.low; });

    container.append('g')
         .datum(sampledData)
         .call(sampledLine);

    // render the original data
    var originalLine = fc.series.line()
         .xScale(xScale)
         .yScale(yScale)
         .yValue(function (d) { return d.low; })
         .decorate(function(selection) {
             selection.enter().style('stroke-opacity', '0.5');
         });

    container.append('g')
          .datum(data)
          .call(originalLine);

---

Mode-Median Bucket is a simple algorithm. Each bucket is analysed for the frequency of y-values. If there is a single most common value (mode) in the bucket, then that y-value is chosen to represent the bucket. If there are multiple values with the same frequency, then some tie-breaking is required to choose a mode (d3fc chooses the last mode it comes across). If there is no mode, however, the median is taken.

The component takes an array of data as an input, returning a smaller, sampled array. You can configure the sampling frequency by setting the `bucketSize` property.

The example below creates an array of 1,000 datapoints, sampling it using a bucket-size of 20:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}
