---
layout: example
example: true
title: Multi Line
externals:
    multi-line-js: multi-line.js
    multi-line-html: multi-line.html
    multi-line-css: multi-line.css
---

{{{ dynamic-include 'codepen' html="multi-line-html" js="multi-line-js"}}}

<style>
{{{multi-line-css}}}
</style>

{{{multi-line-html}}}

<script>
{{{multi-line-js}}}
</script>

In this example we use a combination of {{{ hyperlink 'multi.html' title='multi series' }}} and {{{ hyperlink 'series/line.html' title='line series' }}} to produce multiple distinct line series. This is achieved by dynamically configuring the multi's `series` property with a projection of the `n` data items to `n` line series and specifying an index-based `mapping` function.

```js
{{{multi-line-js}}}
```
