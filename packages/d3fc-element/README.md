# d3fc-elements

Custom HTML elements that make it easier to create responsive visualisations that integrate easily with other UI frameworks (e.g. React, Angular).

[Main d3fc package](https://github.com/ScottLogic/d3fc)

## Installation

```bash
npm install d3fc-elements
```

## API Reference

* [&lt;d3fc-svg&gt;](#d3fc-svg)
* [&lt;d3fc-canvas&gt;](#d3fc-canvas)

### &lt;d3fc-svg&gt;
### &lt;d3fc-canvas&gt;

These elements provide an `svg` or `canvas` rendering surface for D3 visualisations. Use CSS to position and size the element, its width and height will be automatically propagated through to the nested element. Assign functions to the [onmeasure](#surface_onmeasure) and [ondraw](#surface_ondraw) properties containing the logic required for sizing and rendering the visualisation.

The logic is split into the two phases to allow the sizing logic to be performed across all surfaces involved in a visualisation before any of these values are used in the render. By using two phases, there is no requirement for a dependency graph to be maintained. Additionally it prevents interlacing of DOM reads (measure) from DOM writes (draw) which can cause layout thrashing.

```html
<d3fc-svg id="x-axis" style="width: 10vw; height: 6vw"></d3fc-svg>
```

```js
const xScale = d3.scaleLinear()
  .domain([0, 10]);

const xAxis = d3.axisBottom(xScale);

const element = document.getElementById('x-axis');

element.onmeasure = ({width}) => {
  xScale.range([0, width]);
};

element.ondraw = ({node}) => {
  d3.select(node)
    .call(xAxis);
};
```

<a name="surface_onmeasure" href="#surface_onmeasure">#</a> *surface*.**onmeasure** = *fn*

Executes *fn* every time the surface is measured. It is invoked with an object containing the following properties -

* `width` - the width of the surface in pixels
* `height` - the height of the surface in pixels

<a name="surface_onmeasure" href="#surface_onmeasure">#</a> *surface*.**ondraw** = *fn*

Executes *fn* everytime the surface is drawn. It is invoked with an object containing the following properties -

* `data` - the data bound to the element
* `node` - the nested `svg` or `canvas` element

<a name="surface_onmeasure" href="#surface_onmeasure">#</a> *surface*.**requestRedraw**(*[options]*)

Enqueues a redraw to occur on the next animation frame, only if there isn't already one pending. If one is already pending, this call is ignored.

Where options is an object with the following properties -

* `measure` - when `true` the surface will be measured (and the associated event triggered) prior to drawing. A measure will occur even if a non-measure redraw was already queued.
