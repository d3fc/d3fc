---
layout: component
title: Legend
component: chart/legend.js
namespace: chart

example-fixture: |

  <div id="legend" style="margin:15px;"></div>

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
      setInterval(renderLegend(), 1000);
  }
  
  renderLegendComponent();
---

The `legend` component creates a simple legend panel for any chart. The content is controlled by setting the `items` property, to an array consisting of headers and data (which can be either static values or dynamic functions). The component can be styled using `tableDecorate` property (using the [decorate pattern](../introduction/2-decorate-pattern.html)). Should you want to have a table header, it can also be done using this property.

The following example show a standalone `legend` using dynamically generated data. For an example of using a legend within a chart, please see the [Yahoo finance example](../../examples/yahoo-finance-chart/).


{{{example-fixture}}}

```js
{{{example-code}}}
```



<script type="text/javascript">
(function () {
  {{{example-code}}}
}());
</script>

