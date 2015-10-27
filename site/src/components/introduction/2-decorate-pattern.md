---
layout: component
title: Decorate Pattern
namespace: introduction

axis-example-code: |
  var axis = fc.svg.axis()
    .scale(ordinalScale)
    .decorate(function(s) {
      s.enter()
        .select('text')
        .style('text-anchor', 'start')
        .attr('transform', 'rotate(45 -10 10)');
    });

bar-example-code: |
  var color = d3.scale.category10();

  var bar = fc.series.bar()
      .xScale(xScale)
      .yScale(yScale)
      .decorate(function(s) {
        s.enter()
          .select('path')
          .style('fill', function(d, i) {
            return color(i);
          });
      });

point-example-code: |
  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale)
      .decorate(function(s) {
        s.enter()
          .append('text')
          .style('text-anchor', 'middle')
          .attr('transform', 'translate(0, -10)')
          .text(function(d) { return d3.format(".2f")(d.close); });
      });
---

Most chart APIs are complex and expansive in order to provide flexibility. With d3fc we have taken a different approach ...

One of the most powerful features of D3 is the [data join](http://bost.ocks.org/mike/join/), where DOM elements are constructed via data-binding. Furthermore, the [general update pattern](http://bl.ocks.org/3808218) allows you to define exactly how these data-bound elements are modified as items are added, remove or updated.

Unfortunately the [D3 component pattern](http://bost.ocks.org/mike/chart/), where reusable units are encapsulated as functions, also encapsulates the data-join, hiding its power. For example, the [D3 axis component](https://github.com/mbostock/d3/wiki/SVG-Axes) uses a data-join internally, but as a consumer of this component you cannot add extra logic to the enter selection. The decorate pattern addresses this issue, by allowing the construction of components in such a way that their internal data join is 'exposed'.

Components that implement the decorate pattern expose a `decorate` property which is passed the data join selection used to construct the component's DOM. This allows users of the component to add extra logic to the enter, update and exit selections.

Here are a few examples of how the `decorate` property can be used in practice.

## Rotating axis labels

The d3fc axis re-implements the D3 axis to support the decorate pattern. Each axis tick is composed of a `g` element, which provides the required offset, and has two child elements, a `text` element and a `path` element which renders the tick lines.

In this example the axis labels are rotated by adding a transform to the `text` elements:

```js
{{{axis-example-code}}}
```

<style type="text/css">
  .tick text {
    font-size: 13px;
  }
</style>

<svg class="axis-container" id="axis-example"></svg>

<script type="text/javascript">
(function() {
  var width = $("#axis-example").width();

  var linearScale = d3.scale.linear()
    .domain([0, 140])
    .range([0, width])
    .nice();

  var ordinalScale = d3.scale.ordinal()
    .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber'])
    .rangePoints([0, width], 1);

  {{{axis-example-code}}}

  d3.select('#axis-example')
    .call(axis);
}());
</script>

The data join selection passed to the `decorate` function is the update selection for the `g` elements. The above code accesses the enter selection so that the DOM updates are only applied when ticks are first created. The child `text` element is selected and rotated accordingly.

## Bar colouring

The d3fc series APIs are deliberately very simple, instead you are encouraged to use the decorate pattern in order to configure the series for your needs.

The example below shows how a bar series can be styled to cycle through a color palette:

```js
{{{bar-example-code}}}
```

<style type="text/css">
  .bar path {
    stroke-width: 0;
  }
</style>

<div id="bar-example" class="chart" style="height: 200px"> </div>

<script type="text/javascript">
(function() {
  var f = createFixture('#bar-example', null, 200, 10, function() { return true; });
  var container = f.container, data = f.data,
    xScale = f.xScale, yScale = f.yScale;

  {{{bar-example-code}}}

  container.append('g')
      .datum(data)
      .call(bar);
}());
</script>

Again, the enter selection is used and the required child element, in this case a `path` is selected. D3 selections allow you to specify values as functions of the bound data and index, here the index is used to cycle through a color scale.

## Adding data labels

Using the decorate pattern you can also add new elements to a component via its data join. The d3fc series are designed so that the containing `g` element is translated to the location of each datum, as a result any elements that you add need only have a relative transform applied.

In the example below datapoint labels are added via decorate:

```js
{{{point-example-code}}}
```

<div id="label-example" class="chart" style="height: 200px"> </div>

<script type="text/javascript">
(function() {
  var f = createFixture('#label-example', null, 200, 10, function() { return true; });
  var container = f.container, data = f.data,
    xScale = f.xScale, yScale = f.yScale;

  {{{point-example-code}}}

  container.append('g')
      .datum(data)
      .call(point);
}());
</script>
