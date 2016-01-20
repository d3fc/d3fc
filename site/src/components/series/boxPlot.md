---
layout: component
title: Box Plot Series
component: series/boxPlot.js
tags:
  - playground
namespace: Series
externals:
  boxPlot-js: boxPlot-example.js
  boxPlot-html: boxPlot-example.html
---

A [box plot series](https://en.wikipedia.org/wiki/Box_plot) is a convenient way of graphically depicting groups of
numerical data through their quartiles. Boxes can be renderer vertically or horizontally based on the value of the `orient` property.

The upper and lower end of each box are defined by the `upperQuartile` and `lowerQuartile` properties.
The upper and lower whisker of each box are defined by the `high` and `low` properties.
The line in the box is defined by the `median` property.
The `barWidth` property specifies the width of the box and `cap` defines the width of the whisker end caps as a fraction of the `barWidth`.

The following example generates a random box plot around each datapoint:

```js
{{{ codeblock boxPlot-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="boxPlot-html" js="boxPlot-js" }}}

{{{boxPlot-html}}}
<script type="text/javascript">
{{{boxPlot-js}}}
</script>
