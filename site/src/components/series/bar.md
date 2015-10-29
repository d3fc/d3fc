---
layout: component
title: Bar Series
component: series/bar.js
tags:
namespace: series

example-code: |
  var bar = fc.series.bar()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(bar);
---

The bar series renders the given data as a series of vertical bars:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

This series has the same `xValue`, `yValue` and `decorate` properties as the [point series](./point). You can also specify the width of the bars via the `barWidth` property.

