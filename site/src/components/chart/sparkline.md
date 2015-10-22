---
layout: component
title: Sparkline
component: chart/sparkline.js
tags:
  - frontpage
namespace: chart

example-fixture: |
  <p style="padding: 10px">The FTSE 100 rose 53.96 points, or 0.8%, to 6,574.94 <span class='sparkline'></span>.
  Elsewhere in Europe, Germany's Dax index was up 1.1% <span class='sparkline'></span>, while in France, the Cac 40 index climbed 1% <span class='sparkline'></span>.
  On the currency markets, the euro fell 0.3% against the dollar to $1.1111 <span class='sparkline'></span>. The pound rose 0.2% against the euro to €1.4138 <span class='sparkline'></span> and was flat against the dollar at $1.5711 <span class='sparkline'></span>.</p>

example-code: |
  d3.selectAll('.sparkline')
      .each(function() {
          var sparkline = d3.select(this);

          // typically at this point you would fetch or look-up the
          // data for the specific sparkline - here we use dummy data instead

          // var stock = sparkline.attr('data-ticker');
          var data = fc.data.random.financial()(50);

          var chart = fc.chart.sparkline()
              .xDomain(fc.util.extent()(data, 'date'))
              .yDomain(fc.util.extent()(data, 'low'))
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

