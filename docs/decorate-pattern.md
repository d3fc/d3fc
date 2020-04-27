# Decorate Pattern

Most chart APIs are complex and expansive in order to provide flexibility. With D3FC we have taken a different approach ...

One of the most powerful features of D3 is the [data join](http://bost.ocks.org/mike/join/), where DOM elements are constructed via data-binding. Furthermore, the [general update pattern](http://bl.ocks.org/3808218) allows you to define exactly how these data-bound elements are modified as items are added, remove or updated.

Unfortunately the [D3 component pattern](http://bost.ocks.org/mike/chart/), where reusable units are encapsulated as functions, also encapsulates the data-join, hiding its power. For example, the [D3 axis component](https://github.com/d3/d3-axis) uses a data-join internally, but as a consumer of this component you cannot add extra logic to the enter selection. The decorate pattern addresses this issue, by allowing the construction of components in such a way that their internal data join is 'exposed'.

Components that implement the decorate pattern expose a `decorate` property which is passed the data join selection used to construct the component's DOM. This allows users of the component to add extra logic to the enter, update and exit selections.

Here are a few examples of how the `decorate` property can be used in practice.

## Rotating axis labels

The [d3fc axis](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-axis) re-implements the D3 axis to support the decorate pattern. Each axis tick is composed of a `g` element, which provides the required offset, and has two child elements, a `text` element and a `path` element which renders the tick lines.

In this example the axis labels are rotated by adding a transform to the `text` elements:

```js
const axis = fc.axisBottom()
  .scale(scaleBand)
  .decorate(sel =>
    sel.enter()
        .select('text')
        .style('text-anchor', 'start')
        .attr('transform', 'rotate(45 -10 10)')
  );
```

The data join selection passed to the `decorate` function is the update selection for the `g` elements. The above code accesses the enter selection so that the DOM updates are only applied when ticks are first created. The child `text` element is selected and rotated accordingly.

## Bar colouring

The [d3fc series](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-series) APIs are deliberately very simple, instead you are encouraged to use the decorate pattern in order to configure the series for your needs.

The example below shows how a bar series can be styled to cycle through a color palette:

```js
const color = d3.scaleOrdinal(d3.schemeCategory10);

const svgBar = fc.seriesSvgBar()
  .decorate(sel =>
    sel.enter()
      .style('fill', (_, i) => color(i))
  );
```

Again, the enter selection is used and the required child element, in this case a `path` is selected. D3 selections allow you to specify values as functions of the bound data and index, here the index is used to cycle through a color scale.

## Adding data labels

Using the decorate pattern you can also add new elements to a component via its data join. The D3FC series are designed so that the containing `g` element is translated to the location of each datum, as a result any elements that you add need only have a relative transform applied.

In the example below datapoint labels are added via decorate:

```js
const svgBar = fc.seriesSvgBar()
  .decorate(sel =>
    sel.enter()
      .append('text')
      .style('text-anchor', 'middle')
      .attr('transform', 'translate(0, -10)')
      .text(d => d3.format('.2f')(d))
      .attr('fill', 'black')
  );
```
