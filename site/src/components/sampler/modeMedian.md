---
layout: component
title: Mode Median
component: data/sampler/modeMedian.js
namespace: Samplers
externals:
  mode-median-js: modeMedian-example.js
  mode-median-html: modeMedian-example.html
---

Mode-Median Bucket is a simple algorithm. Each bucket is analysed for the frequency of y-values. If there is a single most common value (mode) in the bucket, then that y-value is chosen to represent the bucket. If there are multiple values with the same frequency, then some tie-breaking is required to choose a mode (d3fc chooses the last mode it comes across). If there is no mode, however, the median is taken. Further information about this algorithm can be found in the thesis [Downsampling Time Series for Visual Representation](http://skemman.is/stream/get/1946/15343/37285/3/SS_MSthesis.pdf).

The component takes an array of data as an input, returning a smaller, sampled array. You can configure the sampling frequency by setting the `bucketSize` property.

The example below creates an array of 1,000 datapoints, sampling it using a bucket-size of 20:

```js
{{{codeblock mode-median-js}}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="mode-median-html" js="mode-median-js"}}}

{{{mode-median-html}}}
<script type="text/javascript">
{{{mode-median-js}}}
</script>
