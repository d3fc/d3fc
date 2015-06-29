---
layout: component
title: Sparkline
component: chart/sparkline.js
tags:
  - frontpage
namespace: chart

example-fixture: |
  <p>Lorem ipsum dolor sit amet, <span class='sparkline'></span>  consectetur adipiscing elit. Morbi feugiat nunc <span class='sparkline'></span> lacus, id laoreet erat volutpat nec. Sed ac vestibulum lacus. Quisque porttitor accumsan neque <span class='sparkline'></span> tincidunt aliquam. Nam iaculis eros eu tincidunt dapibus. Donec pellentesque orci eu egestas <span class='sparkline'></span> pretium. Vestibulum elementum metus nec ipsum rhoncus, id iaculis libero euismod. Etiam et ultricies eros, sollicitudin porta neque.</p>

example-code: |
  d3.selectAll('.sparkline')
      .each(function() {
          var sparkline = d3.select(this);

          // typically at this point you would fetch or look-up the
          // data for the specific sparkline - here we use dummy data instead

          // var stock = sparkline.attr('data-ticker');
          var data = fc.data.random.financial()(50);

          var chart = fc.chart.sparkline()
              .xDomain(fc.util.extent(data, 'date'))
              .yDomain(fc.util.extent(data, 'low'))
              .radius(2)
              .yValue(function(d) { return d.low; });

          sparkline
              .append('svg')
              .style({
                  height: '15px',
                  width: '80px',
                  display: 'inline'
              })
              .datum(data)
              .call(chart);
      });
---

Sparklines are very small word-size charts that are often embedded within text. The following is a passage of text that contains sparklines defined as span elements, `<span class='sparkline'></span>`:

{{{example-fixture}}}

The following code selects all of these elements, using this component to construct a sparkline for each one:

```js
{{{example-code}}}
```

<script type="text/javascript">
(function() {
  {{{example-code}}}
}());
</script>

