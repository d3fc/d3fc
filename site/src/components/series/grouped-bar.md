---
layout: component
section: core
title: Grouped Bar Series
component: series/groupedBar.js
namespace: Series
externals:
  grouped-bar-example-js: grouped-bar-example.js
  grouped-bar-example-html: grouped-bar-example.html
---

The grouped bar component renders multiple series of data in a grouped / clustered form.

If the data is loaded via `d3.csv`, it is converted to an array of objects, one per row, with properties names derived from the CSV 'column' headings. The easiest way to manipulate the data into multiple series (one per 'column'), is to use [`d3.data.spread`](/components/data/spread.html) component.

The following example shows how to manipulate some data into the required form, then configures the stacked bar series accordingly:

```js
{{{ codeblock grouped-bar-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="grouped-bar-example-html" js="grouped-bar-example-js" }}}

{{{grouped-bar-example-html}}}
<script type="text/javascript">
{{{grouped-bar-example-js}}}
</script>
