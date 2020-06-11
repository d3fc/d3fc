# d3fc-webgl

A collection of very low-level components for rendering with WebGL. See other packages (e.g. [d3fc-series](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-series#d3fc-series)) for higher-level components which make use of these low-level components.

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
* [Buffers](#buffers)
  * [Attribute Buffer Builders](#attribute-buffer-builders)
    * [Attribute](#attribute)
    * [Adjacent Attribute](#adjacent-attribute)
    * [Base Attribute](#base-attribute)
  * [Uniform Builder](#uniform-builder)
  * [Buffer Builder](#buffer-builder)
  * [Element Indices](#element-indices)
  * [Types](#types)
* [Scales](#scales)
  * [Linear](#linear)
  * [Log](#log)
  * [Pow](#pow)
  * [Scale Mapper](#scale-mapper)
* [Shader Builder](#shader-builder)
  * [Shader Naming Convention](#shader-naming-convention)
* [Program Builder](#program-builder)
  * [Handling Lost Context](#handling-lost-context)
* [Symbol Mapper](#symbol-mapper)
* [Fill Color](#fill-color)
* [Stroke Color](#stroke-color)

This package contains the components needed to render a standard or custom series types with WebGL.

### Series

*If this is your first time using WebGL, this collection of very low-level components is not the best place to start. See other packages (e.g. [d3fc-series](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-series#d3fc-series)) for higher-level components which make use of these low-level components.*

The series share a common API with a typical configuration requiring x and y WebGL scales together with a number of attribute buffers.

Some of the series make use of `next`/`previous` attributes. These are needed in situations where the current element requires information about adjacent elements in order to be drawn correctly. For example when drawing a line we need to know information about adjacent data points so that we can draw the connection between them correctly.

Currently only the [line](#line) and [point](#point) series are able to render different orientations (`horizontal` and `vertical`), all other charts render as a `vertical` chart.

#### Common Properties

A few properties are shared across all of the series.

<a name="series_xScale" href="#series_xScale">#</a> *series*.**xScale**(*scale*)
<a name="series_yScale" href="#series_yScale">#</a> *series*.**yScale**(*scale*)

If *scale* is specified, sets the scale and returns this series. If *scale* is not specified, returns the current scale.

N.B. scales are Webgl scales not D3 scales. These can be created [manually](#scales) or generated from D3 scales using the [webglScaleMapper](#scale-mapper).

<a name="series_decorate" href="#series_decorate">#</a> *series*.**decorate**(*decorateFunc*)

If *decorateFunc* is specified, sets decorate to the given function and returns this series. If *decorateFunc* is not specified, returns the current decorate function.

The function is called immediately prior to the underlying WebGL calls. It is passed a single argument which is an instance of [`webglProgramBuilder`](#program-builder). This allows users of the components to modify the shaders, as well as change or pass in additional attribute/uniform values.

<a name="series_context" href="#series_context">#</a> *series*.**context**(*WebGLRenderingContext*)

If *WebGLRenderingContext* is specified, sets the rendering context and returns this series. If *WebGLRenderingContext* is not specified, returns the current rendering context.

This property is rebound from [webglProgramBuilder.context](#program-builder).

<a name="series_definedAttribute" href="#series_definedAttribute">#</a> *series*.**definedAttribute**(*attribute*)

If *attribute* is specified, sets the defined attribute and returns this series. If *attribute* is not specified, returns the current defined attribute.

The attribute values should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

#### Area

<a name="webglSeriesArea" href="webglSeriesArea">#</a> fc.**webglSeriesArea**()

Used to construct a new WebGL Area series.

<a name="webglSeriesArea_crossValueAttribute" href="#webglSeriesArea_crossValueAttribute">#</a> *webglSeriesArea*.**crossValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross value attribute and returns this series. If *attribute* is not specified, returns the current cross value attribute.

<a name="webglSeriesArea_crossNextValueAttribute" href="#webglSeriesArea_crossNextValueAttribute">#</a> *webglSeriesArea*.**crossNextValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross next value attribute and returns this series. If *attribute* is not specified, returns the current cross next value attribute.

<a name="webglSeriesArea_mainValueAttribute" href="#webglSeriesArea_mainValueAttribute">#</a> *webglSeriesArea*.**mainValueAttribute**(*attribute*)

If *attribute* is specified, sets the main value attribute and returns this series. If *attribute* is not specified, returns the current main value attribute.

<a name="webglSeriesArea_mainNextValueAttribute" href="#webglSeriesArea_mainNextValueAttribute">#</a> *webglSeriesArea*.**mainNextValueAttribute**(*attribute*)

If *attribute* is specified, sets the main next value attribute and returns this series. If *attribute* is not specified, returns the current main next value attribute.

<a name="webglSeriesArea_baseValueAttribute" href="#webglSeriesArea_baseValueAttribute">#</a> *webglSeriesArea*.**baseValueAttribute**(*attribute*)

If *attribute* is specified, sets the base value attribute and returns this series. If *attribute* is not specified, returns the current base value attribute.

<a name="webglSeriesArea_baseNextValueAttribute" href="#webglSeriesArea_baseNextValueAttribute">#</a> *webglSeriesArea*.**baseNextValueAttribute**(*attribute*)

If *attribute* is specified, sets the base next value attribute and returns this series. If *attribute* is not specified, returns the current base next value attribute.

<a name="webglSeriesArea_definedNextAttribute" href="#webglSeriesArea_definedNextAttribute">#</a> *webglSeriesArea*.**definedNextAttribute**(*attribute*)

If *attribute* is specified, sets the defined next attribute and returns this series. If *attribute* is not specified, returns the current defined next attribute.

The attribute values should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

#### Bar

<a name="webglSeriesBar" href="#webglSeriesBar">#</a> fc.**webglSeriesBar**()

Used to construct a new WebGL Bar series.

<a name="webglSeriesBar_crossValueAttribute" href="#webglSeriesBar_crossValueAttribute">#</a> *webglSeriesBar*.**crossValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross value attribute and returns this series. If *attribute* is not specified, returns the current cross value attribute.

<a name="webglSeriesBar_mainValueAttribute" href="#webglSeriesBar_mainValueAttribute">#</a> *webglSeriesBar*.**mainValueAttribute**(*attribute*)

If *attribute* is specified, sets the main value attribute and returns this series. If *attribute* is not specified, returns the current main value attribute.

<a name="webglSeriesBar_baseValueAttribute" href="#webglSeriesBar_baseValueAttribute">#</a> *webglSeriesBar*.**baseValueAttribute**(*attribute*)

If *attribute* is specified, sets the base value attribute and returns this series. If *attribute* is not specified, returns the current base value attribute.

<a name="webglSeriesBar_bandwidthAttribute" href="#webglSeriesBar_bandwidthAttribute">#</a> *webglSeriesBar*.**bandwidthAttribute**(*attribute*)

If *attribute* is specified, sets the bandwidth attribute and returns this series. If *attribute* is not specified, returns the current bandwidth attribute.

The attribute values should be provided in pixels.

#### BoxPlot

<a name="webglSeriesBoxPlot" href="#webglSeriesBoxPlot">#</a> fc.**webglSeriesBoxPlot**()

Used to construct a new WebGL BoxPlot series

<a name="webglSeriesBoxPlot_lineWidth" href="#webglSeriesBoxPlot_lineWidth">#</a> *webglSeriesBoxPlot*.**lineWidth**(*width*)

If *width* is specified, sets the width to the given value and returns this series. If *width* is not specified, returns the current width value.

The value should be provided in pixels.

<a name="webglSeriesBoxPlot_crossValueAttribute" href="#webglSeriesBoxPlot_crossValueAttribute">#</a> *webglSeriesBoxPlot*.**crossValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross value attribute and returns this series. If *attribute* is not specified, returns the current cross value attribute.

<a name="webglSeriesBoxPlot_highValueAttribute" href="#webglSeriesBoxPlot_highValueAttribute">#</a> *webglSeriesBoxPlot*.**highValueAttribute**(*attribute*)

If *attribute* is specified, sets the high value attribute and returns this series. If *attribute* is not specified, returns the current high value attribute.

<a name="webglSeriesBoxPlot_upperQuartileValueAttribute" href="#webglSeriesBoxPlot_upperQuartileValueAttribute">#</a> *webglSeriesBoxPlot*.**upperQuartileValueAttribute**(*attribute*)

If *attribute* is specified, sets the upper quartile value attribute and returns this series. If *attribute* is not specified, returns the current upper quartile value attribute.

<a name="webglSeriesBoxPlot_medianValueAttribute" href="#webglSeriesBoxPlot_medianValueAttribute">#</a> *webglSeriesBoxPlot*.**medianValueAttribute**(*attribute*)

If *attribute* is specified, sets the median value attribute and returns this series. If *attribute* is not specified, returns the current median value attribute.

<a name="webglSeriesBoxPlot_lowerQuartileValueAttribute" href="#webglSeriesBoxPlot_lowerQuartileValueAttribute">#</a> *webglSeriesBoxPlot*.**lowerQuartileValueAttribute**(*attribute*)

If *attribute* is specified, sets the lower quartile value attribute and returns this series. If *attribute* is not specified, returns the current lower quartile value attribute.

<a name="webglSeriesBoxPlot_lowValueAttribute" href="#webglSeriesBoxPlot_lowValueAttribute">#</a> *webglSeriesBoxPlot*.**lowValueAttribute**(*attribute*)

If *attribute* is specified, sets the low value attribute and returns this series. If *attribute* is not specified, returns the current low value attribute.

<a name="webglSeriesBoxPlot_bandwidthAttribute" href="#webglSeriesBoxPlot_bandwidthAttribute">#</a> *webglSeriesBoxPlot*.**bandwidthAttribute**(*attribute*)

If *attribute* is specified, sets the bandwidth attribute and returns this series. If *attribute* is not specified, returns the current bandwidth attribute.

The attribute values should be provided in pixels.

<a name="webglSeriesBoxPlot_capAttribute" href="#webglSeriesBoxPlot_capAttribute">#</a> *webglSeriesBoxPlot*.**capAttribute**(*attribute*)

If *attribute* is specified, sets the cap attribute and returns this series. If *attribute* is not specified, returns the current cap attribute.

The attribute values should be provided in pixels.

#### Candlestick

<a name="webglSeriesCandlestick" href="#webglSeriesCandlestick">#</a> fc.**webglSeriesCandlestick**()

Used to construct a new WebGL Candlestick series.

<a name="webglSeriesCandlestick_lineWidth" href="#webglSeriesCandlestick_lineWidth">#</a> *webglSeriesCandlestick*.**lineWidth**(*width*)

If *width* is specified, sets the width to the given value and returns this series. If *width* is not specified, returns the current width value.

The value should be provided in pixels.

<a name="webglSeriesCandlestick_crossValueAttribute" href="#webglSeriesCandlestick_crossValueAttribute">#</a> *webglSeriesCandlestick*.**crossValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross value attribute and returns this series. If *attribute* is not specified, returns the current cross value attribute.

<a name="webglSeriesCandlestick_openValueAttribute" href="#webglSeriesCandlestick_openValueAttribute">#</a> *webglSeriesCandlestick*.**openValueAttribute**(*attribute*)

If *attribute* is specified, sets the open value attribute and returns this series. If *attribute* is not specified, returns the current open value attribute.

<a name="webglSeriesCandlestick_highValueAttribute" href="#webglSeriesCandlestick_highValueAttribute">#</a> *webglSeriesCandlestick*.**highValueAttribute**(*attribute*)

If *attribute* is specified, sets the high value attribute and returns this series. If *attribute* is not specified, returns the current high value attribute.

<a name="webglSeriesCandlestick_lowValueAttribute" href="#webglSeriesCandlestick_lowValueAttribute">#</a> *webglSeriesCandlestick*.**lowValueAttribute**(*attribute*)

If *attribute* is specified, sets the low value attribute and returns this series. If *attribute* is not specified, returns the current low value attribute.

<a name="webglSeriesCandlestick_closeValueAttribute" href="#webglSeriesCandlestick_closeValueAttribute">#</a> *webglSeriesCandlestick*.**closeValueAttribute**(*attribute*)

If *attribute* is specified, sets the close value attribute and returns this series. If *attribute* is not specified, returns the current close value attribute.

<a name="webglSeriesCandlestick_bandwidthAttribute" href="#webglSeriesCandlestick_bandwidthAttribute">#</a> *webglSeriesCandlestick*.**bandwidthAttribute**(*attribute*)

If *attribute* is specified, sets the bandwidth attribute and returns this series. If *attribute* is not specified, returns the current bandwidth attribute.

The attribute values should be provided in pixels.

#### ErrorBar

<a name="webglSeriesErrorBar" href="#webglSeriesErrorBar">#</a> fc.**webglSeriesErrorBar**()

Used to construct a new WebGL ErrorBar series.

<a name="webglSeriesErrorBar_lineWidth" href="#webglSeriesErrorBar_lineWidth">#</a> *webglSeriesErrorBar*.**lineWidth**(*width*)

If *width* is specified, sets the width to the given value and returns this series. If *width* is not specified, returns the current width value.

The value should be provided in pixels.

<a name="webglSeriesErrorBar_crossValueAttribute" href="#webglSeriesErrorBar_crossValueAttribute">#</a> *webglSeriesErrorBar*.**crossValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross value attribute and returns this series. If *attribute* is not specified, returns the current cross value attribute.

<a name="webglSeriesErrorBar_highValueAttribute" href="#webglSeriesErrorBar_highValueAttribute">#</a> *webglSeriesErrorBar*.**highValueAttribute**(*attribute*)

If *attribute* is specified, sets the high value attribute and returns this series. If *attribute* is not specified, returns the current high value attribute.

<a name="webglSeriesErrorBar_lowValueAttribute" href="#webglSeriesErrorBar_lowValueAttribute">#</a> *webglSeriesErrorBar*.**lowValueAttribute**(*attribute*)

If *attribute* is specified, sets the low value attribute and returns this series. If *attribute* is not specified, returns the current low value attribute.

<a name="webglSeriesErrorBar_bandwidthAttribute" href="#webglSeriesErrorBar_bandwidthAttribute">#</a> *webglSeriesErrorBar*.**bandwidthAttribute**(*attribute*)

If *attribute* is specified, sets the bandwidth attribute and returns this series. If *attribute* is not specified, returns the current bandwidth attribute.

The attribute values should be provided in pixels.

#### Line

<a name="webglSeriesLine" href="#webglSeriesLine">#</a> fc.**webglSeriesLine**()

Used to construct a new WebGL Line series.

<a name="webglSeriesLine_lineWidth" href="#webglSeriesLine_lineWidth">#</a> *webglSeriesLine*.**lineWidth**(*width*)

If *width* is specified, sets the width to the given value and returns this series. If *width* is not specified, returns the current width value.

The value should be provided in pixels.

<a name="webglSeriesLine_crossPreviousValueAttribute" href="#webglSeriesLine_crossPreviousValueAttribute">#</a> *webglSeriesLine*.**crossPreviousValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross previous value attribute and returns this series. If *attribute* is not specified, returns the current cross previous value attribute.

<a name="webglSeriesLine_crossValueAttribute" href="#webglSeriesLine_crossValueAttribute">#</a> *webglSeriesLine*.**crossValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross value attribute and returns this series. If *attribute* is not specified, returns the current cross value attribute.

<a name="webglSeriesLine_crossNextValueAttribute" href="#webglSeriesLine_crossNextValueAttribute">#</a> *webglSeriesLine*.**crossNextValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross next value attribute and returns this series. If *attribute* is not specified, returns the current cross next value attribute.

<a name="webglSeriesLine_crossNextNextValueAttribute" href="#webglSeriesLine_crossNextNextValueAttribute">#</a> *webglSeriesLine*.**crossNextNextValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross next next value attribute and returns this series. If *attribute* is not specified, returns the current cross next next value attribute.

<a name="webglSeriesLine_mainPreviousValueAttribute" href="#webglSeriesLine_mainPreviousValueAttribute">#</a> *webglSeriesLine*.**mainPreviousValueAttribute**(*attribute*)

If *attribute* is specified, sets the main previous value attribute and returns this series. If *attribute* is not specified, returns the current main previous value attribute.

<a name="webglSeriesLine_mainValueAttribute" href="#webglSeriesLine_mainValueAttribute">#</a> *webglSeriesLine*.**mainValueAttribute**(*attribute*)

If *attribute* is specified, sets the main value attribute and returns this series. If *attribute* is not specified, returns the current main value attribute.

<a name="webglSeriesLine_mainNextValueAttribute" href="#webglSeriesLine_mainNextValueAttribute">#</a> *webglSeriesLine*.**mainNextValueAttribute**(*attribute*)

If *attribute* is specified, sets the main next value attribute and returns this series. If *attribute* is not specified, returns the current main next value attribute.

<a name="webglSeriesLine_mainNextNextValueAttribute" href="#webglSeriesLine_mainNextNextValueAttribute">#</a> *webglSeriesLine*.**mainNextNextValueAttribute**(*attribute*)

If *attribute* is specified, sets the main next next value attribute and returns this series. If *attribute* is not specified, returns the current main next next value attribute.

<a name="webglSeriesLine_definedNextAttribute" href="#webglSeriesLine_definedNextAttribute">#</a> *webglSeriesLine*.**definedNextAttribute**(*attribute*)

If *attribute* is specified, sets the defined next attribute and returns this series. If *attribute* is not specified, returns the current defined next attribute.

The attribute values should either be `1` (to indicate the data point is defined) or `0` (to indicate the data point is not defined).

#### Ohlc

<a name="webglSeriesOhlc" href="#webglSeriesOhlc">#</a> fc.**webglSeriesOhlc**()

Used to construct a new WebGL Ohlc series.

<a name="webglSeriesOhlc_lineWidth" href="#webglSeriesOhlc_lineWidth">#</a> *webglSeriesOhlc*.**lineWidth**(*width*)

If *width* is specified, sets the width to the given value and returns this series. If *width* is not specified, returns the current width value.

The value should be provided in pixels.

<a name="webglSeriesOhlc_crossValueAttribute" href="#webglSeriesOhlc_crossValueAttribute">#</a> *webglSeriesOhlc*.**crossValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross value attribute and returns this series. If *attribute* is not specified, returns the current cross value attribute.

<a name="webglSeriesOhlc_openValueAttribute" href="#webglSeriesOhlc_openValueAttribute">#</a> *webglSeriesOhlc*.**openValueAttribute**(*attribute*)

If *attribute* is specified, sets the open value attribute and returns this series. If *attribute* is not specified, returns the current open value attribute.

<a name="webglSeriesOhlc_highValueAttribute" href="#webglSeriesOhlc_highValueAttribute">#</a> *webglSeriesOhlc*.**highValueAttribute**(*attribute*)

If *attribute* is specified, sets the high value attribute and returns this series. If *attribute* is not specified, returns the current high value attribute.

<a name="webglSeriesOhlc_lowValueAttribute" href="#webglSeriesOhlc_lowValueAttribute">#</a> *webglSeriesOhlc*.**lowValueAttribute**(*attribute*)

If *attribute* is specified, sets the low value attribute and returns this series. If *attribute* is not specified, returns the current low value attribute.

<a name="webglSeriesOhlc_closeValueAttribute" href="#webglSeriesOhlc_closeValueAttribute">#</a> *webglSeriesOhlc*.**closeValueAttribute**(*attribute*)

If *attribute* is specified, sets the close value attribute and returns this series. If *attribute* is not specified, returns the current close value attribute.

<a name="webglSeriesOhlc_bandwidthAttribute" href="#webglSeriesOhlc_bandwidthAttribute">#</a> *webglSeriesOhlc*.**bandwidthAttribute**(*attribute*)

If *attribute* is specified, sets the bandwidth attribute and returns this series. If *attribute* is not specified, returns the current bandwidth attribute.

The attribute values should be provided in pixels.

#### Point

<a name="webglSeriesPoint" href="#webglSeriesPoint">#</a> fc.**webglSeriesPoint**()

Used to construct a new WebGL Point series.

<a name="webglSeriesPoint_type" href="#webglSeriesPoint_type">#</a> *webglSeriesPoint*.**type**(*symbolTypeShader*)

If *symbolTypeShader* is specified, sets the symbol type shader and returns this series. If *symbolTypeShader* is not specified, returns the current symbol type shader.

A *symbolTypeShader* can be generated using the [webglSymbolMapper](#symbol-mapper).

<a name="webglSeriesPoint_crossValueAttribute" href="#webglSeriesPoint_crossValueAttribute">#</a> *webglSeriesPoint*.**crossValueAttribute**(*attribute*)

If *attribute* is specified, sets the cross value attribute and returns this series. If *attribute* is not specified, returns the current cross value attribute.

<a name="webglSeriesPoint_mainValueAttribute" href="#webglSeriesPoint_mainValueAttribute">#</a> *webglSeriesPoint*.**mainValueAttribute**(*attribute*)

If *attribute* is specified, sets the main value attribute and returns this series. If *attribute* is not specified, returns the current main value attribute.

<a name="webglSeriesPoint_sizeAttribute" href="#webglSeriesPoint_sizeAttribute">#</a> *webglSeriesPoint*.**sizeAttribute**(*attribute*)

If *attribute* is specified, sets the size attribute and returns this series. If *attribute* is not specified, returns the current size attribute.

The attribute values should be provided as pixel areas.

### Buffers

The buffer components can be used for creating and modifying WebGL buffers. These are used to pass values into attributes and uniforms so that they can be accessed in a shader.

The types file is also available for managing the typing of values being passed into the WebGL pipeline.

#### Attribute Buffer Builders

The attribute components can be used to generate [WebGLBuffers](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer) and bind them to the context of a given [webglProgramBuilder](#program-builder). A number of different builders are available to accomodate the most common use cases.

Example use of the builders can be seen in the [series](#series) components where the builders are used to provide the attribute values.

##### Attribute

<a name="webglAttribute" href="#webglAttribute">#</a> fc.**webglAttribute**()

Used to generate a buffer containing values for the shaders.

<a name="webglAttribute_normalized" href="#webglAttribute_normalized">#</a> *webglAttribute*.**normalized**(*boolean*)

If *boolean* is specified, sets the normalized property and returns this attribute builder. If *boolean* is not specified, returns the current value of normalized.

The normalized property specifies whether integer data values should be normalized when being cast to a float, the default value is false.

More information on how values are normalized can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer).

<a name="webglAttribute_location" href="#webglAttribute_location">#</a> *webglAttribute*.**location**(*index*)

If *index* is specified, sets the location property and returns this attribute builder. If *index* is not specified, returns the current value of location.

The location property is used to specify the index of the vertex attribute being modified. The appropriate value for an attribute can be found using [`WebGLRenderingContext.getAttribLocation()`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation). This is normally specified on your behalf by [bufferBuilder](#buffer-builder).

<a name="webglAttribute_data" href="#webglAttribute_data">#</a> *webglAttribute*.**data**(*array*)

If *array* is specified, sets the data property and returns this attribute builder. If *array* is not specified, returns the current value of data.

The data property is used to allow the value function to run for each entry in the data set.

<a name="webglAttribute_value" href="#webglAttribute_value">#</a> *webglAttribute*.**value**(*valueFunc*)

If *valueFunc* is specified, sets the value property to the given function and returns this attribute builder. If *valueFunc* is not specified, returns the current value function.

The value function is run for each entry in the data set, receiving the current data point and its index as arguments, *`valueFunc(data, index)`*.

If the size property is set to `1`, then *valueFunc* must return a single value. If the size property is set to a value other than `1` then *valueFunc* must return an array of length equal to the size property.

<a name="webglAttribute_size" href="#webglAttribute_size">#</a> *webglAttribute*.**size**(*size*)

If *size* is specified, sets the size property and returns this attribute builder. If *size* is not specified, returns the current value of size.

The size property is used to specify the number of components to the attribute. It must have the value `1` (default), `2`, `3`, or `4`, corresponding to the shader types `float`, `vec2`, `vec3`, and `vec4` respectively.

<a name="webglAttribute_type" href="#webglAttribute_type">#</a> *webglAttribute*.**type**(*type*)

If *type* is specified, sets the type property and returns this attribute builder. If *type* is not specified, returns the current type.

The type property is used to specify the type of the typed array used for the buffer data. Valid types can be accessed from [webglTypes](#types).

<a name="webglAttribute_clear" href="#webglAttribute_clear">#</a> *webglAttribute*.**clear**()

Used to indicate that the buffer should be rebuilt on the next render, by default the buffer will only be rebuilt if a property on the builder changes.

<a name="webglAttribute_divisor" href="#webglAttribute_divisor">#</a> *webglAttribute*.**divisor**(*divisor*)

If *divisor* is specified, sets the divisor property and returns this attribute builder. If *divisor* is not specified, returns the current divisor.

The divisor property is used to specify the rate (the number of instances) at which the attribute advances. A divisor of 0 would be used to repeat the same set of values for each set of vertices making up each instance e.g. `vertex[0][0] = a, vertex[0][1] = b, vertex[1][0] = a, vertex[1][1] = b, vertex[2][0] = a, vertex[2][1] = b`. A divisor of 1 would be used to pass a value per set of vertices making up each instance e.g. `vertex[0][0] = a, vertex[0][1] = a, vertex[1][0] = b, vertex[1][1] = b, vertex[2][0] = c, vertex[2][1] = c`.

By default this value is null which causes the value to depend upon whether instanced rendering is enabled, see [subInstanceCount](#webglProgramBuilder_subInstanceCount). If it is enabled, the divisor will have the value 1 otherwise it will be 0.

##### Adjacent Element Attribute

<a name="webglAdjacentAttribute" href="#webglAdjacentAttribute">#</a> fc.**webglAdjacentAttribute**(*minOffset*, *maxOffset*)

Used to generate a buffer where each element requires data from another element adjacent to it. In this context an element is an instance of a repeatedly drawn object, for example each individual candlestick on a candlestick chart is an element.

*minOffset* specifies the minimum bound for the offset property, this controls how many previous elements are available to access from the builder. The default value is `0`.
*maxOffset* specifies the maximum bound for the offset property, this controls how many following elements are available to access from the builder. The default value is `0`.

<a name="webglAdjacentAttribute_offset" href="#webglAdjacentAttribute_offset">#</a> *webglAdjacentAttribute*.**offset**(*offset*)

Sets the offset property and returns an attribute builder that accesses the same data with the given *offset*.

The value of *offset* must be within the bounds of `minOffset` and `maxOffset`.

<a name="webglAdjacentAttribute_normalized" href="#webglAdjacentAttribute_normalized">#</a> *webglAdjacentAttribute*.**normalized**(*boolean*)

If *boolean* is specified, sets the normalized property and returns this attribute builder. If *boolean* is not specified, returns the current value of normalized.

The normalized property specifies whether integer data values should be normalized when being cast to a float, the default value is false.

More information on how values are normalized can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer).

<a name="webglAdjacentAttribute_location" href="#webglAdjacentAttribute_location">#</a> *webglAdjacentAttribute*.**location**(*index*)

If *index* is specified, sets the location property and returns this attribute builder. If *index* is not specified, returns the current value of location.

The location property is used to specify the index of the vertex attribute being modified. The appropriate value for an attribute can be found using [`WebGLRenderingContext.getAttribLocation()`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation). This is normally specified on your behalf by [bufferBuilder](#buffer-builder).

<a name="webglAdjacentAttribute_data" href="#webglAdjacentAttribute_data">#</a> *webglAdjacentAttribute*.**data**(*array*)

If *array* is specified, sets the data property and returns this attribute builder. If *array* is not specified, returns the current value of data.

The data property is used to allow the value function to run for each entry in the data set.

<a name="webglAdjacentAttribute_value" href="#webglAdjacentAttribute_value">#</a> *webglAdjacentAttribute*.**value**(*valueFunc*)

If *valueFunc* is specified, sets the value property to the given function and returns this attribute builder. If *valueFunc* is not specified, returns the current value function.

The value function is run for each entry in the data set, receiving the current data point and its index as arguments, *`valueFunc(data, index)`*.

If the size property is set to `1`, then *valueFunc* must return a single value. If the size property is set to a value other than `1` then *valueFunc* must return an array of length equal to the size property.

<a name="webglAdjacentAttribute_size" href="#webglAdjacentAttribute_size">#</a> *webglAdjacentAttribute*.**size**(*size*)

If *size* is specified, sets the size property and returns this attribute builder. If *size* is not specified, returns the current value of size.

The size property is used to specify the number of components to the attribute. It must have the value `1` (default), `2`, `3`, or `4`, corresponding to the shader types `float`, `vec2`, `vec3`, and `vec4` respectively.

<a name="webglAdjacentAttribute_type" href="#webglAdjacentAttribute_type">#</a> *webglAdjacentAttribute*.**type**(*type*)

If *type* is specified, sets the type property and returns this attribute builder. If *type* is not specified, returns the current type.

The type property is used to specify the type of the typed array used for the buffer data, the default is `Float`. Valid types can be accessed from [webglTypes](#types).

<a name="webglAdjacentAttribute_clear" href="#webglAdjacentAttribute_clear">#</a> *webglAdjacentAttribute*.**clear**()

Used to indicate that the buffer should be rebuilt on the next render, by default the buffer will only be rebuilt if a property on the builder changes.

<a name="webglAdjacentAttribute_divisor" href="#webglAdjacentAttribute_divisor">#</a> *webglAdjacentAttribute*.**divisor**(*divisor*)

If *divisor* is specified, sets the divisor property and returns this attribute builder. If *divisor* is not specified, returns the current divisor.

The divisor property is used to specify the rate (the number of instances) at which the attribute advances. A divisor of 0 would be used to repeat the same set of values for each set of vertices making up each instance e.g. `vertex[0][0] = a, vertex[0][1] = b, vertex[1][0] = a, vertex[1][1] = b, vertex[2][0] = a, vertex[2][1] = b`. A divisor of 1 would be used to pass a value per set of vertices making up each instance e.g. `vertex[0][0] = a, vertex[0][1] = a, vertex[1][0] = b, vertex[1][1] = b, vertex[2][0] = c, vertex[2][1] = c`.

By default this value is null which causes the value to depend upon whether instanced rendering is enabled, see [subInstanceCount](#webglProgramBuilder_subInstanceCount). If it is enabled, the divisor will have the value 1 otherwise it will be 0.

##### Base Attribute

<a name="webglBaseAttribute" href="#webglBaseAttribute">#</a> fc.**webglBaseAttribute**()

The generic base attribute builder that all the other attribute builders inherit from to provide their functionality. This will bind a buffer to a generic vertex attribute, accessed at [**location**](#base-attribute), but *is not* responsible for binding data to the buffer.

This component can be used to create a custom attribute builder, or to simply bind a buffer to a vertex attribute so that data can be provided.

<a name="webglBaseAttribute_buffer" href="#webglBaseAttribute_buffer">#</a> *webglBaseAttribute*.**buffer**(*WebGLBuffer*)

If *WebGLBuffer* is specified, sets the buffer property and returns this attribute builder. If *WebGLBuffer* is not specified, returns the current buffer.

This property does not need to be set as the component will create a buffer if necessary, a buffer can be manually created using [`WebGLRenderingContext.createBuffer()`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer).

<a name="webglBaseAttribute_location" href="#webglBaseAttribute_location">#</a> *webglBaseAttribute*.**location**(*index*)

If *index* is specified, sets the location property and returns this attribute builder. If *index* is not specified, returns the current value of location.

The location property is used to specify the index of the vertex attribute being modified. The appropriate value for an attribute can be found using [`WebGLRenderingContext.getAttribLocation()`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation). This is normally specified on your behalf by [bufferBuilder](#buffer-builder).

<a name="webglBaseAttribute_size" href="#webglBaseAttribute_size">#</a> *webglBaseAttribute*.**size**(*size*)

If *size* is specified, sets the size property and returns this attribute builder. If *size* is not specified, returns the current value of size.

The size property is used to specify the number of components to the attribute. It must have the value `1` (default), `2`, `3`, or `4`, corresponding to the shader types `float`, `vec2`, `vec3`, and `vec4` respectively.

<a name="webglBaseAttribute_type" href="#webglBaseAttribute_type">#</a> *webglBaseAttribute*.**type**(*type*)

If *type* is specified, sets the type property and returns this attribute builder. If *type* is not specified, returns the current type.

The type property is used to specify the type of the typed array used for the buffer data. Valid types can be accessed from [webglTypes](#types).

<a name="webglBaseAttribute_normalized" href="#webglBaseAttribute_normalized">#</a> *webglBaseAttribute*.**normalized**(*boolean*)

If *boolean* is specified, sets the normalized property and returns this attribute builder. If *boolean* is not specified, returns the current value of normalized.

The normalized property specifies whether integer data values should be normalized when being cast to a float, the default value is false.

More information on how values are normalized can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer).

<a name="webglBaseAttribute_stride" href="#webglBaseAttribute_stride">#</a> *webglBaseAttribute*.**stride**(*stride*)

If *stride* is specified, sets the stride property and returns this attribute builder. If *stride* is not specified, returns the current stride.

The stride property is used to specify the offset in bytes between the start of consecutive vertex attribute values, it must be a value from `0` (default) to `255`. By using the stride property it is possible to create a buffer of interleaved attribute values.

<a name="webglBaseAttribute_offset" href="#webglBaseAttribute_offset">#</a> *webglBaseAttribute*.**offset**(*offset*)

If *offset* is specified, sets the offset property and returns this attribute builder. If *offset* is not specified, returns the current offset.

The offset property is used to specify the offset in bytes of the first value in the vertex attribute array. If set, the offset must be a multiple of the byte length of [type](#base-attribute).

<a name="webglBaseAttribute_divisor" href="#webglBaseAttribute_divisor">#</a> *webglBaseAttribute*.**divisor**(*divisor*)

If *divisor* is specified, sets the divisor property and returns this attribute builder. If *divisor* is not specified, returns the current divisor.

The divisor property is used to specify the rate (the number of instances) at which the attribute advances. A divisor of 0 would be used to repeat the same set of values for each set of vertices making up each instance e.g. `vertex[0][0] = a, vertex[0][1] = b, vertex[1][0] = a, vertex[1][1] = b, vertex[2][0] = a, vertex[2][1] = b`. A divisor of 1 would be used to pass a value per set of vertices making up each instance e.g. `vertex[0][0] = a, vertex[0][1] = a, vertex[1][0] = b, vertex[1][1] = b, vertex[2][0] = c, vertex[2][1] = c`.

By default this value is null which causes the value to depend upon whether instanced rendering is enabled, see [subInstanceCount](#webglProgramBuilder_subInstanceCount). If it is enabled, the divisor will have the value 1 otherwise it will be 0.

#### Uniform Builder

<a name="webglUniform" href="#webglUniform">#</a> fc.**webglUniform**()

Used to create a single value that is provided to every vertex.

<a name="webglUniform_location" href="#webglUniform_location">#</a> *webglUniform*.**location**(*index*)

If *index* is specified, sets the location property and returns this uniform builder. If *index* is not specified, returns the current location.

The location property is used to specify the index location of the uniform being modified. The appropriate value can be found using [`WebGLRenderingContext.getUniformLocation()`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniformLocation). This is normally specified on your behalf by [bufferBuilder](#buffer-builder).

<a name="webglUniform_data" href="#webglUniform_data">#</a> *webglUniform*.**data**(*data*)

If *data* is specified, sets the data property and returns this uniform builder. If *data* is not specified, returns the current data.

The data property is used to set the value of the uniform, the value provided can either be a single value or an array with a maximum length of `4`.

<a name="webglUniform_clear" href="#webglUniform_clear">#</a> *webglUniform*.**clear**()

Used to indicate that the buffer should be rebuilt on the next render, by default the buffer will only be rebuilt if a property on the builder changes.

#### Buffer Builder

<a name="webglBufferBuilder" href="#webglBufferBuilder">#</a> fc.**webglBufferBuilder**()

This component manages the mapping of attribute/uniform builders to their shader identifiers.

<a name="webglBufferBuilder_flush" href="#webglBufferBuilder_flush">#</a> *webglBufferBuilder*.**flush**()

Used to ensure that all attributes and uniforms associated with the builder are rebuilt on the next render. This is equivalent to calling the `clear` function for all associated attributes and uniforms.

<a name="webglBufferBuilder_attribute" href="#webglBufferBuilder_attribute">#</a> *webglBufferBuilder*.**attribute**(*attributeName*, *attribute*)

If *attribute* is specified, assigns the *attribute* for the specified *attributeName* and returns this builder. If *attribute* is not specified, returns the attribute  to *attributeName*.

<a name="webglBufferBuilder_uniform" href="#webglBufferBuilder_uniform">#</a> *webglBufferBuilder*.**uniform**(*uniformName*, *uniform*)

If *uniform* is specified, assigns the *uniform* for the specified *uniformName* and returns this builder. If *uniform* is not specified, returns the uniform  to *uniformName*.

<a name="webglBufferBuilder_elementIndices" href="#webglBufferBuilder_elementIndices">#</a> *webglBufferBuilder*.**elementIndices**(*elementIndices*)

If *elementIndices* is specified, sets element indices and returns this builder. If *elementIndices* is not specified, returns the current element indices.

If this value is null then array-based rendering will be used. Otherwise, element-based rendering will be used see [webglElementIndices](#webglElementIndices).

#### Element Indices

<a name="webglElementIndices" href="#webglElementIndices">#</a> fc.**webglElementIndices**()

Used to create an element array buffer. This allows vertices to be defined once and reused by providing an index specifying which vertex we are currently using.

For example to draw two triangles that share a vertex we could provide the values `[0, 1, 2, 1, 3, 4]`. Here we will draw a triangle with the vertices `0`, `1`, and `2`, and a second triangle with the vertices `1`, `3`, and `4`. We only have to specify the data for `5` vertices as we are reusing vertex `1`.

<a name="webglElementIndices_data" href="#webglElementIndices_data">#</a> *webglElementIndices*.**data**(*data*)

If *data* is specified, sets data and returns this builder. If *data* is not specified, returns the current data.

*data* should be an array containing an ordered list of the vertices to draw.

<a name="webglElementIndices_clear" href="#webglElementIndices_clear">#</a> *webglElementIndices*.**clear**()

Used to indicate that the buffer should be rebuilt on the next render, by default the buffer will only be rebuilt if a property on the builder changes.

#### Types

<a name="webglTypes" href="#webglTypes">#</a> fc.**webglTypes**

An enum used to access the WebGL values associated with different data types.

### Scales

The scale components can be used for applying a scaling and translation to a variable within the vertex shader. This is useful for converting values from a data range to screen space.

Any vector variables can have a scaling applied to them.

Please note that the [Log](#log) and [Pow](#pow) scales do not behave correctly for all `base` and `exponent` values respectively, this issue can be tracked [here](https://github.com/d3fc/d3fc/issues/1387).

#### Linear

<a name="webglScaleLinear" href="#webglScaleLinear">#</a> fc.**webglScaleLinear**()

Used to apply a linear scaling and translation to variables.

<a name="webglScaleLinear_domain" href="#webglScaleLinear_domain">#</a> *webglScaleLinear*.**domain**(*domain*)

If *domain* is specified, sets the domain and returns this scale. If *domain* is not specified, returns the current domain.

*domain* should be an array containing the lower and upper bounds for the data set to be scaled.

<a name="webglScaleLinear_range" href="#webglScaleLinear_range">#</a> *webglScaleLinear*.**range**(*range*)

If *range* is specified, sets the range and returns this scale. If *range* is not specified, returns the current range.

*range* should be an array containing the lower and upper bounds for the drawing area, given in draw space coordinates. Defaults to `[-1, 1]`, the full canvas.

#### Log

<a name="webglScaleLog" href="#webglScaleLog">#</a> fc.**webglScaleLog**()

Used to apply a logarithmic scaling and translation to variables.

<a name="webglScaleLog_base" href="#webglScaleLog_base">#</a> *webglScaleLog*.**base**(*base*)

If *base* is specified, sets the base and returns this scale. If *base* is not specified, returns the current base.

The value provided is used as the logarithm base.

<a name="webglScaleLog_domain" href="#webglScaleLog_domain">#</a> *webglScaleLog*.**domain**(*domain*)

If *domain* is specified, sets the domain and returns this scale. If *domain* is not specified, returns the current domain.

*domain* should be an array containing the lower and upper bounds for the data set to be scaled.

<a name="webglScaleLog_range" href="#webglScaleLog_range">#</a> *webglScaleLog*.**range**(*range*)

If *range* is specified, sets the range and returns this scale. If *range* is not specified, returns the current range.

*range* should be an array containing the lower and upper bounds for the drawing area, given in draw space coordinates. Defaults to `[-1, 1]`, the full canvas.

#### Pow

<a name="webglScalePow" href="#webglScalePow">#</a> fc.**webglScalePow**()

Used to apply an exponential scaling and translation to variables.

<a name="webglScalePow_exponent" href="#webglScalePow_exponent">#</a> *webglScalePow*.**exponent**(*exponent*)

If *exponent* is specified, sets the exponent and returns this scale. If *exponent* is not specified, returns the current exponent.

The value provided is used as the exponent.

<a name="webglScalePow_domain" href="#webglScalePow_domain">#</a> *webglScalePow*.**domain**(*domain*)

If *domain* is specified, sets the domain and returns this scale. If *domain* is not specified, returns the current domain.

*domain* should be an array containing the lower and upper bounds for the data set to be scaled.

<a name="webglScalePow_range" href="#webglScalePow_range">#</a> *webglScalePow*.**range**(*range*)

If *range* is specified, sets the range and returns this scale. If *range* is not specified, returns the current range.

*range* should be an array containing the lower and upper bounds for the drawing area, given in draw space coordinates. Defaults to `[-1, 1]`, the full canvas.

#### Scale Mapper

<a name="webglScaleMapper" href="#webglScaleMapper">#</a> fc.**webglScaleMapper**(*scale*)

Used to map a [D3 Scale](https://github.com/d3/d3-scale#continuous-scales) (*scale*) to a matched pair of JavaScript and WebGL scales with appropriate properties (e.g. `domain`) copied over. Returns an object containing two fields, `scale`, and `webglScale`.

The JavaScript scale is guaranteed to be a pure function if the returned reference is equal to a previously returned reference.

As there is no reliable way to test for the type of a scale, this implementation is naive and may return non-optimal mappings.

### Shader Builder

<a name="webglShaderBuilder" href="#webglShaderBuilder">#</a> fc.**webglShaderBuilder**(*base*)

Used to allow shaders to be built in parts, this can be useful for allowing optional lines of shader code to be added. For example, given a condition, a line can be appended to a shader to change the output color.

*base* must be a function that accepts two arguments, a header for the shader and a body for the shader. It must return a string that contains the header and a main function surrounding the body.

An example of a base could be:
```javascript
const base = (header, body) => `
  precision mediump float;
  ${header}
  void main() {
    ${body}
  }
`;
```

<a name="webglShaderBuilder_appendHeader" href="#webglShaderBuilder_appendHeader">#</a> *webglShaderBuilder*.**appendHeader**(*header*)

Appends *header* to the end of the current headers.

*header* must be a string containing GLSL code.

<a name="webglShaderBuilder_insertHeader" href="#webglShaderBuilder_insertHeader">#</a> *webglShaderBuilder*.**insertHeader**(*header*, *before*)

Inserts *header* before the line provided in the *before* argument.

*header* must be a string containing GLSL code.
*before* must be a string containing GLSL code already in the current headers. If *before* does not match any existing headers then *header* will be appended to the end of the current headers.

<a name="webglShaderBuilder_appendHeaderIfNotExists" href="#webglShaderBuilder_appendHeaderIfNotExists">#</a> *webglShaderBuilder*.**appendHeaderIfNotExists**(*header*)

Appends *header* to the end of the current headers as long as it does not already exist.

*header* must be a string containing GLSL code.

<a name="webglShaderBuilder_appendBody" href="#webglShaderBuilder_appendBody">#</a> *webglShaderBuilder*.**appendBody**(*body*)

Appends *body* to the end of the current bodies.

*body* must be a string containing GLSL code.

<a name="webglShaderBuilder_insertBody" href="#webglShaderBuilder_insertBody">#</a> *webglShaderBuilder*.**insertBody**(*body*, *before*)

Inserts *body* before the line provided in the *before* argument.

*body* must be a string containing GLSL code.
*before* must be a string containing GLSL code already in the current bodies. If *before* does not match any existing bodies then *body* will be appended to the end of the current bodies.

<a name="webglShaderBuilder_appendBodyIfNotExists" href="#webglShaderBuilder_appendBodyIfNotExists">#</a> *webglShaderBuilder*.**appendBodyIfNotExists**(*body*)

Appends *body* to the end of the current bodies as long as it does not already exist.

*body* must be a string containing GLSL code.

#### Shader Naming Convention

The naming convention for shader inputs follows the convention found on the [series-api page](https://d3fc.io/api/series-api.html) in the web docs.

One key difference is that shader inputs should be written in camelCase and have a qualifier prefix.

Shader inputs can have one of three qualifiers. Each qualifier has a corresponding prefix.

| Qualifier | Prefix |
| --------- | ------ |
| Attribute | a      |
| Uniform   | u      |
| Varying   | v      |

For example: `aCrossValue`

### Program Builder

<a name="webglProgramBuilder" href="#webglProgramBuilder">#</a> fc.**webglProgramBuilder**()

This component manages the creation and execution of a [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram). No underlying WebGL methods are invoked until the program builder itself is invoked.

<a name="webglProgramBuilder_extInstancedArrays" href="#webglProgramBuilder_extInstancedArrays">#</a> *webglProgramBuilder*.**extInstancedArrays**()

Returns a reference to the [`ANGLE_instanced_arrays`](https://developer.mozilla.org/en-US/docs/Web/API/ANGLE_instanced_arrays) WebGL extension used for drawing to the canvas.

This reference should be used, rather than components obtaining their own, to prevent errors if the context is lost.

<a name="webglProgramBuilder_context" href="#webglProgramBuilder_context">#</a> *webglProgramBuilder*.**context**(*context*)

If *context* is specified, sets the context and returns this builder. If *context* is not specified, returns the current context.

*context* must be an instance of [WebGLRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext) from the canvas to be drawn to. *context* can also be set to null if the context has been lost, see [Handling Lost Context](#handling-lost-context) for more information.

<a name="webglProgramBuilder_buffers" href="#webglProgramBuilder_buffers">#</a> *webglProgramBuilder*.**buffers**(*bufferBuilder*)

If *bufferBuilder* is specified, sets the buffers and returns this builder. If *bufferBuilder* is not specified, returns the current buffers.

*bufferBuilder* must be an instance of [`webglBufferBuilder`](#buffer-builder)

<a name="webglProgramBuilder_vertexShader" href="#webglProgramBuilder_vertexShader">#</a> *webglProgramBuilder*.**vertexShader**(*shaderBuilder*)

If *shaderBuilder* is specified, sets the vertex shader and returns this builder. If *shaderBuilder* is not specified, returns the current vertex shader.

*shaderBuilder* must be an instance of [`webglShaderBuilder`](#shader-builder)

<a name="webglProgramBuilder_fragmentShader" href="#webglProgramBuilder_fragmentShader">#</a> *webglProgramBuilder*.**fragmentShader**(*shaderBuilder*)

If *shaderBuilder* is specified, sets the fragment shader and returns this builder. If *shaderBuilder* is not specified, returns the current fragment shader.

*shaderBuilder* must be an instance of [`webglShaderBuilder`](#shader-builder)

<a name="webglProgramBuilder_mode" href="#webglProgramBuilder_mode">#</a> *webglProgramBuilder*.**mode**(*mode*)

If *mode* is specified, sets the mode and returns this builder. If *mode* is not specified, returns the current mode.

*mode* must be a WebGL draw mode, modes supported by `webglProgramBuilder` are `WebGLRenderingContext.POINTS` and `WebGLRenderingContext.TRIANGLES`.

<a name="webglProgramBuilder_subInstanceCount" href="#webglProgramBuilder_subInstanceCount">#</a> *webglProgramBuilder*.**subInstanceCount**(*subInstanceCount*)

If *subInstanceCount* is specified, sets the count of vertex count per instance and returns this builder. If *subInstanceCount* is not specified, returns the current value which default to 0.

A value of 0 disables instanced rendering, any other value enables instanced rendering. To control how instanced attribute behaviour see [divisor](#webglBaseAttribute_divisor).

<a name="webglProgramBuilder_debug" href="#webglProgramBuilder_debug">#</a> *webglProgramBuilder*.**debug**(*debug*)

If *debug* is specified, enables or disables additional verification checks and error logging. This is very useful when working with custom shaders or debugging `INVALID_OPERATION` messages. However, it should not be enabled in production as the checks severely impact rendering performance. If *debug* is not specified, returns the current debug setting.

#### Handling Lost Context

As the GPU is a shared resource it is possible for situations to arise where it is taken away from the program, this will result in a `webglcontextlost` event. If you are working with a [Cartesian Chart](https://d3fc.io/api/chart-api.html) then both the `webglcontextlost` and `webglcontextrestored` events are automatically handled for you. However if you are not working with a Cartesian Chart then you must handle these events yourself.

If the `webglcontextlost` event occurs then null should be passed to the context property of the component being used, for example [program builder](#program-builder) or [series](#series). This will invalidate the relevant resources associated with the lost context and block the rendering pipeline. If a subsequent `webglcontextrestored` event occurs then the new context can be passed to the component to recreate the needed resources and unblock the rendering pipeline.

Both the `webglcontextlost` and `webglcontextrestored` event listeners must be added to the canvas being used:

```javascript
canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  component.context(null);
}, false);

canvas.addEventListener('webglcontextrestored', () => {
  component.context(canvas.getContext('webgl'));
  component();
}, false);
```

For more information on handling lost context you can view [this guide](https://www.khronos.org/webgl/wiki/HandlingContextLost).

### Symbol Mapper

<a name="webglSymbolMapper" href="#webglSymbolMapper">#</a> fc.**webglSymbolMapper**(*symbol*)

Used to map a [D3 symbol](https://github.com/d3/d3-shape#symbols) (*symbol*) to a shader used for drawing the equivalent symbol.

Supported symbols:
* Circle
* Square
* Triangle
* Cross

### Fill Color

<a name="webglFillColor" href="#webglFillColor">#</a> fc.**webglFillColor**(*color*)

Used to set a fill color for the elements being drawn. If *color* is specified, it is used as the initial [value](#webglFillColor_value).

<a name="webglFillColor_value" href="#webglFillColor_value">#</a> *webglFillColor*.**value**(*value*)

If *value* is specified, sets value and returns this component. If *value* is not specified, returns the current value.

Colors are specified as arrays containing four values representing `rgba` values given in the range `0` to `1` e.g. `[1, 1, 0, 1]` for yellow. To convert an arbitrary CSS color string into this format -

```javascript
const webglColor = identifier => {
    const { r, g, b, opacity } = d3.color(identifier).rgb();
    return [r / 255, g / 255, b / 255, opacity];
};
```

The *value* can either be an array representing a constant value or a function which returns a color for every datum in [data](#webglFillColor_data).

<a name="webglFillColor_data" href="#webglFillColor_data">#</a> *webglFillColor*.**data**(*data*)

If *data* is specified, sets the data and returns this component. If *data* is not specified, returns the current data.

The data property is used to allow the value function to run for each entry in the data set.

### Stroke Color

<a name="webglStrokeColor" href="#webglStrokeColor">#</a> fc.**webglStrokeColor**(*color*)

Used to set a stroke color for the elements being drawn. If *color* is specified, it is used as the initial [value](#webglStrokeColor_value).

<a name="webglStrokeColor_value" href="#webglStrokeColor_value">#</a> *webglStrokeColor*.**value**(*value*)

If *value* is specified, sets value and returns this component. If *value* is not specified, returns the current value.

Colors are specified as arrays containing four values representing `rgba` values given in the range `0` to `1` e.g. `[1, 1, 0, 1]` for yellow. To convert an arbitrary CSS color string into this format -

```javascript
const webglColor = identifier => {
    const { r, g, b, opacity } = d3.color(identifier).rgb();
    return [r / 255, g / 255, b / 255, opacity];
};
```

The *value* can either be an array representing a constant value or a function which returns a color for every datum in [data](#webglStrokeColor_data).

<a name="webglStrokeColor_data" href="#webglStrokeColor_data">#</a> *webglStrokeColor*.**data**(*data*)

If *data* is specified, sets the data and returns this component. If *data* is not specified, returns the current data.

The data property is used to allow the value function to run for each entry in the data set.
