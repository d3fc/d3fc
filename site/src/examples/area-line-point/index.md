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
{{{codeblock area-line-point-js}}}
```

The above code demonstrates another feature of the {{{ hyperlink 'multi.html' title='multi series' }}}: the `mapping` property. This allows for a bespoke mapping from the data bound to the multi series to the data bound to each of the child series. In this case, the data bound to the {{{ hyperlink 'series/point.html' title='point series' }}} is filtered to only show every 10th item (10n + 5).

```js
{{{area-line-point-js}}}
```
