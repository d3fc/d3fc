# d3fc-webgl

A collection of WebGL shaders and supporting components used by [d3fc-series](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-series#d3fc-series) to render WebGL series.

This package is still a work in progress and is not feature complete.

[Main D3FC package](https://github.com/d3fc/d3fc)

## Installing

```bash
npm install @d3fc/d3fc-webgl
```

## API Reference

* [Series](#series)
  * [Common Properties](#common-properties)
  * [Area](#area)
  * [Bar](#bar)
  * [BoxPlot](#boxplot)
  * [Candlestick](#candlestick)
  * [ErrorBar](#errorbar)
  * [Line](#line)
  * [Ohlc](#ohlc)
  * [Point](#point)
* [Attribute Buffer Builders](#attribute-buffer-builders)
  * [Element Attribute](#element-attribute)
  * [Adjacent Element Attribute](#adjacent-element-attribute)
  * [Vertex Attribute](#vertex-attribute)
  * [Base Attribute](#base-attribute)
* [Uniform](#uniform)
* [Buffer Builder](#buffer-builder)
* [Types](#types)
* [Element Indices](#element-indices)
* [Shader Naming Convention](#shader-naming-convention)

This package contains the components needed to render a standard or custom series with WebGL. The standard series share a common API with a typical configuration requiring x and y WebGL scales together with a number of attribute buffers.

### Series

The series components can be used to generate a WebGL series of the relevant chart, all chart types are supported.

#### Common Properties

A few properties are shared across all of the series.

<a name="series_xScale" href="#series_xScale">#</a> *series*.**xScale**(*scale*)
<a name="series_yScale" href="#series_yScale">#</a> *series*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

Set scales must be Webgl scales, these can be created [manually](Link to scales) or can be generated from D3 scales using the [webglScaleMapper](Link to scaleMapper).

<a name="series_decorate" href="#series_decorate">#</a> *series*.**decorate**(*decorateFunc*)

If *decorateFunc* is specified, sets decorate to the given function and returns this series. If *decorateFunc* is not specified, returns the current decorate function. The `decorateFunc(program)` function is called before draw time allowing a user of the series to change the drawing behaviour.

<a name="series_context" href="#series_context">#</a> *series*.**context**(*WebGLRenderingContext*)

If *WebGLRenderingContext* is specified, sets the rendering context and returns this series. If *WebGLRenderingContext* is not specified, returns the current rendering context.

This property is rebound from [webglProgramBuilder.context](Link to programBuilder).

#### Area

<a name="webglSeriesArea" href="webglSeriesArea">#</a> fc.**webglSeriesArea**()

Used to construct a new WebGL Area series.

<a name="webglSeriesArea_crossValueAttribute" href="#webglSeriesArea_crossValueAttribute">#</a> *webglSeriesArea*.**crossValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossValue` shader attribute.

<a name="webglSeriesArea_crossPreviousValueAttribute" href="#webglSeriesArea_crossPreviousValueAttribute">#</a> *webglSeriesArea*.**crossPreviousValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossPrevValue` shader attribute.

<a name="webglSeriesArea_mainValueAttribute" href="#webglSeriesArea_mainValueAttribute">#</a> *webglSeriesArea*.**mainValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aMainValue` shader attribute.

<a name="webglSeriesArea_mainPreviousValueAttribute" href="#webglSeriesArea_mainPreviousValueAttribute">#</a> *webglSeriesArea*.**mainPreviousValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aMainPrevValue` shader attribute.

<a name="webglSeriesArea_baseValueAttribute" href="#webglSeriesArea_baseValueAttribute">#</a> *webglSeriesArea*.**baseValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aBaseValue` shader attribute.

<a name="webglSeriesArea_basePreviousValueAttribute" href="#webglSeriesArea_basePreviousValueAttribute">#</a> *webglSeriesArea*.**basePreviousValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aBasePrevValue` shader attribute.

<a name="webglSeriesArea_definedAttribute" href="#webglSeriesArea_definedAttribute">#</a> *webglSeriesArea*.**definedAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aDefined` shader attribute.

Values calculated from the given *attributeBufferBuilder* should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

<a name="webglSeriesArea_definedNextAttribute" href="#webglSeriesArea_definedNextAttribute">#</a> *webglSeriesArea*.**definedNextAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aDefinedNext` shader attribute.

Values calculated from the given *attributeBufferBuilder* should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

#### Bar

<a name="webglSeriesBar" href="#webglSeriesBar">#</a> fc.**webglSeriesBar**()

Used to construct a new WebGL Bar series.

<a name="webglSeriesBar_crossValueAttribute" href="#webglSeriesBar_crossValueAttribute">#</a> *webglSeriesBar*.**crossValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossValue` shader attribute.

<a name="webglSeriesBar_mainValueAttribute" href="#webglSeriesBar_mainValueAttribute">#</a> *webglSeriesBar*.**mainValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aMainValue` shader attribute.

<a name="webglSeriesBar_baseValueAttribute" href="#webglSeriesBar_baseValueAttribute">#</a> *webglSeriesBar*.**baseValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aBaseValue` shader attribute.

<a name="webglSeriesBar_bandwidthAttribute" href="#webglSeriesBar_bandwidthAttribute">#</a> *webglSeriesBar*.**bandwidthAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aBandwidth` shader attribute.

<a name="webglSeriesBar_definedAttribute" href="#webglSeriesBar_definedAttribute">#</a> *webglSeriesBar*.**definedAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aDefined` shader attribute.

Values calculated from the given *attributeBufferBuilder* should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

#### BoxPlot

<a name="webglSeriesBoxPlot" href="#webglSeriesBoxPlot">#</a> fc.**webglSeriesBoxPlot**()

Used to construct a new WebGL BoxPlot series

<a name="webglSeriesBoxPlot_lineWidth" href="#webglSeriesBoxPlot_lineWidth">#</a> *webglSeriesBoxPlot*.**lineWidth**(*width*)

If *width* is specified, sets the width to the given value and returns this series. If *width* is not specified, returns the current width value.

<a name="webglSeriesBoxPlot_crossValueAttribute" href="#webglSeriesBoxPlot_crossValueAttribute">#</a> *webglSeriesBoxPlot*.**crossValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossValue` shader attribute.

<a name="webglSeriesBoxPlot_highValueAttribute" href="#webglSeriesBoxPlot_highValueAttribute">#</a> *webglSeriesBoxPlot*.**highValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aHighValue` shader attribute.

<a name="webglSeriesBoxPlot_upperQuartileValueAttribute" href="#webglSeriesBoxPlot_upperQuartileValueAttribute">#</a> *webglSeriesBoxPlot*.**upperQuartileValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aUpperQuartileValue` shader attribute.

<a name="webglSeriesBoxPlot_medianValueAttribute" href="#webglSeriesBoxPlot_medianValueAttribute">#</a> *webglSeriesBoxPlot*.**medianValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aMedianValue` shader attribute.

<a name="webglSeriesBoxPlot_lowerQuartileValueAttribute" href="#webglSeriesBoxPlot_lowerQuartileValueAttribute">#</a> *webglSeriesBoxPlot*.**lowerQuartileValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aLowerQuartileValue` shader attribute.

<a name="webglSeriesBoxPlot_lowValueAttribute" href="#webglSeriesBoxPlot_lowValueAttribute">#</a> *webglSeriesBoxPlot*.**lowValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aLowValue` shader attribute.

<a name="webglSeriesBoxPlot_bandwidthAttribute" href="#webglSeriesBoxPlot_bandwidthAttribute">#</a> *webglSeriesBoxPlot*.**bandwidthAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aBandwidth` shader attribute.

<a name="webglSeriesBoxPlot_capAttribute" href="#webglSeriesBoxPlot_capAttribute">#</a> *webglSeriesBoxPlot*.**capAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCapWidth` shader attribute.

<a name="webglSeriesBoxPlot_definedAttribute" href="#webglSeriesBoxPlot_definedAttribute">#</a> *webglSeriesBoxPlot*.**definedAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aDefined` shader attribute.

Values calculated from the given *attributeBufferBuilder* should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

#### Candlestick

<a name="webglSeriesCandlestick" href="#webglSeriesCandlestick">#</a> fc.**webglSeriesCandlestick**()

Used to construct a new WebGL Candlestick series.

<a name="webglSeriesCandlestick_lineWidth" href="#webglSeriesCandlestick_lineWidth">#</a> *webglSeriesCandlestick*.**lineWidth**(*width*)

If *width* is specified, sets the width to the given value and returns this series. If *width* is not specified, returns the current width value.

<a name="webglSeriesCandlestick_crossValueAttribute" href="#webglSeriesCandlestick_crossValueAttribute">#</a> *webglSeriesCandlestick*.**crossValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossValue` shader attribute.

<a name="webglSeriesCandlestick_openValueAttribute" href="#webglSeriesCandlestick_openValueAttribute">#</a> *webglSeriesCandlestick*.**openValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aOpenValue` shader attribute.

<a name="webglSeriesCandlestick_highValueAttribute" href="#webglSeriesCandlestick_highValueAttribute">#</a> *webglSeriesCandlestick*.**highValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aHighValue` shader attribute.

<a name="webglSeriesCandlestick_lowValueAttribute" href="#webglSeriesCandlestick_lowValueAttribute">#</a> *webglSeriesCandlestick*.**lowValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aLowValue` shader attribute.

<a name="webglSeriesCandlestick_closeValueAttribute" href="#webglSeriesCandlestick_closeValueAttribute">#</a> *webglSeriesCandlestick*.**closeValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCloseValue` shader attribute.

<a name="webglSeriesCandlestick_bandwidthAttribute" href="#webglSeriesCandlestick_bandwidthAttribute">#</a> *webglSeriesCandlestick*.**bandwidthAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aBandwidth` shader attribute.

<a name="webglSeriesCandlestick_definedAttribute" href="#webglSeriesCandlestick_definedAttribute">#</a> *webglSeriesCandlestick*.**definedAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aDefined` shader attribute.

Values calculated from the given *attributeBufferBuilder* should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

#### ErrorBar

<a name="webglSeriesErrorBar" href="#webglSeriesErrorBar">#</a> fc.**webglSeriesErrorBar**()

Used to construct a new WebGL ErrorBar series.

<a name="webglSeriesErrorBar_lineWidth" href="#webglSeriesErrorBar_lineWidth">#</a> *webglSeriesErrorBar*.**lineWidth**(*width*)

If *width* is specified, sets the width to the given value and returns this series. If *width* is not specified, returns the current width value.

<a name="webglSeriesErrorBar_crossValueAttribute" href="#webglSeriesErrorBar_crossValueAttribute">#</a> *webglSeriesErrorBar*.**crossValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossValue` shader attribute.

<a name="webglSeriesErrorBar_highValueAttribute" href="#webglSeriesErrorBar_highValueAttribute">#</a> *webglSeriesErrorBar*.**highValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aHighValue` shader attribute.

<a name="webglSeriesErrorBar_lowValueAttribute" href="#webglSeriesErrorBar_lowValueAttribute">#</a> *webglSeriesErrorBar*.**lowValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aLowValue` shader attribute.

<a name="webglSeriesErrorBar_bandwidthAttribute" href="#webglSeriesErrorBar_bandwidthAttribute">#</a> *webglSeriesErrorBar*.**bandwidthAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aBandwidth` shader attribute.

<a name="webglSeriesErrorBar_definedAttribute" href="#webglSeriesErrorBar_definedAttribute">#</a> *webglSeriesErrorBar*.**definedAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aDefined` shader attribute.

Values calculated from the given *attributeBufferBuilder* should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

#### Line

<a name="webglSeriesLine" href="#webglSeriesLine">#</a> fc.**webglSeriesLine**()

Used to construct a new WebGL Line series.

<a name="webglSeriesLine_lineWidth" href="#webglSeriesLine_lineWidth">#</a> *webglSeriesLine*.**lineWidth**(*width*)

If *width* is specified, sets the width to the given value and returns this series. If *width* is not specified, returns the current width value.

<a name="webglSeriesLine_crossPreviousValueAttribute" href="#webglSeriesLine_crossPreviousValueAttribute">#</a> *webglSeriesLine*.**crossPreviousValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossPrevValue` shader attribute.

<a name="webglSeriesLine_crossValueAttribute" href="#webglSeriesLine_crossValueAttribute">#</a> *webglSeriesLine*.**crossValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossValue` shader attribute.

<a name="webglSeriesLine_crossNextValueAttribute" href="#webglSeriesLine_crossNextValueAttribute">#</a> *webglSeriesLine*.**crossNextValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossNextValue` shader attribute.

<a name="webglSeriesLine_crossPreviousPreviousValueAttribute" href="#webglSeriesLine_crossPreviousPreviousValueAttribute">#</a> *webglSeriesLine*.**crossPreviousPreviousValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossPrevPrevValue` shader attribute.

<a name="webglSeriesLine_mainPreviousValueAttribute" href="#webglSeriesLine_mainPreviousValueAttribute">#</a> *webglSeriesLine*.**mainPreviousValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aMainPrevValue` shader attribute.

<a name="webglSeriesLine_mainValueAttribute" href="#webglSeriesLine_mainValueAttribute">#</a> *webglSeriesLine*.**mainValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aMainValue` shader attribute.

<a name="webglSeriesLine_mainNextValueAttribute" href="#webglSeriesLine_mainNextValueAttribute">#</a> *webglSeriesLine*.**mainNextValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aMainNextValue` shader attribute.

<a name="webglSeriesLine_mainPreviousPreviousValueAttribute" href="#webglSeriesLine_mainPreviousPreviousValueAttribute">#</a> *webglSeriesLine*.**mainPreviousPreviousValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aMainPrevPrevValue` shader attribute.

<a name="webglSeriesLine_definedAttribute" href="#webglSeriesLine_definedAttribute">#</a> *webglSeriesLine*.**definedAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aDefined` shader attribute.

Values calculated from the given *attributeBufferBuilder* should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

<a name="webglSeriesLine_definedNextAttribute" href="#webglSeriesLine_definedNextAttribute">#</a> *webglSeriesLine*.**definedNextAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aDefinedNext` shader attribute.

Values calculated from the given *attributeBufferBuilder* should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

#### Ohlc

<a name="webglSeriesOhlc" href="#webglSeriesOhlc">#</a> fc.**webglSeriesOhlc**()

Used to construct a new WebGL Ohlc series.

<a name="webglSeriesOhlc_lineWidth" href="#webglSeriesOhlc_lineWidth">#</a> *webglSeriesOhlc*.**lineWidth**(*width*)

If *width* is specified, sets the width to the given value and returns this series. If *width* is not specified, returns the current width value.

<a name="webglSeriesOhlc_crossValueAttribute" href="#webglSeriesOhlc_crossValueAttribute">#</a> *webglSeriesOhlc*.**crossValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossValue` shader attribute.

<a name="webglSeriesOhlc_openValueAttribute" href="#webglSeriesOhlc_openValueAttribute">#</a> *webglSeriesOhlc*.**openValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aOpenValue` shader attribute.

<a name="webglSeriesOhlc_highValueAttribute" href="#webglSeriesOhlc_highValueAttribute">#</a> *webglSeriesOhlc*.**highValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aHighValue` shader attribute.

<a name="webglSeriesOhlc_lowValueAttribute" href="#webglSeriesOhlc_lowValueAttribute">#</a> *webglSeriesOhlc*.**lowValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aLowValue` shader attribute.

<a name="webglSeriesOhlc_closeValueAttribute" href="#webglSeriesOhlc_closeValueAttribute">#</a> *webglSeriesOhlc*.**closeValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCloseValue` shader attribute.

<a name="webglSeriesOhlc_bandwidthAttribute" href="#webglSeriesOhlc_bandwidthAttribute">#</a> *webglSeriesOhlc*.**bandwidthAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aBandwidth` shader attribute.

<a name="webglSeriesOhlc_definedAttribute" href="#webglSeriesOhlc_definedAttribute">#</a> *webglSeriesOhlc*.**definedAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aDefined` shader attribute.

Values calculated from the given *attributeBufferBuilder* should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

#### Point

<a name="webglSeriesPoint" href="#webglSeriesPoint">#</a> fc.**webglSeriesPoint**()

Used to construct a new WebGL Point series.

<a name="webglSeriesPoint_type" href="#webglSeriesPoint_type">#</a> *webglSeriesPoint*.**type**(*symbolTypeShader*)

If *symbolTypeShader* is specified, sets the symbol type shader and returns this series. If *symbolTypeShader* is not specified, returns the current symbol type shader.

A *symbolTypeShader* can be generated using the [webglSymbolMapper](Link to webglSymbolMapper).

<a name="webglSeriesPoint_crossValueAttribute" href="#webglSeriesPoint_crossValueAttribute">#</a> *webglSeriesPoint*.**crossValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aCrossValue` shader attribute.

<a name="webglSeriesPoint_mainValueAttribute" href="#webglSeriesPoint_mainValueAttribute">#</a> *webglSeriesPoint*.**mainValueAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aMainValue` shader attribute.

<a name="webglSeriesPoint_sizeAttribute" href="#webglSeriesPoint_sizeAttribute">#</a> *webglSeriesPoint*.**sizeAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aSize` shader attribute.

<a name="webglSeriesPoint_definedAttribute" href="#webglSeriesPoint_definedAttribute">#</a> *webglSeriesPoint*.**definedAttribute**(*attributeBufferBuilder*)

Sets the *attributeBufferBuilder* to be used to create the buffer for the `aDefined` shader attribute.

Values calculated from the given *attributeBufferBuilder* should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

### Attribute Buffer Builders

The attribute components can be used to generate buffers for a series and bind them to a given program context. A number of different builders are available to accomodate the most common use cases.

#### Element Attribute

<a name="webglElementAttribute" href="#webglElementAttribute">#</a> fc.**webglElementAttribute**()

Used to generate a buffer containing values to be used on a per component basis. In this context a component is each object drawn to a chart, for example each individual candlestick on a candlestick chart is a component.

<a name="webglElementAttribute_normalized" href="#webglElementAttribute_normalized">#</a> *webglElementAttribute*.**normalized**(*boolean*)

If *boolean* is specified, sets the normalized property and returns this attribute builder. If *boolean* is not specified, returns the current value of normalized.

The normalized property specifies whether integer data values should be normalized when being cast to a float, the default value is false.

### Shader Naming Convention

The naming convention for shader inputs follows the convention found on the [series-api page](https://d3fc.io/api/series-api.html) in the web docs.

One key difference is that shader inputs should be written in camelCase and have a qualifier prefix.

#### Qualifier

Shader inputs can have one of three qualifiers. Each qualifier has a corresponding prefix.

| Qualifier | Prefix |
| --------- | ------ |
| Attribute | a      |
| Uniform   | u      |
| Varying   | v      |

For example: `aCrossValue`
