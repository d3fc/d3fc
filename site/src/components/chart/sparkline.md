---
layout: section
section: core
title: Sparkline
component: chart/sparkline.js
namespace: Chart
externals:
  sparkline-example-js: sparkline-example.js
  sparkline-example-html: sparkline-example.html
---

Sparklines are very small word-size charts that are often embedded within text. The following is a passage of text that contains sparklines defined as span elements, `<span class='sparkline'></span>`:

```html
{{{sparkline-example-html}}}
```

The following code selects all of these elements, using this component to construct a sparkline for each one:

```js
{{{sparkline-example-js}}}
```

{{{ dynamic-include 'codepen' html="sparkline-example-html" js="sparkline-example-js" }}}

{{{sparkline-example-html}}}
<script type="text/javascript">
{{{sparkline-example-js}}}
</script>
