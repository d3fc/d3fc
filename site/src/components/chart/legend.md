---
layout: component
title: Legend
component: chart/legend.js
namespace: chart

example-fixture: |

  <div id="legend"></div>

example-code: |
  function renderLegendComponent() {
  
      var datum = {
          close: 50.00,
          open: 50.00,
          high: 50.00,
          low: 50.00
      };
  
      var priceFormat = d3.format('.3f');
      var legend = fc.chart.legend()
          .items([
              ['open', function (d) {
                  return priceFormat(d.open);
              }],
              ['high', function (d) {
                  return priceFormat(d.high);
              }],
              ['low', function (d) {
                  return priceFormat(d.low);
              }],
              ['close', function (d) {
                  return priceFormat(d.close);
              }]
          ])
          .rowDecorate(function (sel) {
              sel.select('td')
                  .style('color', function (d, i) {
                      return (d.datum.close - Math.floor(d.datum.close)) 
                      > 0.5 ? 'green' : 'red';
                  });
          })
          .tableDecorate(function (sel) {
              sel.enter()
                  .insert('tr', ':first-child')
                  .append('th')
                  .attr('colspan', 2)
                  .text('Dynamic Legend');
          });
  
      function renderLegend() {
          function updateField(datum, fieldName) {
              datum[fieldName] = datum[fieldName] + Math.random() * 4 - 2;
          }
  
          updateField(datum, 'open');
          updateField(datum, 'close');
          updateField(datum, 'high');
          updateField(datum, 'low');
  
          d3.select('#legend')
              .data([datum])
              .call(legend);
      }
  
      renderLegend();
      setInterval(function () {
          renderLegend();
      }, 1000);
  }
  
  renderLegendComponent();
---

Legend component is used for creating a simple legend for any chart. The `legend` content is provided by supplying 
`items` array with relevant static or dynamic data. The component can be styled by invoking `tabeDecorate`. This is
also the place to set up the legend header. 

Below is an example with a dynamically generated data and a standalone
`legend` component usage. For using legend dynamically with a chart, please see this [example](../../examples/yahoo-finance-chart/).


{{{example-fixture}}}


The code for the supplied example follows:

```js
{{{example-code}}}
```



<script type="text/javascript">
(function() {
  {{{example-code}}}
}());
</script>

