---
layout: section
section: introduction
title: Transitions
externals:
  transitions-js: transitions.js
  transitions-css: transitions.css
  transitions-html: transitions.html
---

D3 has built-in support for transitions allowing you to animate changes to the DOM or SVG. When combined with a data-join this feature allows you to easily animate a visualization based on changes to the underlying data.

The transition API is very easy to use, you simply change a selection into a transition as follows:

```
d3.select("body")
  .transition()
  .style("color", "red");
```

For a detailed introduction to transitions, take a look at the [API documentation](https://github.com/d3/d3-transition).

All of the d3fc components have been implemented in order to work with transitions. What this means is that they will perform logical animations on enter, update or exit (for example bars animate upwards from the baseline on enter). In order for a series component to transition correctly you need to supply a key-function, via the `key` property, this is equivalent to the key function that you supply when performing a data-join via [selection.data](https://github.com/d3/d3-selection/blob/master/README.md#selection_data). The key-function is used to determine the 'identity' of each datapoint, if the array of data that is used to render a series is re-ordered, the key-function allows the series to perform a suitable transition.

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

<style type="text/css">
{{{transitions-css}}}
</style>

{{{ dynamic-include 'codepen' html="transitions-html" js="transitions-js" css="transitions-css"}}}

{{{transitions-html}}}
<script type="text/javascript">
{{{transitions-js}}}
</script>

And here is the full sourcecode for this example (which is mostly the bubble-sort and associated boiler-plate code):

```js
{{{ codeblock transitions-js }}}
```
