---
layout: component
section: core
title: Cartesian
component: chart/cartesian.js
namespace: Chart
externals:
  cartesian-example-js: cartesian-example.js
  cartesian-example-html: cartesian-example.html
---

The cartesian chart is a component that combines a pair of scales, axes and labels with a 'plot area' which is a container where the associated series are rendered. The cartesian chart is responsible for the overall chart layout, ensuring that the axes are correctly aligned and the scale ranges are set accordingly.

The following simple example shows how to construct a cartesian chart, where a pair of linear axes (x and y), are supplied to the component factory function. The chart is responsible for setting the `xScale` and `yScale` properties of the series associated with the plot area:

```js
{{{ codeblock cartesian-example-js}}}
```

This results in the following chart:

{{{ dynamic-include 'codepen' html="cartesian-example-html" js="cartesian-example-js" }}}

{{{cartesian-example-html}}}
<script type="text/javascript">
{{{cartesian-example-js}}}
</script>

A number of the more [complex examples](/examples) use the cartesian chart as the basic 'boiler plate' for constructing a chart.
