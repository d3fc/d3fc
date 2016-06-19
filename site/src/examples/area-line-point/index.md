---
layout: example
example: true
title: Area Line Point
externals:
    area-line-point-js: area-line-point.js
    area-line-point-html: area-line-point.html
    area-line-point-css: area-line-point.css
---

{{{ dynamic-include 'codepen' html="area-line-point-html" js="area-line-point-js"}}}

<style>
{{{area-line-point-css}}}
</style>

{{{area-line-point-html}}}

<script>
{{{area-line-point-js}}}
</script>

In this example we combine a {{{ hyperlink 'series/area.html' title='area series' }}}, {{{ hyperlink 'series/line.html' title='line series' }}} and {{{ hyperlink 'series/point.html' title='point series' }}} using a {{{ hyperlink 'multi.html' title='multi series' }}}. This combination allows for flexibility when styling the series to achieve e.g. gradient fills. It also demonstrates {{{ hyperlink 'decorate-pattern.html' title='decorating' }}} the point series to easily add labels to specific points on the series.

```js
{{{area-line-point-js}}}
```
