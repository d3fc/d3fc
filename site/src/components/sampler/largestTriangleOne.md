---
layout: component
title: Largest Triangle 1 Bucket
component: data/sampler/largestTriangleOneBucket.js
namespace: samplers

example-code: |
    // create some random data
    var data = fc.data.random.financial()(1000);

    // configure the sampler
    var sampler = fc.data.sampler.largestTriangleOneBucket()
        .bucketSize(20)
        .x(function(d) { return d.date; })
        .y(function(d) { return d.low; });

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

The Largest Triangle One Bucket component subsamples data by calculating the largest areas between a data point and its immediate neighbours.

The sampler requires both the `x` and `y` properties in order to calculate the area. You can configure the sampling frequency by setting the `bucketSize` property. As the Largest Triangle One Bucket sampler computes areas, if you have a non-linear or discontinuous scale, the values supplied to the sampler must be scaled accordingly. You can apply the respective scales in the accessor functions as follows:

```js
    var sampler = fc.data.sampler.largestTriangleOneBucket()
        .bucketSize(20)
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.low); });
```

The example below creates an array of 1,000 datapoints, sampling it using a bucket-size of 20. For simplicity of the example, the scale functions aren't called when accessing `x` or `y`.

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}
