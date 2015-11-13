---
layout: component
title: Gridlines
component: annotation/gridline.js
tags:
 - playground
namespace: annotation

example-code: |
  var gridlines = fc.annotation.gridline()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(gridlines);
---

This component renders horizontal and vertical gridlines.

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

You can configure the number of ticks via the `xTicks` and `yTicks` properties.
