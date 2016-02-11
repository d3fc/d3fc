---
layout: component
section: core
title: Error Bar Series
component: series/errorBar.js
namespace: Series
externals:
  errorbar-example-js: errorBar-example.js
  errorbar-example-html: errorBar-example.html
  errorbar-example-2-js: errorBar-example-2.js
  errorbar-example-2-html: errorBar-example-2.html
---

An [error bar series](http://en.wikipedia.org/wiki/Error_bar) renders the error or uncertainty area around each datapoint. Error bars can be renderer vertically or horizontally based on the value of the `orient` property. The upper and lower bounds of each bar are defined by the `errorUpper` and `errorLower` properties.

The following example generates a random error around each datapoint:

```js
{{{ codeblock errorbar-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="errorbar-example-html" js="errorbar-example-js" }}}

{{{errorbar-example-html}}}
<script type="text/javascript">
{{{errorbar-example-js}}}
</script>

Error bars are typically combined with other series (e.g. bar or point) using the multi-series component. The following example shows a bar series with associated error bars:

```js
{{{ codeblock errorbar-example-2-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="errorbar-example-2-html" js="errorbar-example-2-js" }}}

{{{errorbar-example-2-html}}}
<script type="text/javascript">
{{{errorbar-example-2-js}}}
</script>
