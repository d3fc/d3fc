---
layout: component
title: Spread
component: data/spread.js
namespace: data

example-code: |
  var data = [
   {"State":"AL","Under 5 Years":"310","5 to 13 Years":"552","14 to 17 Years":"259","18 to 24 Years":"450","25 to 44 Years":"1215","45 to 64 Years":"641"},
   {"State":"AK","Under 5 Years":"52","5 to 13 Years":"85","14 to 17 Years":"42","18 to 24 Years":"74","25 to 44 Years":"183","45 to 64 Years":"50"},
   {"State":"AZ","Under 5 Years":"515","5 to 13 Years":"828","14 to 17 Years":"362","18 to 24 Years":"601","25 to 44 Years":"1804","45 to 64 Years":"1523"},
   {"State":"AR","Under 5 Years":"202","5 to 13 Years":"343","14 to 17 Years":"157","18 to 24 Years":"264","25 to 44 Years":"754","45 to 64 Years":"727"}
  ];

  var spread = fc.data.spread()
      .xValueKey('State');

  var series = spread(data);
---

This spread component is primarily used for manipulating data obtained via `d3.csv` into a suitable form for rendering via the [stacked](/components/series/stacked.html) or [grouped bar](/components/series/grouped-bar.html) series types.

When data is loaded via `d3.csv`, it is converted to an array of objects, one per row, with properties names derived from the CSV 'column' headings. The `spread` component converts the data into an array of series, one for each of the columns of data. The column that identifies the name for each series is identified via the `xValueKey` property.

```js
{{{example-code}}}
```

Which results in the following:

<pre id="spread"></pre>
<script type="text/javascript">
(function () {
    {{{example-code}}}
    d3.select("#spread")
      .text(JSON.stringify(series, null, 2));
}());
</script>

NOTE: each array has a `key` property that identifies the column it relates to.
