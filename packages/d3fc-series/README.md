# d3fc-series

A collection of components for rendering data series to SVG, canvas and WebGL, including line, bar, OHLC, candlestick and more.

<table>
<tr>
  <td><a href="#boxplot"><img src="screenshots/boxplot.png"/></a></td>
  <td><a href="#candlestick"><img src="screenshots/candlestick.png"/></a></td>
  <td><a href="#line"><img src="screenshots/line.png"/></a></td>
</tr>
<tr>
  <td><a href="#ohlc"><img src="screenshots/ohlc.png"/></a></td>
  <td><a href="#area"><img src="screenshots/area.png"/></a></td>
  <td><a href="#point"><img src="screenshots/point.png"/></a></td>
</tr>
<tr>
  <td><a href="#bar"><img src="screenshots/bar.png"/></a></td>
  <td><a href="#errorbar"><img src="screenshots/errorbar.png"/></a></td>
  <td><a href="#multi"><img src="screenshots/multi.png"/></a></td>
</tr>
<tr>
  <td><a href="#grouped"><img src="screenshots/grouped.png"/></a></td>
  <td><a href="#stacked"><img src="screenshots/stacked.png"/></a></td>
  <td><a href="#repeat"><img src="screenshots/repeat.png"/></a></td>
</tr>
<tr>
  <td><a href="#heatmap"><img src="screenshots/heatmap.png"/></a></td>
  <td></td>
  <td></td>
</tr>
</table>

[Main D3FC package](https://github.com/d3fc/d3fc)

## Installing

```bash
npm install @d3fc/d3fc-series
```

## API Reference

* [General API](#general-api)
 * [SVG Rendering](#svg-rendering)
 * [Canvas Rendering](#canvas-rendering)
 * [WebGL Rendering](#webgl-rendering)
 * [Decorate Pattern](#decorate-pattern)
 * [Orientation](#orientation)
 * [Multi Series](#multi-series)
 * [Decorate Pattern](#decorate-pattern)
 * [Auto Bandwidth](#auto-bandwidth)
 * [Accessors](#accessors)
* [Line](#line)
* [Point](#point)
* [Area](#area)
* [Bar](#bar)
* [Candlestick](#candlestick)
* [OHLC](#ohlc)
* [Boxplot](#boxplot)
* [Errorbar](#errorbar)
* [Heatmap](#heatmap)
* [Multi](#multi)
* [Repeat](#repeat)
* [Grouped](#grouped)
* [Stacked](#stacked)

This package contains a number of D3 components that render various standard series types. They all share a common API, with the typical configuration requiring x and y scales together with a number of value accessors. There are SVG, Canvas and WebGL versions of each series type, sharing the same configuration properties.

### General API

#### SVG rendering

In order to render a line series to SVG, the data should be supplied via a data-join or `datum`, as follows:

```javascript
const data = [
    {x: 0, y: 0},
    {x: 10, y: 5},
    {x: 20, y: 0}
];

const line = fc.seriesSvgLine()
    .crossValue(d => d.x)
    .mainValue(d => d.y)
    .xScale(xScale)
    .yScale(yScale);

d3.select('g')
    .datum(data)
    .call(line);
```

The line component is configured with the required value accessors and scales. In this case, the supplied data has `x` and `y` properties. The value accessors are invoked on each datum within the array, and simply obtain the value for their respective property. The scales are used to convert the values in the domain coordinate system (as returned by the accessors), to the screen coordinate system.

The series is rendered into a group (`g`) element by first selecting it, using `datum` to associate the data with this DOM node, then using `call` to invoke the series component, causing it to be rendered.


#### Canvas rendering

The `seriesCanvasLine` component has an API that is almost identical to its SVG counterpart, `seriesSvgLine`, the only difference is the addition of a `context` property, which is set to the context of the canvas that this series renders to.

```javascript
const data = [
    {x: 0, y: 0},
    {x: 10, y: 5},
    {x: 20, y: 0}
];

var ctx = canvas.getContext('2d');

const line = fc.seriesCanvasLine()
    .crossValue(d => d.x)
    .mainValue(d => d.y)
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx);

line(data);
```

Because D3 data-joins and data-binding only work on HTML / SVG, the canvas components are invoked directly with the supplied data. This causes the component to render itself to the canvas.


#### WebGL rendering

***WebGL rendering does not yet have full feature parity with the other rendering methods. Please check the API documentation against the methods to see what is currently supported.***

The `seriesWebglLine` component has an API that is almost identical to its canvas counterpart, `seriesCanvasLine`. The only difference is the `context` property, which requires a `contextType` of `'webgl'`. 

```javascript
const data = [
    {x: 0, y: 0},
    {x: 10, y: 5},
    {x: 20, y: 0}
];

var ctx = canvas.getContext('webgl');

const line = fc.seriesWebglLine()
    .crossValue(d => d.x)
    .mainValue(d => d.y)
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx);

line(data);
```

As with the canvas, the components are invoked directly with the supplied data.


#### Decorate Pattern

The series components implement the decorate pattern by exposing a `decorate` property which is passed the data join selection, or canvas context, used to render the component. This allows users of the component to perform additional rendering logic.

For further details, consult the [Decorate Pattern documentation](https://d3fc.io/introduction/decorate-pattern.html).

The following example demonstrates how the fill color of each bar can be varied via decoration. The decorate property is passed the data join selection used to construct the component's DOM. Here, the enter selection is used to set the fill color based on the index:

```javascript
const color = d3.scaleOrdinal(d3.schemeCategory10);

const svgBar = fc.seriesSvgBar()
    .decorate((selection) => {
        selection.enter()
            .style('fill', (_, i) => color(i));
    });
```

<img src="screenshots/decorate.png"/>

Here is the same example for a canvas bar series; the way that the decorate pattern works is subtly different. For SVG components the decorate function is invoked once with the selection that renders all of the bars (or points, candlesticks, ...), with canvas, the decorate function is invoked for each of the data-points in the series.

The decorate function is passed the context, datum and index. The context is translated to the correct position and the fill color set before invoking the decorate function. After decoration the bar itself is rendered.

```javascript
const canvasLine = fc.seriesCanvasBar()
    .decorate((context, datum, index) => {
        context.fillStyle = color(index);
    });
```

<img src="screenshots/decorate-canvas.png"/>

Decoration can also be used to add extra elements to the series. In this example a text element is added to each bar via the enter selection.

The origin of each data-point container, which is a `g` element, is always set to the data-point location. As a result, the text element is translated vertically by `-10`, in order to position them just above each bar.

```javascript
const svgBar = fc.seriesSvgBar()
    .decorate((selection) => {
        selection.enter()
            .append('text')
            .style('text-anchor', 'middle')
            .attr('transform', 'translate(0, -10)')
            .attr('fill', 'black')
            .text((d) => d3.format('.2f')(d));
    });
```

<img src="screenshots/decorate-append.png"/>

With canvas, you can also perform additional rendering to the canvas in order to achieve the same effect. Once again, the canvas origin has been translated to the origin of each data-point before the decorate function is invoked.

This example uses a point series, for a bit of variety!

```javascript
const canvasLine = fc.seriesCanvasPoint()
    .decorate((context, datum, index) => {
        context.textAlign = 'center';
        context.fillStyle = '#000';
        context.font = '15px Arial';
        context.fillText(d3.format('.2f')(datum), 0, -10);
        // reset the fill style for the bar rendering
        context.fillStyle = '#999';
    });
```

<img src="screenshots/decorate-append-canvas.png"/>

The `decorate` property intentionally exposes the inner workings of components. With WebGL, the inner workings of the implementations (i.e. `d3fc-webgl`) have not been finalised. Therefore, expect that as the API matures, your decorate functions will also have to change.

#### Orientation

Most of the series renderers support both horizontal and vertical render orientations as specified by the `orient` property. In order to make it easy to change the orientation of a series, and to avoid redundant and repeated property names, a change in orientation is achieved by transposing the x and y scales.

The following example shows a simple bar series rendered in its default vertical orientation:

```javascript
const data = [4, 6, 8, 6, 0, 10];

const xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([height, 0]);

const barSeries = fc.seriesSvgBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue((_, i) => i)
    .mainValue((d) => d);

d3.select('g')
    .datum(data)
    .call(svgBar);
```

By setting its `orient` property to `horizontal`, the x and y scales are transposed. As a result, the domain for both the x and y scale have to be switched. The following shows the changes required:

```javascript
const xScale = d3.scaleLinear()
    .domain([0, 10])           // domain changed
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, data.length])  // domain changed
    .range([height, 0]);

const barSeries = fc.seriesSvgBar()
    .xScale(xScale)
    .yScale(yScale)
    .orient('horizontal')      // orient property updated
    .crossValue((_, i) => i)
    .mainValue((d) => d);
```

This is part of the motivation behind naming the accessors `mainValue` and `crossValue`, rather than an orientation specific `xValue` / `yValue`.

#### Multi series

One series type that is worthy of note is the multi series. This component provides a convenient way to render multiple series, that share scales, to the same SVG or canvas.

The multi series renderers expose a `series` property which accepts an array of series renderers, together with the standard  `xScale` and `yScale` properties. The following example shows how a multi series can be used to render both a line and bar series:

```javascript
// a couple of series - value accessor configuration omitted for clarity
const barSeries = fc.seriesSvgBar();
const lineSeries = fc.seriesSvgLine();

const multiSeries = fc.seriesSvgMulti()
    .xScale(xScale)
    .yScale(yScale)
    .series([barSeries, lineSeries]);

d3.select('g')
    .datum(data)
    .call(svgMulti);
```

Notice that you do not have to set the `xScale` and `yScale` properties on each series - the scales are propagated down from the multi series.

The canvas API is very similar:

```javascript
// a couple of series - value accessor configuration omitted for clarity
const barSeries = fc.seriesCanvasBar();
const lineSeries = fc.seriesCanvasLine();

const multiSeries = fc.seriesCanvasMulti()
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx)
    .series([barSeries, lineSeries]);

multiSeries(data)
```

In this case the context is also propagated from the multi series to the children.

The multi series allows you to combine a range of different series types. If instead you have multiple data series that you want to render using the same series type, e.g. a chart containing multiple lines, the [repeat series](#repeat) is an easier way to achieve this.

#### Auto bandwidth

A number of the series (bar, OHLC, boxplot) have a notion of 'width'. They all expose a `bandwidth` property where you can supply the width as a value (in the screen coordinate system).

Rather than specify a bandwidth directly, you can adapt a series with the `fc.autoBandwidth` component, which will either obtain the bandwidth directly from the scale, or compute it based on the distribution of data.

When used with a `bandScale`, the scale is responsible for computing the width of each band. The `fc.autoBandwidth` component invokes the `bandwidth` function on the scale and uses the returned value to set the `bandwidth` on the series.

```javascript
var xScale = d3.scaleBand()
    .domain(data.map(d => d.x))
    .rangeRound([0, width]);

var svgBar = fc.autoBandwidth(fc.seriesSvgBar())
    .align('left')
    .crossValue(function(d) { return d.x; })
    .mainValue(function(d) { return d.y; });
```

Notice in the above example that the `align` property of the bar is set to `left`, which reflects the band scale coordinate system.

**NOTE:** The D3 point scale is a special cased band scale that has a zero bandwidth. As a result, if you use the `fc.autoBandwidth` component in conjunction with a point scale, the series will also have a bandwidth of zero!

When used in conjunction with a linear scale, the `fc.autoBandwidth` component computes the bar width based on the smallest distance between consecutive datapoints:

```javascript
var xScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width]);

var svgBar = fc.autoBandwidth(fc.seriesSvgBar())
    .crossValue(function(d) { return d.x; })
    .mainValue(function(d) { return d.y; })
    .widthFraction(0.5);
```

The `fc.autoBandwidth` component, when adapting a series, adds a `widthFraction` property which determines the fraction of this distance that is used to set the bandwidth.

When using a multi, or repeat series, the `fc.autoBandwidth` component should be used to adapt the bar (or OHLC, boxplot, ...) series directly, rather than adapting the multi or repeat series.

```javascript
var canvasBar = fc.seriesCanvasBar()

var canvasLine = fc.seriesCanvasLine();

var canvasMulti = fc.seriesCanvasMulti()
    .xScale(xScale)
    .yScale(yScale)
    .series([fc.autoBandwidth(canvasBar), canvasLine]);
```

#### Accessors

All of the series expose `xValues`/`yValues` methods which return an array of all of the accessors used by the series when retrieving values for use with the `xScale`/`yScale` respectively. 

### Line

![](screenshots/line.png)

<a name="seriesSvgLine" href="#seriesSvgLine">#</a> fc.**seriesSvgLine**()  
<a name="seriesCanvasLine" href="#seriesCanvasLine">#</a> fc.**seriesCanvasLine**()  
<a name="seriesWebglLine" href="#seriesWebglLine">#</a> fc.**seriesWebglLine**()

Constructs a new line renderer for canvas, WebGL or SVG.

#### Common properties

<a name="seriesLine_crossValue" href="#seriesLine_crossValue">#</a> *seriesLine*.**crossValue**(*accessorFunc*)  
<a name="seriesLine_mainValue" href="#seriesLine_mainValue">#</a> *seriesLine*.**mainValue**(*accessorFunc*)

If *accessorFunc* is specified, sets the accessor to the specified function and returns this series. If *accessorFunc* is not specified, returns the current accessor. The `accessorFunc(datum, index)` function is called on each item of the data, returning the relevant value for the given accessor. The respective scale is applied to the value returned by the accessor before rendering.

<a name="seriesLine_xScale" href="#seriesLine_xScale">#</a> *seriesLine*.**xScale**(*scale*)  
<a name="seriesLine_yScale" href="#seriesLine_yScale">#</a> *seriesLine*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

<a name="seriesLine_orient" href="#seriesLine_orient">#</a> *seriesLine*.**orient**(*orientation*)  

If *orientation* is specified, sets the orientation and returns this series. If *orientation* is not specified, returns the current orientation. The orientation value should be either `horizontal` (default) or `vertical`.

<a name="seriesLine_curve" href="#seriesLine_curve">#</a> *seriesLine*.**curve**(*scale*)

The WebGL implementation does not support this property.

If *curve* is specified, sets the curve factory and returns this series. If *curve* is not specified, returns the current curve factory.

This property is rebound from [line.curve](https://github.com/d3/d3-shape#line_curve).

<a name="seriesLine_context" href="#seriesLine_context">#</a> *seriesLine*.**context**(*ctx*)

The SVG implementation does not support this property.

If *ctx* is specified, sets the canvas context and returns this series. If *ctx* is not specified, returns the current context.

<a name="seriesLine_lineWidth" href="#seriesLine_lineWidth">#</a> *seriesLine*.**lineWidth**(*width*)

The SVG and canvas implementations do not support this property.

If *width* is specified, sets the line width and returns this series. If *width* is not specified, returns the current line width.

### Point

![](screenshots/point.png)

<a name="seriesSvgPoint" href="#seriesSvgPoint">#</a> fc.**seriesSvgPoint**()  
<a name="seriesCanvasPoint" href="#seriesCanvasPoint">#</a> fc.**seriesCanvasPoint**()  
<a name="seriesWebglPoint" href="#seriesWebglPoint">#</a> fc.**seriesWebglPoint**()

Constructs a new point series renderer for canvas, WebGL or SVG.

#### Common properties

<a name="seriesPoint_crossValue" href="#seriesPoint_crossValue">#</a> *seriesPoint*.**crossValue**(*accessorFunc*)  
<a name="seriesPoint_mainValue" href="#seriesPoint_mainValue">#</a> *seriesPoint*.**mainValue**(*accessorFunc*)

If *accessorFunc* is specified, sets the accessor to the specified function and returns this series. If *accessorFunc* is not specified, returns the current accessor. The `accessorFunc(datum, index)` function is called on each item of the data, returning the relevant value for the given accessor. The respective scale is applied to the value returned by the accessor before rendering.

<a name="seriesPoint_xScale" href="#seriesPoint_xScale">#</a> *seriesPoint*.**xScale**(*scale*)  
<a name="seriesPoint_yScale" href="#seriesPoint_yScale">#</a> *seriesPoint*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

<a name="seriesPoint_orient" href="#seriesPoint_orient">#</a> *seriesPoint*.**orient**(*orientation*)  

If *orientation* is specified, sets the orientation and returns this series. If *orientation* is not specified, returns the current orientation. The orientation value should be either `horizontal` (default) or `vertical`.

<a name="seriesPoint_type" href="#seriesPoint_type">#</a> *seriesPoint*.**type**(*type*)

The WebGL implementation does not support the following shapes: diamond, star, wye.

If *type* is specified, sets the symbol type to the specified function or symbol type and returns this point series renderer. If *type* is not specified, returns the current symbol type accessor.

This property is rebound from [symbol.type](https://github.com/d3/d3-shape#symbol_type).

<a name="seriesPoint_size" href="#seriesPoint_size">#</a> *seriesPoint*.**size**(*size*)

If *size* is specified, sets the area to the specified function or number and returns this point series renderer. If *size* is not specified, returns the current size accessor.

This property is rebound from [symbol.size](https://github.com/d3/d3-shape#symbol_size).

<a name="seriesPoint_context" href="#seriesPoint_context">#</a> *seriesPoint*.**context**(*ctx*)

The SVG implementation does not support this property.

If *ctx* is specified, sets the canvas context and returns this series. If *ctx* is not specified, returns the current context.

### Area

![](screenshots/area.png)

<a name="seriesSvgArea" href="#seriesSvgArea">#</a> fc.**seriesSvgArea**()  
<a name="seriesCanvasArea" href="#seriesCanvasArea">#</a> fc.**seriesCanvasArea**()  
<a name="seriesWebglArea" href="#seriesWebglArea">#</a> fc.**seriesWebglArea**()

Constructs a new area series renderer for canvas, WebGL or SVG.

#### Common properties

<a name="seriesArea_crossValue" href="#seriesArea_crossValue">#</a> *seriesArea*.**crossValue**(*accessorFunc*)  
<a name="seriesArea_mainValue" href="#seriesArea_mainValue">#</a> *seriesArea*.**mainValue**(*accessorFunc*)
<a name="seriesArea_baseValue" href="#seriesArea_baseValue">#</a> *seriesArea*.**baseValue**(*accessorFunc*)  

If *accessorFunc* is specified, sets the accessor to the specified function and returns this series. If *accessorFunc* is not specified, returns the current accessor. The `accessorFunc(datum, index)` function is called on each item of the data, returning the relevant value for the given accessor. The respective scale is applied to the value returned by the accessor before rendering.

<a name="seriesArea_orient" href="#seriesArea_orient">#</a> *seriesArea*.**orient**(*orientation*)

The WebGL implementation does not support this property.

If *orientation* is specified, sets the orientation and returns this series. If *orientation* is not specified, returns the current orientation. The orientation value should be either `horizontal` (default) or `vertical`.

<a name="seriesArea_xScale" href="#seriesArea_xScale">#</a> *seriesArea*.**xScale**(*scale*)  
<a name="seriesArea_yScale" href="#seriesArea_yScale">#</a> *seriesArea*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

<a name="seriesArea_curve" href="#seriesArea_curve">#</a> *seriesArea*.**curve**(*scale*)

The WebGL implementation does not support this property.

If *curve* is specified, sets the curve factory and returns this series. If *curve* is not specified, returns the current curve factory.

<a name="seriesArea_context" href="#seriesArea_context">#</a> *seriesArea*.**context**(*ctx*)

The SVG implementation does not support this property.

If *ctx* is specified, sets the canvas context and returns this series. If *ctx* is not specified, returns the current context.

### Bar

![](screenshots/bar.png)

<a name="seriesSvgBar" href="#seriesSvgBar">#</a> fc.**seriesSvgBar**()  
<a name="seriesCanvasBar" href="#seriesCanvasBar">#</a> fc.**seriesCanvasBar**()  
<a name="seriesWebglBar" href="#seriesWebglBar">#</a> fc.**seriesWebglBar**()

Constructs a new bar series renderer for canvas, WebGL or SVG.

#### Common properties

<a name="seriesBar_crossValue" href="#seriesBar_crossValue">#</a> *seriesBar*.**crossValue**(*accessorFunc*)  
<a name="seriesBar_mainValue" href="#seriesBar_mainValue">#</a> *seriesBar*.**mainValue**(*accessorFunc*)  
<a name="seriesBar_baseValue" href="#seriesBar_baseValue">#</a> *seriesBar*.**baseValue**(*accessorFunc*)  

If *accessorFunc* is specified, sets the accessor to the specified function and returns this series. If *accessorFunc* is not specified, returns the current accessor. The `accessorFunc(datum, index)` function is called on each item of the data, returning the relevant value for the given accessor. The respective scale is applied to the value returned by the accessor before rendering.

<a name="seriesBar_orient" href="#seriesBar_orient">#</a> *seriesBar*.**orient**(*orientation*)

The WebGL implementation does not support this property.

If *orientation* is specified, sets the orientation and returns this series. If *orientation* is not specified, returns the current orientation. The orientation value should be either `horizontal` (default) or `vertical`.

<a name="seriesBar_xScale" href="#seriesBar_xScale">#</a> *seriesBar*.**xScale**(*scale*)  
<a name="seriesBar_yScale" href="#seriesBar_yScale">#</a> *seriesBar*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

<a name="seriesBar_bandwidth" href="#seriesBar_bandwidth">#</a> *seriesBar*.**bandwidth**(*bandwidthFunc*)

If *bandwidthFunc* is specified, sets the bandwidth function and returns this series. If *bandwidthFunc* is not specified, returns the current bandwidth function.

<a name="seriesBar_context" href="#seriesBar_context">#</a> *seriesBar*.**context**(*ctx*)

The SVG implementation does not support this property.

If *ctx* is specified, sets the canvas context and returns this series. If *ctx* is not specified, returns the current context.


### Candlestick

![](screenshots/candlestick.png)

<a name="seriesSvgCandlestick" href="#seriesSvgCandlestick">#</a> fc.**seriesSvgCandlestick**()  
<a name="seriesCanvasCandlestick" href="#seriesCanvasCandlestick">#</a> fc.**seriesCanvasCandlestick**()  
<a name="seriesWebglCandlestick" href="#seriesWebglCandlestick">#</a> fc.**seriesWebglCandlestick**()

Constructs a new candlestick renderer for canvas, WebGL or SVG.

<a name="seriesCandlestick_crossValue" href="#seriesCandlestick_crossValue">#</a> *seriesCandlestick*.**crossValue**(*accessorFunc*)  
<a name="seriesCandlestick_highValue" href="#seriesCandlestick_highValue">#</a> *seriesCandlestick*.**highValue**(*accessorFunc*)  
<a name="seriesCandlestick_lowValue" href="#seriesCandlestick_lowValue">#</a> *seriesCandlestick*.**lowValue**(*accessorFunc*)  
<a name="seriesCandlestick_openValue" href="#seriesCandlestick_openValue">#</a> *seriesCandlestick*.**openValue**(*accessorFunc*)  
<a name="seriesCandlestick_closeValue" href="#seriesCandlestick_closeValue">#</a> *seriesCandlestick*.**closeValue**(*accessorFunc*)

If *accessorFunc* is specified, sets the accessor to the specified function and returns this series. If *accessorFunc* is not specified, returns the current accessor. The `accessorFunc(datum, index)` function is called on each item of the data, returning the relevant value for the given accessor. The respective scale is applied to the value returned by the accessor before rendering.

<a name="seriesCandlestick_xScale" href="#seriesCandlestick_xScale">#</a> *seriesCandlestick*.**xScale**(*scale*)  
<a name="seriesCandlestick_yScale" href="#seriesCandlestick_yScale">#</a> *seriesCandlestick*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

<a name="seriesCandlestick_bandwidth" href="#seriesCandlestick_bandwidth">#</a> *seriesCandlestick*.**bandwidth**(*bandwidthFunc*)

If *bandwidthFunc* is specified, sets the bandwidth function and returns this series. If *bandwidthFunc* is not specified, returns the current bandwidth function.

<a name="seriesCandlestick_decorate" href="#seriesCandlestick_decorate">#</a> *seriesCandlestick*.**decorate**(*decorateFunc*)

If *decorateFunc* is specified, sets the decorator function to the specified function, and returns this series. If *decorateFunc* is not specified, returns the current decorator function.

<a name="seriesCandlestick_context" href="#seriesCandlestick_context">#</a> *seriesCandlestick*.**context**(*ctx*)

The SVG implementation does not support this property.

If *ctx* is specified, sets the canvas context and returns this series. If *ctx* is not specified, returns the current context.

<a name="seriesCandlestick_lineWidth" href="#seriesCandlestick_lineWidth">#</a> *seriesCandlestick*.**lineWidth**(*width*)

The SVG and canvas implementations do not support this property.

If *width* is specified, sets the line width and returns this series. If *width* is not specified, returns the current line width.

### OHLC

![](screenshots/ohlc.png)

<a name="seriesSvgOhlc" href="#seriesSvgOhlc">#</a> fc.**seriesSvgOhlc**()  
<a name="seriesCanvasOhlc" href="#seriesCanvasOhlc">#</a> fc.**seriesCanvasOhlc**()  
<a name="seriesWebglOhlc" href="#seriesWebglOhlc">#</a> fc.**seriesWebglOhlc**()

Constructs a new OHLC renderer for canvas, WebGL or SVG.

### Common properties

<a name="seriesOhlc_crossValue" href="#seriesOhlc_crossValue">#</a> *seriesOhlc*.**crossValue**(*accessorFunc*)  
<a name="seriesOhlc_highValue" href="#seriesOhlc_highValue">#</a> *seriesOhlc*.**highValue**(*accessorFunc*)  
<a name="seriesOhlc_lowValue" href="#seriesOhlc_lowValue">#</a> *seriesOhlc*.**lowValue**(*accessorFunc*)  
<a name="seriesOhlc_openValue" href="#seriesOhlc_openValue">#</a> *seriesOhlc*.**openValue**(*accessorFunc*)  
<a name="seriesOhlc_closeValue" href="#seriesOhlc_closeValue">#</a> *seriesOhlc*.**closeValue**(*accessorFunc*)

If *accessorFunc* is specified, sets the accessor to the specified function and returns this series. If *accessorFunc* is not specified, returns the current accessor. The `accessorFunc(datum, index)` function is called on each item of the data, returning the relevant value for the given accessor. The respective scale is applied to the value returned by the accessor before rendering.

<a name="seriesOhlc_xScale" href="#seriesOhlc_xScale">#</a> *seriesOhlc*.**xScale**(*scale*)  
<a name="seriesOhlc_yScale" href="#seriesOhlc_yScale">#</a> *seriesOhlc*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

<a name="seriesCandlestick_bandwidth" href="#seriesCandlestick_bandwidth">#</a> *seriesCandlestick*.**bandwidth**(*bandwidthFunc*)

If *bandwidthFunc* is specified, sets the bandwidth function and returns this series. If *bandwidthFunc* is not specified, returns the current bandwidth function.

<a name="seriesOhlc_decorate" href="#seriesOhlc_decorate">#</a> *seriesOhlc*.**decorate**(*decorateFunc*)

If *decorateFunc* is specified, sets the decorator function to the specified function, and returns this series. If *decorateFunc* is not specified, returns the current decorator function.

<a name="seriesOhlc_context" href="#seriesOhlc_context">#</a> *seriesOhlc*.**context**(*ctx*)

The SVG implementation does not support this property.

If *ctx* is specified, sets the canvas context and returns this series. If *ctx* is not specified, returns the current context.

<a name="seriesOhlc_lineWidth" href="#seriesOhlc_lineWidth">#</a> *seriesOhlc*.**lineWidth**(*width*)

The SVG and canvas implementations do not support this property.

If *width* is specified, sets the line width and returns this series. If *width* is not specified, returns the current line width.

### Boxplot

![](screenshots/boxplot.png)

<a name="seriesSvgBoxPlot" href="#seriesSvgBoxPlot">#</a> fc.**seriesSvgBoxPlot**()  
<a name="seriesCanvasBoxPlot" href="#seriesCanvasBoxPlot">#</a> fc.**seriesCanvasBoxPlot**()  
<a name="seriesWebglBoxPlot" href="#seriesWebglBoxPlot">#</a> fc.**seriesWebglBoxPlot**()

Constructs a new boxplot renderer for canvas, WebGL or SVG.

#### Common properties

<a name="seriesBoxPlot_crossValue" href="#seriesBoxPlot_crossValue">#</a> *seriesBoxPlot*.**crossValue**(*accessorFunc*)  
<a name="seriesBoxPlot_medianValue" href="#seriesBoxPlot_medianValue">#</a> *seriesBoxPlot*.**medianValue**(*accessorFunc*)  
<a name="seriesBoxPlot_upperQuartileValue" href="#seriesBoxPlot_upperQuartileValue">#</a> *seriesBoxPlot*.**upperQuartileValue**(*accessorFunc*)  
<a name="seriesBoxPlot_lowerQuartileValue" href="#seriesBoxPlot_lowerQuartileValue">#</a> *seriesBoxPlot*.**lowerQuartileValue**(*accessorFunc*)  
<a name="seriesBoxPlot_highValue" href="#seriesBoxPlot_highValue">#</a> *seriesBoxPlot*.**highValue**(*accessorFunc*)  
<a name="seriesBoxPlot_lowValue" href="#seriesBoxPlot_lowValue">#</a> *seriesBoxPlot*.**lowValue**(*accessorFunc*)    

If *accessorFunc* is specified, sets the accessor to the specified function and returns this series. If *accessorFunc* is not specified, returns the current accessor. The `accessorFunc(datum, index)` function is called on each item of the data, returning the relevant value for the given accessor. The respective scale is applied to the value returned by the accessor before rendering.

<a name="seriesBoxPlot_orient" href="#seriesBoxPlot_orient">#</a> *seriesBoxPlot*.**orient**(*orientation*)  

The WebGL implementation does not support this property.

If *orientation* is specified, sets the orientation and returns this series. If *orientation* is not specified, returns the current orientation. The orientation value should be either `horizontal` (default) or `vertical`

<a name="seriesBoxPlot_xScale" href="#seriesBoxPlot_xScale">#</a> *seriesBoxPlot*.**xScale**(*scale*)  
<a name="seriesBoxPlot_yScale" href="#seriesBoxPlot_yScale">#</a> *seriesBoxPlot*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

<a name="seriesBoxPlot_bandwidth" href="#seriesBoxPlot_bandwidth">#</a> *seriesBoxPlot*.**bandwidth**(*bandwidthFunc*)

If *bandwidthFunc* is specified, sets the bandwidth function and returns this series. If *bandwidthFunc* is not specified, returns the current bandwidth function.

<a name="seriesBoxPlot_cap" href="#seriesBoxPlot_cap">#</a> *seriesBoxPlot*.**cap**(*capFunc*)

If *capFunc* is specified, sets the cap function and returns this series. If *capFunc* is not specified, returns the current cap function. The `capFunc(item, index)` function is called on each item of the data, and returns the **proportion** of the box width that the caps width should be.

<a name="seriesBoxPlot_decorate" href="#seriesBoxPlot_decorate">#</a> *seriesBoxPlot*.**decorate**(*decorateFunc*)

If *decorateFunc* is specified, sets the decorator function to the specified function, and returns this series. If *decorateFunc* is not specified, returns the current decorator function.

<a name="seriesBoxplot_context" href="#seriesBoxplot_context">#</a> *seriesBoxplot*.**context**(*ctx*)

The SVG implementation does not support this property.

If *ctx* is specified, sets the canvas context and returns this series. If *ctx* is not specified, returns the current context.

<a name="seriesBoxplot_lineWidth" href="#seriesBoxplot_lineWidth">#</a> *seriesBoxplot*.**lineWidth**(*width*)

The SVG and canvas implementations do not support this property.

If *width* is specified, sets the line width and returns this series. If *width* is not specified, returns the current line width.

### Errorbar

![](screenshots/errorbar.png)

<a name="seriesSvgErrorBar" href="#seriesSvgErrorBar">#</a> fc.**seriesSvgErrorBar**()  
<a name="seriesCanvasErrorBar" href="#seriesCanvasErrorBar">#</a> fc.**seriesCanvasErrorBar**()  
<a name="seriesWebglErrorBar" href="#seriesWebglErrorBar">#</a> fc.**seriesWebglErrorBar**()

Constructs a new error bar renderer for canvas, WebGL or SVG.

#### Common properties

<a name="seriesErrorBar_crossValue" href="#seriesErrorBar_crossValue">#</a> *seriesErrorBar*.**crossValue**(*accessorFunc*)  
<a name="seriesErrorBar_highValue" href="#seriesErrorBar_highValue">#</a> *seriesErrorBar*.**highValue**(*accessorFunc*)  
<a name="seriesErrorBar_lowValue" href="#seriesErrorBar_lowValue">#</a> *seriesErrorBar*.**lowValue**(*accessorFunc*)   

If *accessorFunc* is specified, sets the accessor to the specified function and returns this series. If *accessorFunc* is not specified, returns the current accessor. The `accessorFunc(datum, index)` function is called on each item of the data, returning the relevant value for the given accessor. The respective scale is applied to the value returned by the accessor before rendering.

<a name="seriesErrorBar_orient" href="#seriesErrorBar_orient">#</a> *seriesErrorBar*.**orient**(*orientation*)  

The SVG implementation does not support this property.

If *orientation* is specified, sets the orientation and returns this series. If *orientation* is not specified, returns the current orientation. The orientation value should be either `horizontal` (default) or `vertical`

<a name="seriesErrorBar_xScale" href="#seriesErrorBar_xScale">#</a> *seriesErrorBar*.**xScale**(*scale*)  
<a name="seriesErrorBar_yScale" href="#seriesErrorBar_yScale">#</a> *seriesErrorBar*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

<a name="seriesErrorBar_bandwidth" href="#seriesErrorBar_bandwidth">#</a> *seriesErrorBar*.**bandwidth**(*bandwidthFunc*)

If *bandwidthFunc* is specified, sets the bandwidth function and returns this series. If *bandwidthFunc* is not specified, returns the current bandwidth function.

<a name="seriesErrorBar_decorate" href="#seriesErrorBar_decorate">#</a> *seriesErrorBar*.**decorate**(*decorateFunc*)

If *decorateFunc* is specified, sets the decorator function to the specified function, and returns this series. If *decorateFunc* is not specified, returns the current decorator function.

<a name="seriesErrorBar_context" href="#seriesErrorBar_context">#</a> *seriesErrorBar*.**context**(*ctx*)

The SVG implementation does not support this property.

If *ctx* is specified, sets the canvas context and returns this series. If *ctx* is not specified, returns the current context.

<a name="seriesErrorBar_lineWidth" href="#seriesErrorBar_lineWidth">#</a> *seriesErrorBar*.**lineWidth**(*width*)

The SVG and canvas implementations do not support this property.

If *width* is specified, sets the line width and returns this series. If *width* is not specified, returns the current line width.

### Heatmap

![](screenshots/heatmap.png)

<a name="seriesSvgHeatmap" href="#seriesSvgHeatmap">#</a> fc.**seriesSvgHeatmap**()  
<a name="seriesCanvasHeatmap" href="#seriesCanvasHeatmap">#</a> fc.**seriesCanvasHeatmap**()

Constructs a new heatmap series renderer for either canvas or SVG.

#### Common properties

<a name="seriesHeatmap_crossValue" href="#seriesHeatmap_crossValue">#</a> *seriesHeatmap*.**crossValue**(*accessorFunc*)  
<a name="seriesHeatmap_highValue" href="#seriesHeatmap_highValue">#</a> *seriesHeatmap*.**highValue**(*accessorFunc*)  
<a name="seriesHeatmap_colorValue" href="#seriesHeatmap_colorValue">#</a> *seriesHeatmap*.**colorValue**(*accessorFunc*)  

If *accessorFunc* is specified, sets the accessor to the specified function and returns this series. If *accessorFunc* is not specified, returns the current accessor. The `accessorFunc(datum, index)` function is called on each item of the data, returning the relevant value for the given accessor. The respective scale is applied to the value returned by the accessor before rendering.

<a name="seriesHeatmap_xScale" href="#seriesHeatmap_xScale">#</a> *seriesHeatmap*.**xScale**(*scale*)  
<a name="seriesHeatmap_yScale" href="#seriesHeatmap_yScale">#</a> *seriesHeatmap*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

<a name="seriesHeatmap_colorInterpolate" href="#seriesHeatmap_colorInterpolate">#</a> *seriesHeatmap*.**colorInterpolate**(*interpolate*)

If *colorInterpolate* is specified, sets the interpolator used to map color values to colors and returns this series. If *colorInterpolate* is not specified, returns the current interpolator.

<a name="seriesHeatmap_xBandwidth" href="#seriesHeatmap_xBandwidth">#</a> *seriesHeatmap*.**xBandwidth**(*bandwidthFunc*)
<a name="seriesHeatmap_yBandwidth" href="#seriesHeatmap_yBandwidth">#</a> *seriesHeatmap*.**yBandwidth**(*bandwidthFunc*)

If *bandwidthFunc* is specified, sets the bandwidth function and returns this series. If *bandwidthFunc* is not specified, returns the current bandwidth function.

<a name="seriesHeatmap_decorate" href="#seriesHeatmap_decorate">#</a> *seriesHeatmap*.**decorate**(*decorateFunc*)

If *decorateFunc* is specified, sets the decorator function to the specified function, and returns this series. If *decorateFunc* is not specified, returns the current decorator function.

<a name="seriesErrorBar_context" href="#seriesErrorBar_context">#</a> *seriesErrorBar*.**context**(*ctx*)

The SVG implementation does not support this property.

If *ctx* is specified, sets the canvas context and returns this series. If *ctx* is not specified, returns the current context.

### Multi

![](screenshots/multi.png)

<a name="seriesSvgMulti" href="#seriesSvgMulti">#</a> fc.**seriesSvgMulti**()  
<a name="seriesCanvasMulti" href="#seriesCanvasMulti">#</a> fc.**seriesCanvasMulti**()  
<a name="seriesWebglMulti" href="#seriesWebglMulti">#</a> fc.**seriesWebglMulti**()

Constructs a new multi series renderer for canvas, WebGL or SVG.

#### Common properties

<a name="seriesMulti_series" href="#seriesMulti_series">#</a> *seriesMulti*.**series**(*seriesArray*)  

If *seriesArray* is specified, sets the array of series that this multi series should render and returns this series. If *seriesArray* is not specified, returns the current array of series.

<a name="seriesMulti_xScale" href="#seriesMulti_xScale">#</a> *seriesMulti*.**xScale**(*scale*)  
<a name="seriesMulti_yScale" href="#seriesMulti_yScale">#</a> *seriesMulti*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

<a name="seriesMulti_mapping" href="#seriesMulti_mapping">#</a> *seriesMulti*.**mapping**(*mappingFunc*)

If *mappingFunc* is specified, sets the mapping function to the specified function, and returns this series. If *mappingFunc* is not specified, returns the current mapping function.

When rendering the multi-series, the mapping function is invoked once for each of the series supplied via the *series* property. The purpose of the mapping function is to return the data supplied to each of these series. The default mapping is the identity function, `(d) => d`, which results in each series being supplied with the same data as the multi-series component.

The mapping function is invoked with the data bound to the multi-series, (*data*), the index of the current series (*index*) and the array of series (*series*). A common pattern for the mapping function is to switch on the series type. For example, a multi-series could be used to render a line series together with an upper bound, indicated by a line annotation. In this case, the following would be a suitable mapping function:

```javascript
const multi = fc.seriesSvgMulti()
    .series([line, annotation)
    .mapping((data, index, series) => {
      switch(series[index]) {
        case line:
          return data.line;
        case annotation:
          return data.upperBound;
      }
    });
```

<a name="seriesMulti_decorate" href="#seriesMulti_decorate">#</a> *seriesMulti*.**decorate**(*decorateFunc*)

If *decorateFunc* is specified, sets the decorator function to the specified function, and returns this series. If *decorateFunc* is not specified, returns the current decorator function.

With the SVG multi series, the decorate function is invoked once, with the data join selection that creates the outer container. With the canvas multi series the decorate function is invoked for each of the associated series.

<a name="seriesMulti_context" href="#seriesMulti_context">#</a> *seriesMulti*.**context**(*ctx*)

The SVG implementation does not support this property.

If *ctx* is specified, sets the canvas context and returns this series. If *ctx* is not specified, returns the current context.

### Repeat

![](screenshots/repeat.png)

<a name="seriesSvgRepeat" href="#seriesSvgRepeat">#</a> fc.**seriesSvgRepeat**()  
<a name="seriesCanvasRepeat" href="#seriesCanvasRepeat">#</a> fc.**seriesCanvasRepeat**()  
<a name="seriesWebglRepeat" href="#seriesWebglRepeat">#</a> fc.**seriesWebglRepeat**()

Constructs a new repeat series renderer for canvas, WebGL or SVG.

The repeat series is very similar in function to the multi series, both are designed to render multiple series from the same bound data. The repeat series uses the same series type for each data series, e.g. multiple lines series, or multiple area series.

The repeat series expects the data to be presented as an array of arrays. The following example demonstrates how it can be used to render multiple line series:

```javascript
const data = [
  [1, 3, 4],
  [4, 5, 6]
];

const line = fc.seriesSvgLine();

const repeatSeries = fc.seriesSvgRepeat()
    .xScale(xScale)
    .yScale(yScale)
    .series(line);

d3.select('g')
    .datum(data)
    .call(repeatSeries);
```

The repeat series also exposes an *orient* property which determines the 'orientation' of the series within the bound data. In the above example, setting orient to *horizontal* would result in the data being rendered as two series of three points (rather than three series of two points).

#### Common properties

<a name="seriesRepeat_series" href="#seriesRepeat_series">#</a> *seriesRepeat*.**series**(*series*)  

If *series* is specified, sets the series that this repeat series should render and returns this series. If *series* is not specified, returns the current series.

<a name="seriesRepeat_orient" href="#seriesRepeat_orient">#</a> *seriesRepeat*.**orient**(*orientation*)  

If *orientation* is specified, sets the orientation and returns this series. If *orientation* is not specified, returns the current orientation. The orientation value should be either `vertical` (default) or `horizontal`.

<a name="seriesRepeat_xScale" href="#seriesRepeat_xScale">#</a> *seriesRepeat*.**xScale**(*scale*)  
<a name="seriesRepeat_yScale" href="#seriesRepeat_yScale">#</a> *seriesRepeat*.**yScale**(*scale*)  
<a name="seriesRepeat_decorate" href="#seriesRepeat_decorate">#</a> *seriesRepeat*.**decorate**(*decorateFunc*)  
<a name="seriesRepeat_context" href="#seriesRepeat_context">#</a> *seriesRepeat*.**context**(*ctx*)

Please refer to the multi series for the documentation of these properties.

### Grouped

![](screenshots/grouped.png)

<a name="seriesSvgGrouped" href="#seriesSvgGrouped">#</a> fc.**seriesSvgGrouped**(*adaptedSeries*)  
<a name="seriesCanvasGrouped" href="#seriesCanvasGrouped">#</a> fc.**seriesCanvasGrouped**(*adaptedSeries*)

Constructs a new grouped series by adapting the given series. This allows the rendering of grouped bars, boxplots and point series etc ...

The grouped series is responsible for applying a suitable offset, along the cross-axis, to create clustered groups of bars (or points etc ...). The grouped series rebinds all of the properties of the adapted series.

The following example shows the construction of a grouped bar series, where the scales and value accessors are configured:

```javascript
var groupedBar = fc.seriesSvgGrouped(fc.seriesSvgBar())
    .xScale(x)
    .yScale(y)
    .crossValue(d => d[0])
    .mainValue(d => d[1]);
```

Rendering a grouped series requires a nested array of data, the default format expected by the grouped series expects each object in the array to have a `values` property with the nested data, however, this can be configured by the `values` accessor.

```javascript
[
  {
    "key": "Under 5 Years",
    "values": [
      { "x": "AL", "y": 310 },
      { "x": "AK", "y": 52 },
      { "x": "AZ", "y": 515 }
    ]
  },
  {
    "key": "5 to 13 Years",
    "values": [
      { "x": "AL", "y": 552 },
      { "x": "AK", "y": 85 },
      { "x": "AZ", "y": 828 }
    ]
  }
]
```

The `fc.group` component from the [d3fc-group](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-group#d3fc-group) package gives an easy way to construct this data from CSV / TSV.

With the data in the correct format, the series is rendered just like the other series types:

```javascript
container.append('g')
    .datum(series)
    .call(groupedBar);
```

And the grouped canvas series is rendered as follows:

```javascript
groupedCanvasBar(series);
```

#### Common properties

<a name="grouped_bandwidth" href="#grouped_bandwidth">#</a> *grouped*.**bandwidth**(*bandwidthFunc*)  

If *bandwidthFunc* is specified, sets the bandwidth function and returns this series. If *bandwidthFunc* is not specified, returns the current bandwidth function.

<a name="grouped_subPadding" href="#grouped_subPadding">#</a> *grouped*.**subPadding**(*padding*)  

If *padding* is specified, sets the sub-padding to the specified value which must be in the range [0, 1]. If *padding* is not specified, returns the current sub-padding. The sub-padding value determines the padding between the bars within each group.

### Stacked

![](screenshots/stacked.png)

There is not an explicit series type for rendering stacked charts, it is a straightforward task to render stacked series with the existing components. This section illustrates this with a few examples.

The following code demonstrates how to render a stacked bar series to an SVG. Note that the axis configuration is omitted for clarity:

```javascript
var stack = d3.stack()
    .keys(Object.keys(data[0]).filter(k => k !== 'State'));

var series = stack(data);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var barSeries = fc.seriesSvgBar()
    .xScale(x)
    .yScale(y)
    .crossValue(d => d.data.State)
    .mainValue(d => d[1])
    .baseValue(d => d[0])
    .decorate((group, data, index) => {
        group.selectAll('path')
            .attr('fill', color(index));
    })

var join = fc.dataJoin('g', 'series');

join(container, series)
    .call(barSeries);
```

The [d3 stack](https://github.com/d3/d3-shape/blob/master/README.md#stack) component is used to stack the data obtained from the D3 CSV parser. The SVG bar series value accessors are configured based on the output of the stack component. Finally a D3FC datajoin is used to render each row of data using the bar series.

With canvas, the code is very similar, with a for each loop used in place of the data join:

```javascript
var canvasBarSeries = fc.seriesCanvasBar()
    .xScale(x)
    .yScale(y)
    .crossValue(d => d.data.State)
    .mainValue(d => d[1])
    .baseValue(d => d[0])
    .context(ctx);

series.forEach(function(s, i) {
    canvasBarSeries
        .decorate(function(ctx) {
            ctx.fillStyle = color(i);
        })(s);
});
```

With WebGL, the code is also very similar:

```javascript
var webglBarSeries = fc.seriesWebglBar()
    .xScale(x)
    .yScale(y)
    .crossValue(d => d.data.State)
    .mainValue(d => d[1])
    .baseValue(d => d[0])
    .context(ctx);

series.forEach(function(s, i) {
    webglBarSeries
        .decorate(function(program) {
            fc.barFill().color(color(i))(program);
        })(s);
});
```

In all cases, the decorate pattern is used to set the color for each bar series.
