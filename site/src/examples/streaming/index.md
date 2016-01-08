---
layout: example
example: true
title: Streaming Chart
externals:
    streaming-js: streaming.js
    streaming-html: streaming.html
    streaming-css: streaming.css
---

{{{ dynamic-include 'codepen' html="streaming-html" js="streaming-js"}}}

<style>
{{{streaming-css}}}
</style>

{{{streaming-html}}}

<script>
{{{streaming-js}}}
</script>

This example shows how d3fc can be used to render dynamic data. The basic principle is that the chart render function
should be an idempotent transformation of the data. As a result, if the data changes the entire render function is
re-evaluated.

```js
{{{streaming-js}}}
```
