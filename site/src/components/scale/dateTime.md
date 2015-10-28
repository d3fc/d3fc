---
layout: component
title: Date Time Scale
component: scale/dateTime.js
namespace: scale

example-code: |
  // create the d3fc scale
  var dateScale = fc.scale.dateTime()
      .domain(fc.util.extent().fields('date')(data))
      .range([0, width]);

example2-code: |
  // create the d3fc scale
  var dateScale = fc.scale.dateTime()
      .domain(fc.util.extent().fields('date')(data))
      .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
      .range([0, width]);

fixture-code: |
  // create a D3 axis to render the scale
  var dateAxis = d3.svg.axis()
      .scale(dateScale)
      .orient('bottom');

  // create a series, to illustrate
  var point = fc.series.point()
      .xScale(dateScale)
      .yScale(yScale);

  // render both
  container.append('g')
        .datum(data)
        .call(point);

  container.append('g')
        .attr('transform', 'translate(0, 80)')
        .classed('axis', true)
        .call(dateAxis);
---

The dateTime scale component works in much the same way as the `d3.time.scale`, however, with the d3fc scale you can supply an optional discontinuity provider that allows you to add breaks, or discontinuities, within the scale:

Here's a simple example of the scale, without discontinuities:

```js
{{{example-code}}}
{{{fixture-code}}}
```

The financial data being rendered doesn't have data-points for the weekends:

<div id="scale_dateTime" class="chart" style="height: 100px"> </div>
<script type="text/javascript">
(function() {
    var f = createFixture('#scale_dateTime', null, 100, 15);
    var container = f.container, data = f.data
      yScale = f.yScale, width = f.dimensions.width;
    {{{example-code}}}
    {{{fixture-code}}}
}());
</script>

By providing a discontinuity provider that skips weekends, `fc.scale.discontinuity.skipWeekends`, the gaps in the data are now closed:

```js
{{{example2-code}}}
```

<div id="scale_dateTime2" class="chart" style="height: 100px"> </div>
<script type="text/javascript">
(function() {
    var f = createFixture('#scale_dateTime2', null, 100, 15);
    var container = f.container, data = f.data
      yScale = f.yScale, width = f.dimensions.width;
    {{{example2-code}}}
    {{{fixture-code}}}
}());
</script>

You can write your own discontinuity provider, by [implementing a simple interface of 5 methods]({{package.repository.url}}/blob/master/components/scale/discontinuity). For example, you could create a scale that only includes hours within the working day.


