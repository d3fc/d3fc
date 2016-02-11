---
layout: component
section: core
title: Stacked Series
component: series/stacked
namespace: Series
externals:
  stacked-example-js: stacked-example.js
  stacked-example-html: stacked-example.html
---

The stacked series (bar, area and line) components render multiple series of data in a stacked form. The data needs to be presented to the component as multiple distinct series, where each datapoint exposes `y` and `y0` properties, where the `y0` property indicates the offset required to stack the series.

If the data is loaded via `d3.csv`, it is converted to an array of objects, one per row, with properties names derived from the CSV 'column' headings. The easiest way to manipulate the data into multiple series (one per 'column'), is to use [`d3.data.spread`](/components/data/spread.html) component. Following this `d3.layout.stack` can be used to stack the data, providing the required `y0` property.

The following example shows how to manipulate some data into the required form, then configures the stacked bar series accordingly:

```js
{{{ codeblock stacked-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="stacked-example-html" js="stacked-example-js" }}}

{{{stacked-example-html}}}
<script type="text/javascript">
{{{stacked-example-js}}}
</script>
