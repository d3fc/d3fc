---
layout: section
title: Bollinger Bands
component: indicator/algorithm/bollingerBands.js
section: financial
namespace: Indicator
externals:
  bollinger-bands-example-js: bollinger-bands-example.js
  bollinger-bands-example-html: bollinger-bands-example.html
---

[Bollinger bands](http://en.wikipedia.org/wiki/Bollinger_Bands) are an indicator that combine an n-point moving average with upper and lower bands that are positioned k-times an n-point standard deviation around the average.

The example below creates a point series and a bollinger band indicator:

```js
{{{ codeblock bollinger-bands-example-js }}}
```

{{{ dynamic-include 'codepen' html="bollinger-bands-example-html" js="bollinger-bands-example-js" }}}

{{{bollinger-bands-example-html}}}
<script type="text/javascript">
{{{bollinger-bands-example-js}}}
</script>
