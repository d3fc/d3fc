---
layout: component
title: Largest Triangle 1 Bucket
component: data/sampler/largestTriangleOneBucket.js
namespace: Samplers
externals:
  largest-traingle-js: largestTriangleOne-example.js
  largest-traingle-html: largestTriangleOne-example.html
---

Largest Triangle is a sampler where, given two pre-determined points, the point in the bucket that forms the largest triangle has the largest effective area and so is the most important in the bucket. The one bucket implementation is where the two other points are the points before and after the current point being checked. This sampler naturally chooses points with highest difference relative to its neighbours and not the bucket. This brings with it the advantage of being able to pre-compute all the points' effective areas before checking for maxima. Further information about this algorithm can be found in the thesis [Downsampling Time Series for Visual Representation](http://skemman.is/stream/get/1946/15343/37285/3/SS_MSthesis.pdf).

The sampler requires both the `x` and `y` properties in order to calculate the area. You can configure the sampling frequency by setting the `bucketSize` property. As the Largest Triangle One Bucket sampler computes areas, if you have a non-linear or discontinuous scale, the values supplied to the sampler must be scaled accordingly. You can apply the respective scales in the accessor functions as follows:

```js
var sampler = fc.data.sampler.largestTriangleOneBucket()
    .bucketSize(20)
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.low); });
```

The example below creates an array of 1,000 datapoints, sampling it using a bucket-size of 20. For simplicity of the example, the scale functions aren't called when accessing `x` or `y`.

```js
{{{codeblock largest-traingle-js}}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="largest-traingle-html" js="largest-traingle-js"}}}

{{{largest-traingle-html}}}
<script type="text/javascript">
{{{largest-traingle-js}}}
</script>
