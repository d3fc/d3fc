---
layout: component
title: Line Series
component: series/line.js
tags:
  - frontpage
namespace: series

example-code: |
  var line = fc.series.line()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(line);
---

The line series renders the given data as a line, constructed from an SVG `path`:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

This series has the same properties for specifying the x and y value accessors, and decorate as the [point series](#point).

