---
layout: section
section: core
title: Extent
component: util/extent.js
namespace: Util
---

Extends the D3 extent functionality (found in [d3-array](https://github.com/d3/d3-array)) to allow padding, multiple accessors and date support. Two variants are provided, one specialised for numeric values and another for dates -

```js
var data = [{ x: 1 }, { x: 2 }, { x: 4 }, { x: 8 }, { x: 16 }];

var extent = fc.util.extentLinear()
  .accessors([function(d) { return d.x; }])
  .pad([1, 4])
  .padUnit('domain');

extent(data);
// [0, 20]
```

For more details on using linear extent see [d3fc-extent](https://github.com/d3fc/d3fc-extent#linear).

```js
var data = [{ x: new Date(2016, 0, 1) }, { x: new Date(2016, 0, 11) }];

var extent = fc.util.extentDate()
  .accessors([function(d) { return d.x; }])
  .pad([0, 0.2]);

extent(data);
// [ 2016-01-01T00:00:00.000Z, 2016-01-13T00:00:00.000Z ]
```

For more details on using date extent see [d3fc-extent](https://github.com/d3fc/d3fc-extent#date).

Previously this functionality was provided by a single component but this resulted in unresolvable ambiguity. Whilst still available to ease upgrading, its use is deprecated and there are some [important changes](https://github.com/ScottLogic/d3fc/commit/00f3a9677803559f883fe673be11159a1bbe6c3f) to be aware of.
