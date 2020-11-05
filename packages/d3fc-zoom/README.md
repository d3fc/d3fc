# d3fc-zoom

A domain-value based alternative to [`d3-zoom`](https://github.com/d3/d3-zoom). Designed to easily allow co-ordinating zoom/pan actions across multiple scales and out-of-band updates to the scale's domains. This is traded off against a slightly reduced feature-set.

[Main D3FC package](https://github.com/d3fc/d3fc)

## Installing

```bash
npm install @d3fc/d3fc-zoom
```

## API Reference

<a name="zoom" href="#zoom">#</a> fc.**zoom**()

Constructs a new zoom behaviour instance. The returned behaviour, zoom, is both an object and a function, and is typically applied to selected elements via [*selection*.call](https://github.com/d3/d3-selection#selection_call).

<a name="_zoom" href="#_zoom">#</a> *zoom*(*selection*, *xScale*, *yScale*)

Applies this zoom behaviour to the specified selection, binding the necessary event listeners to allow panning and zooming. It accepts an *xScale* and/or a *yScale* to which the pan or zoom operation will be directly applied before the `zoom` event is raised.

This function is typically not invoked directly, and is instead invoked via [*selection*.call](https://github.com/d3/d3-selection#selection_call):

```javascript
selection.call(fc.zoom().on("zoom", render), xScale, yScale)
```

A [d3.zoom](https://github.com/d3/d3-zoom#zoom) component is used internally to bind the necessary event listeners. Therefore you can unbind the behaviour as follows:

```javascript
selection.on(".zoom", null);
```

<a name="zoom_on" href="#zoom_on">#</a> *zoom*.**on**(*typenames*[, *callback*])

This component dispatches `zoom` events. There are no arguments passed to the event handler. Typically this would be used to re-render the chart.

See [d3-dispatch's `on`](https://github.com/d3/d3-dispatch#dispatch_on) for a full description.

<a name="zoom_extent" href="#zoom_extent">#</a> *zoom*.**extent**(*...*)

See d3-zoom [extent](https://github.com/d3/d3-zoom#zoom_extent).

<a name="zoom_filter" href="#zoom_filter">#</a> *zoom*.**filter**(*...*)

See d3-zoom [filter](https://github.com/d3/d3-zoom#zoom_filter).

<a name="zoom_wheelDelta" href="#zoom_wheelDelta">#</a> *zoom*.**wheelDelta**(*...*)

See d3-zoom [wheelDelta](https://github.com/d3/d3-zoom#zoom_wheelDelta).

<a name="zoom_touchable" href="#zoom_touchable">#</a> *zoom*.**touchable**(*...*)

See d3-zoom [touchable](https://github.com/d3/d3-zoom#zoom_touchable).

<a name="zoom_clickDistance" href="#zoom_clickDistance">#</a> *zoom*.**clickDistance**(*...*)

See d3-zoom [clickDistance](https://github.com/d3/d3-zoom#zoom_clickDistance).

<a name="zoom_tapDistance" href="#zoom_tapDistance">#</a> *zoom*.**tapDistance**(*...*)

See d3-zoom [tapDistance](https://github.com/d3/d3-zoom#zoom_tapDistance).

<a name="zoom_duration" href="#zoom_duration">#</a> *zoom*.**duration**(*...*)

See d3-zoom [duration](https://github.com/d3/d3-zoom#zoom_duration).

<a name="zoom_interpolate" href="#zoom_interpolate">#</a> *zoom*.**interpolate**(*...*)

See d3-zoom [interpolate](https://github.com/d3/d3-zoom#zoom_interpolate).
