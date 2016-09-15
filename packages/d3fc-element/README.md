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
* [&lt;d3fc-group&gt;](#d3fc-canvas)

### &lt;d3fc-svg&gt;
### &lt;d3fc-canvas&gt;

These elements provide a nested `svg` or `canvas` element as a rendering surface for D3 visualisations. Use CSS to size the element and its pixel dimensions will be automatically propagated through to the nested element.

Rendering is a two-phase process, *measure* and *draw*.  Assign functions to the [onmeasure](#surface_onmeasure) and [ondraw](#surface_ondraw) properties which contain the logic required for sizing and rendering the visualisation.

The split into two phases is required to allow the sizing logic to be performed across all surfaces involved in a visualisation (see [d3fc-group](#d3fc-group)) before any of these values are used in the render without maintaining a dependency graph. Additionally it prevents interlacing of DOM reads (should occur in *measure*) from DOM writes (should occur in *draw*) which can cause layout thrashing.

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

element.requestRedraw({ measure: true });

setTimeout(() => {
  xScale.domain([0, 5]);
  // Only data has changed so don't measure
  element.requestRedraw();
}, 1000);
```

<a name="surface_onmeasure" href="#surface_onmeasure">#</a> *surface*.**onmeasure** = *fn*

Executes *fn* every time the surface is measured. It is invoked with an object containing the following properties -

* `width` - the width of the surface in pixels.
* `height` - the height of the surface in pixels.

Typically this event is used to set the [range](https://github.com/d3/d3-scale#continuous_range) on scales or apply transforms. Any DOM measurements should also be performed at this point. Bound data should generally not be considered during this event to permit *draw*-only (no-*measure*) data updates.

<a name="surface_onmeasure" href="#surface_onmeasure">#</a> *surface*.**ondraw** = *fn*

Executes *fn* every time the surface is drawn. It is invoked with an object containing the following properties -

* `data` - the data bound to the element.
* `node` - the nested `svg` or `canvas` element.

Typically this event is used to render components or perform any bespoke data-joins. Anything requiring data should be performed at this stage. N.B. it is safe to immediately invoke [*surface*.requestRedraw](#surface_requestRedraw) if you wish to create an animation.

<a name="surface_requestRedraw" href="#surface_requestRedraw">#</a> *surface*.**requestRedraw**(*[options]*)

Enqueues a redraw to occur on the next animation frame, only if there isn't already one pending. If one is already pending, this call is ignored.

Where options is an object with the following properties -

* `measure` - when `true` the surface will be measured (and the associated event triggered) prior to drawing. A measure will occur even if a non-measure redraw was already queued.

### &lt;d3fc-group&gt;

An element with no visual representation that is designed to group related rendering surfaces ([&lt;d3fc-svg&gt;](#d3fc-svg)/[&lt;d3fc-canvas&gt;](#d3fc-canvas)). Its core purpose is to multi-cast [*group*.requestRedraw](#group-requestRedraw) calls and data associations to descendant surfaces. It additionally provides helpers to allow [auto-resizing](#group-autoResize) of surfaces in response to window `resize` events.

```html
<d3fc-group id="chart" auto-resize style="display: flex; height: 40vw; width: 60vw; flex-direction: column">
  <h1 style="text-align: center">
    A Cartesian Chart
  </h1>
  <div style="flex: 1; display: flex; flex-direction: row">
    <d3fc-svg id="plot-area" style="flex: 1"></d3fc-svg>
    <d3fc-svg id="y-axis" style="width: 5em"></d3fc-svg>
  </div>
  <div style="height: 3em; display: flex; flex-direction: row">
    <d3fc-svg id="x-axis" style="flex: 1; margin-right: 5em"></d3fc-svg>
  </div>
</d3fc-group>
```

<a name="group-autoResize" href="#group-autoResize">#</a> *group*.**autoResize** = *autoResize*

Available as the property `autoResize` or the attribute `auto-resize`. If `true`, listens to `window` `resize` events and automatically invokes [*group*.requestRedraw](#group-requestRedraw).

<a name="group_onmeasure" href="#group_onmeasure">#</a> *group*.**requestRedraw**(*[options]*)

Invokes [*surface*.requestRedraw](#surface-requestRedraw) on all descendant surface elements. Where options is an object with the following properties -

* `measure` - See [*surface*.requestRedraw](#surface_requestRedraw).
