---
layout: component
title: Elder Ray
component: indicator/algorithm/elderRay.js
namespace: Indicator
externals:
  elderray-example-js: elderray-example.js
  elderray-example-html: elderray-example.html
---

An [Elder Ray](http://www.investopedia.com/articles/trading/03/022603.asp) indicator is composed of two distinct series:

`Bull Power = Daily High - n-period Exponential Moving Average (EMA)`

`Bear Power = Daily Low - n-period EMA`

Where the n-period defaults to 13 days.

The following shows the Elder Ray in action, where the bull and bear power series are both rendered on the same chart:

```js
{{{ codeblock elderray-example-js }}}
```

{{{ dynamic-include 'codepen' html="elderray-example-html" js="elderray-example-js" }}}

{{{elderray-example-html}}}
<script type="text/javascript">
{{{elderray-example-js}}}
</script>
