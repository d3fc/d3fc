---
layout: section
section: core
title: Grouped Series
component: series/grouped.js
namespace: Series
externals:
  grouped-example-js: grouped-example.js
  grouped-example-html: grouped-example.html
---

The grouped component renders multiple series of data in a grouped / clustered form.

If the data is loaded via `d3.csv`, it is converted to an array of objects, one per row, with properties names derived from the CSV 'column' headings. The easiest way to manipulate the data into multiple series (one per 'column'), is to use [`d3.data.spread`](/components/data/spread.html) component.

The following example shows how to manipulate some data into the required form, then configures the stacked bar series accordingly:

```js
{{{ codeblock grouped-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="grouped-example-html" js="grouped-example-js" }}}

{{{grouped-example-html}}}
<script type="text/javascript">
{{{grouped-example-js}}}
</script>
