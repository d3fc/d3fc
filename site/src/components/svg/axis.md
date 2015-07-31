---
layout: component
title: Axis
component: svg/axis.js
tags:
namespace: svg

fixture-code: |
  var width = $(elementId).width();

  var linearScale = d3.scale.linear()
    .domain([0, 140])
    .range([0, width])
    .nice();

  var ordinalScale = d3.scale.ordinal()
    .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cuccumber'])
    .rangePoints([0, width], 1);

example-code-one: |
  var axis = fc.svg.axis()
    .scale(ordinalScale)
    .decorate(function(s) {
      s.enter().select('text')
        .style('text-anchor', 'start')
        .attr('transform', 'rotate(45 -10 10)');
    });

  d3.select('#example-one')
    .call(axis);

example-code-two: |
  var axis = fc.svg.axis()
    .scale(ordinalScale)
    .decorate(function(s) {
      s.enter().select('text')
        .attr('transform', function(d, i) {
          return 'translate(0, ' + (i % 2 === 0 ? 25 : 10) + ')';
        });
    });

  d3.select('#example-two')
    .call(axis);

example-code-three: |
  var axis = fc.svg.axis()
    .scale(linearScale)
    .decorate(function(s) {
      s.enter()
        .attr('fill', function(d) {
          return d >= 100 ? 'red' : 'black';
        });
    });

  d3.select('#example-three')
    .call(axis);

---

<style type="text/css">
  .tick text {
    font-size: 13px;
  } 
</style>

The d3fc axis is a drop-in replacement for the `d3.svg.axis` component, which implements the d3fc decorate pattern. As a result it is much easier to customise the construction of the axis.

For example, the decorate pattern can be used to rotate the tick labels:

```js
{{{example-code-one}}}
```

<svg class="axis-container" id="example-one"></svg>
<script type="text/javascript">
(function() {
  var elementId = '#example-one';
  {{{fixture-code}}}
  {{{example-code-one}}}
}());
</script>

Or alternatively the tick index can be used to offset alternating labels:

```js
{{{example-code-two}}}
```

<svg class="axis-container" id="example-two"></svg>
<script type="text/javascript">
(function() {
  var elementId = '#example-two';
  {{{fixture-code}}}
  {{{example-code-two}}}
}());
</script>

In the example below, the value bound to each tick is used to colour values greater than or equal to 100:

```js
{{{example-code-three}}}
```

<svg class="axis-container" id="example-three"></svg>
<script type="text/javascript">
(function() {
  var elementId = '#example-three';
  {{{fixture-code}}}
  {{{example-code-three}}}
}());
</script>