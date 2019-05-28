---
layout: example
title: Streaming Financial Chart
example: true
externals:
  streaming-js: streaming.js
  streaming-html: streaming.html
  streaming-css: streaming.css
---

<style>
{{{ streaming-css }}}
</style>
{{{ dynamic-include 'codepen' html='streaming-html' js='streaming-js' css='streaming-css'}}}
{{{ streaming-html }}}
{{{ dynamic-include 'javascript' js='streaming-js' }}}

This example shows how D3FC can be used to render dynamic data. The basic principle is that the chart render function should be an idempotent transformation of the data. As a result, if the data changes the entire render function is re-evaluated.

```js
{{{ codeblock streaming-js }}}
```
