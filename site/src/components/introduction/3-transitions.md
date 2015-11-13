---
layout: component
title: Transitions
namespace: introduction
example-code: |
  // generate some random data
  data = d3.range(40).map(Math.random);

  // render a bar series via the cartesian chart component
  var barSeries = fc.series.bar()
      .key(fc.util.fn.identity)
      .xValue(fc.util.fn.index)
      .yValue(fc.util.fn.identity);

  var chart = fc.chart.cartesian(
                d3.scale.linear(),
                d3.scale.linear())
      .xDomain([-1, data.length])
      .margin({top: 10, bottom: 10, right: 30})
      .plotArea(barSeries);

  var index = 0;
  function render() {
    if (index === data.length) {
      return; // we're all done!
    }

    // perform a single iteration of the bubble sort
    var temp;
    for (var j = index; j > 0; j--) {
        if (data[j] < data[j - 1]) {
            temp = data[j];
            data[j] = data[j - 1];
            data[j - 1] = temp;
        }
    }
    index++;

    // re-render the chart
    d3.select('#transitions-chart')
        .datum(data)
        .transition()
        .duration(500)
        .call(chart);
  }

  setInterval(render, 1000);
  render();

---

D3 has built-in support for transitions allowing you to animate changes to the DOM or SVG. When combined with a data-join this feature allows you to easily animate a visualisation based on changes to the underlying data.

The transition API is very easy to use, you simply change a selection into a transition as follows:

```
d3.select("body")
  .transition()
  .style("color", "red");
```

For a detailed introduction to transitions, take a look at the [API documentation](https://github.com/mbostock/d3/wiki/Transitions) or [Working with Transitions](http://bost.ocks.org/mike/transition/).

All of the d3fc components have been implemented in order to work with transitions. What this means is that they will perform logical animations on enter, update or exit (for example bars animate upwards from the baseline on enter). In order for a series component to transition correctly you need to supply a key-function, via the `key` property, this is equivalent to the key function that you supply when performing a data-join via [selection.data](https://github.com/mbostock/d3/wiki/Selections#data). The key-function is used to determine the 'identity' of each datapoint, if the array of data that is used to render a series is re-ordered, the key-function allows the series to perform a suitable transition.

The following example shows transitions in action, where the code indicated below converts the selection into a transition before 'calling' the chart component:

```
d3.select('#transitions-chart')
    .datum(data)
    .transition()  // convert the selection into a transition
    .duration(500) // set the duration (you can also set the easing function)
    .call(chart);
```

The above code can be repeatedly executed, with the chart (and associated series) transitioning as the data changes.

Here is the complete example which animates a simple bubble sort algorithm (if the example has finished, just refresh your browser!):

<style>
.x-axis {
  display: none
}
</style>

<div id="transitions-chart" class="chart"> </div>

<script type="text/javascript">
{{{example-code}}}
</script>

And here is the full sourcecode for this example (which is mostly the bubble-sort and associated boiler-plate code):

```js
{{{example-code}}}
```
