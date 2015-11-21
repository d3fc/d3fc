---
layout: component
title: Tooltip
component: chart/tooltip.js
namespace: chart

example-code: |
  var data = {
    high: 34.5,
    low: 32.53,
    open: 33.7,
    close: 33.6
  };

  var priceFormat = d3.format('.2f');
  var tooltip = fc.chart.tooltip()
      .items([
          ['open', function(d) { return priceFormat(d.open); }],
          ['high', function(d) { return priceFormat(d.high); }],
          ['low', function(d) { return priceFormat(d.low); }],
          ['close', function(d) { return priceFormat(d.close); }]
      ]);

  var svg = d3.select('#tooltip')
    .attr({width: 100, height: 60});

  svg.datum(data)
    .call(tooltip);
---

The tooltip component renders the bound data is a table, where the mapping from the data to the tabular form is expressed via the `items` property as demonstrated below:

```js
{{{example-code}}}
```

Which results in the following:

<svg id="tooltip"> </svg>
<script type="text/javascript">
(function() {
  {{{example-code}}}
}());
</script>

Both the label and value for each row can be expressed as a constant or a function of the bound data.

The tooltip uses [flexbox layout](/components/layout/flexbox.html) in order to construct the rows / columns. As a result, the size of the tooltip is determined by the size of its containing element, which is determined either by measuring the element dimensions, or from the `layout-width` and `layout-height` properties as described in the flexbox layout documentation.

The tooltip is most often used in conjunction with the crosshair component, consult the [crosshair documentation](/components/tool/crosshair.html) for more details.
