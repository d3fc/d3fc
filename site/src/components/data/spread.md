---
layout: section
section: core
title: Spread
component: data/spread.js
namespace: Data
externals:
  spread-example-vertical-js: spread-example-vertical.js
  spread-example-vertical-html: spread-example-vertical.html
  spread-example-horizontal-js: spread-example-horizontal.js
  spread-example-horizontal-html: spread-example-horizontal.html
---

This spread component is primarily used for manipulating data obtained via `d3.csv` into a suitable form for rendering with the {{{ hyperlink 'stacked.html' title='stacked' }}}, {{{ hyperlink 'grouped-bar.html' title='grouped bar' }}} or {{{ hyperlink 'small-multiples.html' title='small multiples' }}} components.

When data is loaded via `d3.csv`, it is converted into an array of objects, one per row, with properties names derived from the CSV 'column' headings. The `spread` component converts the data into an array of series, either one for each column (vertical spread), or one per row (horizontal spead). The column that identifies the name for each series is identified via the `xValueKey` property.

The following example demonstrates a vertical spread (the default spread orientation):

```js
{{{spread-example-vertical-js}}}
```

Which results in the following:

{{{ dynamic-include 'codepen' html="spread-example-vertical-html" js="spread-example-vertical-js" }}}

{{{spread-example-vertical-html}}}
<script type="text/javascript">
{{{spread-example-vertical-js}}}
</script>

And here is the same data with a horizontal spread applied:

```js
{{{spread-example-horizontal-js}}}
```

Which results in the following:

{{{ dynamic-include 'codepen' html="spread-example-horizontal-html" js="spread-example-horizontal-js" }}}

{{{spread-example-horizontal-html}}}
<script type="text/javascript">
{{{spread-example-horizontal-js}}}
</script>
