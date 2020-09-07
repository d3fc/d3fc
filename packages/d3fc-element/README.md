# d3fc-element

Custom HTML elements that make it easier to create responsive D3 visualisations using CSS that integrate easily with other UI frameworks (e.g. React, Angular).

[Main D3FC package](https://github.com/d3fc/d3fc)

## Installation

```bash
npm install @d3fc/d3fc-element
```

### Polyfills

This package requires the Custom Elements (v1 i.e. `customElements.define` & no extending built-ins) and CustomEvent support. If you are targeting a browser which does not support these APIs, the following polyfills can be used -

* [CustomEvent](https://github.com/krambuhl/custom-event-polyfill)
* [Custom Elements](https://github.com/WebReflection/document-register-element)

## API Reference

* [&lt;d3fc-svg&gt;](#d3fc-svg)
* [&lt;d3fc-canvas&gt;](#d3fc-canvas)
* [&lt;d3fc-group&gt;](#d3fc-group)

### &lt;d3fc-svg&gt; &lt;d3fc-canvas&gt;

These elements provide a nested `svg` or `canvas` element as a rendering surface for D3 visualisations. Use CSS to size the element and its pixel dimensions will be automatically propagated through to the nested element.

Rendering is internally a three-phase process which is automatically aligned to animation frames, *measure*, *resize* (if required) and *draw*.  The *resize* and *draw* phases emit similarly named events to allow rendering code to be called.

The split is required to allow the measuring logic to be performed across all surfaces in the document before any rendering takes place. This prevents layout thrashing by preventing interleaving of DOM reads (which occur in *measure*) with DOM writes (which should occur in *draw*).

```html
<d3fc-svg id="x-axis" style="width: 10vw; height: 6vw"></d3fc-svg>
```

```js
const xScale = d3.scaleLinear()
  .domain([0, 10]);

const xAxis = d3.axisBottom(xScale);

const xAxisContainer = d3.select('#x-axis')
  .on('measure', () => {
    const { width } = d3.event.detail;
    xScale.range([0, width]);
  })
  .on('draw', (d, i, nodes) => {
    d3.select(nodes[i])
      .select('svg')
      .call(xAxis);
  });

// Now that the event handlers are added, request a redraw
xAxisContainer.node()
  .requestRedraw();

// Some time later...
setTimeout(() => {
  // ...a change requiring a redraw occurs...
  xScale.domain([0, 5]);
  // ...so we request a redraw of the element.
  xAxisContainer.node()
    .requestRedraw();
}, 1000);
```

<a name="surface_requestRedraw" href="#surface_requestRedraw">#</a> *surface*.**requestRedraw**()

Enqueues a redraw to occur on the next animation frame, only if there isn't already one pending. If one is already pending, this call is ignored.

It should be noted that `requestRedraw` is asynchronous. It does not directly invoke the draw event so any errors thrown in the event handler can not be caught.

<a name="surface_useDevicePixelRatio" href="#surface_useDevicePixelRatio">#</a> *surface*.**useDevicePixelRatio**()

Available as the property `useDevicePixelRatio` or the attribute `use-device-pixel-ratio`. Controls whether the surface dimensions are multiplied by the [`devicePixelDepth`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) if available.

<a name="canvas_setWebGlViewport" href="#canvas_setWebGlViewport">#</a> *canvas*.**setWebGlViewport**()

Note `d3fc-svg` does not support this property.

Available as the property `setWebglViewport` or the attribute `set-webgl-viewport`. Controls whether the surface dimensions are additionally set on the WebGL context [viewport](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport).

### &lt;d3fc-group&gt;

An element with no visual representation that is designed to group related rendering surfaces ([&lt;d3fc-svg&gt;](#d3fc-svg)/[&lt;d3fc-canvas&gt;](#d3fc-canvas)). Its core purpose is to multi-cast [*group*.requestRedraw](#group-requestRedraw) calls to descendant surfaces and to provide an aggregate draw event. It additionally provides helpers to allow [auto-resizing](#group-autoResize) of descendant surfaces in response to window `resize` events.

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

<a name="group_requestRedraw" href="#group_requestRedraw">#</a> *group*.**requestRedraw**()

Equivalent to invoking [*surface*.requestRedraw](#surface-requestRedraw) on all descendant group or surface elements. The order of events emitted on this and descendent groups or surfaces is guaranteed to be in document order (even if a redraw request on one of those elements occurs before or after this call).

### Events

The following custom DOM events are emitted by the elements -

* `measure` - indicates that the element has been measured. Typically the `measure` event is used to set the [range](https://github.com/d3/d3-scale#continuous_range) on scales or apply transforms.
* `draw` - indicates that the element requires drawing. Typically the `draw` event is used to render components or perform any bespoke data-joins.

The following properties are available under the `detail` property on the event (not available for [&lt;d3fc-group&gt;](#d3fc-group)) -

* `width` - the width of the surface in pixels.
* `height` - the height of the surface in pixels.
* `resized` - flag indicating whether the element has resized since the last draw.

N.B. it is safe to immediately invoke [*surface*.requestRedraw](#surface_requestRedraw) from event handlers if you wish to create an animation. The redraw will be scheduled for the subsequent animation frame.
