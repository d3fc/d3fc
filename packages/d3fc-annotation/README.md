# d3fc-annotation

A collection of components for rendering plot area annotations (bands, crosshairs, gridlines and lines) onto Cartesian charts using SVG and canvas (coming soon! [#2](https://github.com/d3fc/d3fc-annotation/issues/2)) .

<table>
<tr>
<td><a href="#gridline"><img src="screenshots/gridline.png"/></a></td>
<td><a href="#crosshair"><img src="screenshots/crosshair.png"/></a></td>
</tr>
<tr>
<td><a href="#band"><img src="screenshots/band.png"/></a></td>
<td><a href="#line"><img src="screenshots/line.png"/></a></td>
</tr>
</table>

[Main d3fc package](https://github.com/ScottLogic/d3fc)

# Installation

```bash
npm install d3fc-annotation
```

# API

## Gridline Annotation

The gridline component renders horizontal and vertical gridlines.

<a name="gridline" href="#gridline">#</a> *fc*.**annotationSvgGridline**()

Constructs a new gridline annotation component. Once constructed, configure the component with scales and call it on a selection -

```js
const xScale = d3.scaleLinear()
  .range([0, 100]);

const yScale = d3.scaleLinear()
  .range([0, 100]);

const gridline = fc.annotationSvgGridline()
  .xScale(xScale)
  .yScale(yScale);

d3.select('svg')
  .call(gridline);
```

<a name="gridline_xScale" href="#gridline_xScale">#</a> *gridline*.**xScale**(*[scale]*)

If *scale* is specified, sets the scale used for the vertical gridline positions (combined with [xTicks](#gridline_xTicks)). Additionally, its [range](https://github.com/d3/d3-scale#continuous_range) is taken as the bounds of the horizontal gridlines. If *scale* is not specified, returns the current xScale.

<a name="gridline_yScale" href="#gridline_yScale">#</a> *gridline*.**yScale**(*[scale]*)

If *scale* is specified, sets the scale used for the horizontal gridline positions (combined with [yTicks](#gridline_yTicks)). Additionally, its [range](https://github.com/d3/d3-scale#continuous_range) is taken as the bounds of the vertical gridlines. If *scale* is not specified, returns the current yScale.

<a name="gridline_xTicks" href="#gridline_xTicks">#</a> *gridline*.**xTicks**(*[count]*)

<a name="gridline_xTicks" href="#gridline_xTicks">#</a> *gridline*.**xTicks**(*[interval]*)

If *count* is specified, sets the count passed to [ticks](https://github.com/d3/d3-scale#continuous_ticks) when requesting the horizontal gridline positions when [xScale](#gridline_xScale) is a continuous scale. For other scales, this value is ignored and the [domain](https://github.com/d3/d3-scale#ordinal_domain) is used directly. If *count* is not specified, returns the current count.

When [xScale](#gridline_xScale) is a [time scale](https://github.com/d3/d3-scale#scaleTime) this method can be passed a [time interval](https://github.com/d3/d3-time) to specify the position of the gridlines. For example to generate gridlines every fifteen minutes:

```
gridline.xTicks(d3.timeMinute.every(15));
```

<a name="gridline_xTickValues" href="#gridline_xTickValues">#</a> *gridline*.**xTickValues**(*[values]*)

Manually specify the vertical gridline positions. Overrides [xTicks](#gridline_xTicks).

<a name="gridline_yTicks" href="#gridline_yTicks">#</a> *gridline*.**yTicks**(*[count]*)

<a name="gridline_yTicks" href="#gridline_yTicks">#</a> *gridline*.**yTicks**(*[interval]*)

If *count* is specified, sets the count passed to [ticks](https://github.com/d3/d3-scale#continuous_ticks) when requesting the vertical gridline positions when [yScale](#gridline_yScale) is a continuous scale. For other scales, this value is ignored and the [domain](https://github.com/d3/d3-scale#ordinal_domain) is used directly. If *count* is not specified, returns the current count.

When [yScale](#gridline_yScale) is a [time scale](https://github.com/d3/d3-scale#scaleTime) this method can be passed a [time interval](https://github.com/d3/d3-time) to specify the position of the gridlines. For example to generate gridlines every fifteen minutes:

```
gridline.yTicks(d3.timeMinute.every(15));
```

<a name="gridline_yTickValues" href="#gridline_yTickValues">#</a> *gridline*.**yTickValues**(*[args]*)

Manually specify the vertical gridline positions. Overrides [yTicks](#gridline_yTicks).

<a name="gridline_xKey" href="#gridline_xKey">#</a> *gridline*.**xKey**(*[keyFunc]*)

If *keyFunc* is specified, sets the key function used when joining the vertical gridlines to SVG elements. If not specified, returns the current key function.

<a name="gridline_yKey" href="#gridline_yKey">#</a> *gridline*.**yKey**(*[keyFunc]*)

If *keyFunc* is specified, sets the key function used when joining the horizontal gridlines to SVG elements. If not specified, returns the current key function.

<a name="gridline_xDecorate" href="#gridline_xDecorate">#</a> *gridline*.**xDecorate**(*[decorateFunc]*)

If *decorateFunc* is specified, sets the decorate function used when joining the vertical gridlines to SVG elements. If not specified, returns the current decorate function.

<a name="gridline_yDecorate" href="#gridline_yDecorate">#</a> *gridline*.**yDecorate**(*[decorateFunc]*)

If *decorateFunc* is specified, sets the decorate function used when joining the horizontal gridlines to SVG elements. If not specified, returns the current decorate function.

## Band Annotation

The band component renders horizontal and vertical bands.

<a name="band" href="#band">#</a> *fc*.**annotationSvgBand**()

Constructs a new band annotation component. Once constructed, configure the component with scales, associate a selection with some data representing the band locations and call it on the selection -

```js
const xScale = d3.scaleLinear()
  .range([0, 100]);

const yScale = d3.scaleLinear()
  .range([0, 100]);

const band = fc.annotationSvgBand()
  .xScale(xScale)
  .yScale(yScale);

d3.select('svg')
  .datum([{ from: 45, to: 55 }])
  .call(band);
```

<a name="band_xScale" href="#band_xScale">#</a> *band*.**xScale**(*[scale]*)

If *scale* is specified, sets the scale used for transforming the [fromValue](#band_fromValue)/[toValue](#band_toValue) positions of vertical bands. Additionally, its [range](https://github.com/d3/d3-scale#continuous_range) is taken as the bounds of the horizontal bands. If *scale* is not specified, returns the current xScale.

<a name="band_yScale" href="#band_yScale">#</a> *band*.**yScale**(*[scale]*)

If *scale* is specified, sets the scale used for transforming the [fromValue](#band_fromValue)/[toValue](#band_toValue) positions of horizontal bands. Additionally, its [range](https://github.com/d3/d3-scale#continuous_range) is taken as the bounds of the vertical bands. If *scale* is not specified, returns the current yScale.

<a name="band_orient" href="#band_orient">#</a> *band*.**orient**(*[orientation]*)

If *orientation* is specified, sets the orientation of the bars to either `horizontal` or `vertical`. If *orientation* is not specified, returns the current orientation.

<a name="band_fromValue" href="#band_fromValue">#</a> *band*.**fromValue**(*[accessorFunc]*)

If *accessorFunc* is specified, sets the function used to retrieve the start value for bands. This value will be passed through the appropriate scale. If not specified, returns the current start value.

<a name="band_toValue" href="#band_toValue">#</a> *band*.**toValue**(*[accessorFunc]*)

If *accessorFunc* is specified, sets the function used to retrieve the end value for bands. This value will be passed through the appropriate scale. If not specified, returns the current end value.

<a name="band_decorate" href="#band_decorate">#</a> *band*.**decorate**(*[decorateFunc]*)

If *decorateFunc* is specified, sets the decorate function used when joining the bands to SVG elements. If not specified, returns the current decorate function.

## Line Annotation

The line component renders horizontal and vertical lines.

<a name="line" href="#line">#</a> *fc*.**annotationSvgLine**()

Constructs a new line annotation component. Once constructed, configure the component with scales, associate a selection with some data representing the line locations and call it on the selection -

```js
const xScale = d3.scaleLinear()
  .range([0, 100]);

const yScale = d3.scaleLinear()
  .range([0, 100]);

const line = fc.annotationSvgLine()
  .xScale(xScale)
  .yScale(yScale);

d3.select('svg')
  .datum([50])
  .call(line);
```

<a name="line_xScale" href="#line_xScale">#</a> *line*.**xScale**(*[scale]*)

If *scale* is specified, sets the scale used for transforming the [value](#line_value) of the line. Additionally, its [range](https://github.com/d3/d3-scale#continuous_range) is taken as the bounds of the horizontal lines. If *scale* is not specified, returns the current xScale.

<a name="line_yScale" href="#line_yScale">#</a> *line*.**yScale**(*[scale]*)

If *scale* is specified, sets the scale used for transforming the [value](#line_value) of the line. Additionally, its [range](https://github.com/d3/d3-scale#continuous_range) is taken as the bounds of the vertical lines. If *scale* is not specified, returns the current yScale.

<a name="line_orient" href="#line_orient">#</a> *line*.**orient**(*[orientation]*)

If *orientation* is specified, sets the orientation of the lines to either `horizontal` or `vertical`. If *orientation* is not specified, returns the current orientation.

<a name="line_value" href="#line_value">#</a> *line*.**value**(*[accessorFunc]*)

If *accessorFunc* is specified, sets the function used to retrieve the value for lines. This value will be passed through the appropriate scale. If not specified, returns the current value.

<a name="line_label" href="#line_label">#</a> *line*.**label**(*[accessorFunc]*)

If *accessorFunc* is specified, sets the function used to retrieve the label for lines. If not specified, returns the current label.

<a name="line_decorate" href="#line_decorate">#</a> *line*.**decorate**(*[decorateFunc]*)

If *decorateFunc* is specified, sets the decorate function used when joining the lines to SVG elements. If not specified, returns the current decorate function.

## Crosshair Annotation

The crosshair component renders a pair of vertical and horizontal lines with a point at their center.

<a name="crosshair" href="#crosshair">#</a> *fc*.**annotationSvgCrosshair**()

Constructs a new crosshair annotation component. Once constructed, configure the component with scales, associate a selection with some data representing the crosshair locations and call it on the selection -

```js
const xScale = d3.scaleLinear()
  .range([0, 100]);

const yScale = d3.scaleLinear()
  .range([0, 100]);

const crosshair = fc.annotationSvgCrosshair()
  .xScale(xScale)
  .yScale(yScale);

d3.select('svg')
  .datum([{x: 50, y: 50}])
  .call(crosshair);
```

<a name="crosshair_xScale" href="#crosshair_xScale">#</a> *crosshair*.**xScale**(*[scale]*)

If *scale* is specified, sets the scale whose [range](https://github.com/d3/d3-scale#continuous_range) is taken as the bounds of the horizontal lines. If *scale* is not specified, returns the current xScale.

<a name="crosshair_yScale" href="#crosshair_yScale">#</a> *crosshair*.**yScale**(*[scale]*)

If *scale* is specified, sets the scale whose [range](https://github.com/d3/d3-scale#continuous_range) is taken as the bounds of the vertical lines. If *scale* is not specified, returns the current yScale.

<a name="crosshair_x" href="#crosshair_x">#</a> *crosshair*.**x**(*[accessorFunc]*)

If *accessorFunc* is specified, sets the function used to retrieve the x position of the crosshair. N.B. this value will **not** be passed through the appropriate scale. If not specified, returns the current value.

<a name="crosshair_y" href="#crosshair_y">#</a> *crosshair*.**y**(*[accessorFunc]*)

If *accessorFunc* is specified, sets the function used to retrieve the y position of the crosshair. N.B. this value will **not** be passed through the appropriate scale. If not specified, returns the current value.

<a name="crosshair_xLabel" href="#crosshair_xLabel">#</a> *crosshair*.**xLabel**(*[accessorFunc]*)

If *accessorFunc* is specified, sets the function used to retrieve the label for vertical lines. If not specified, returns the current label.

<a name="crosshair_yLabel" href="#crosshair_yLabel">#</a> *crosshair*.**yLabel**(*[accessorFunc]*)

If *accessorFunc* is specified, sets the function used to retrieve the label for horizontal lines. If not specified, returns the current label.

<a name="crosshair_decorate" href="#crosshair_decorate">#</a> *crosshair*.**decorate**(*[decorateFunc]*)

If *decorateFunc* is specified, sets the decorate function used when joining the crosshairs to SVG elements. If not specified, returns the current decorate function.
