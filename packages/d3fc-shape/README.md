# d3fc-shape

A collection of SVG/canvas path generators for creating chart series

[Main D3FC package](https://github.com/d3fc/d3fc)

## Installing

```bash
npm install @d3fc/d3fc-shape
```

## API Reference

* [Example usage](#example-usage)
* [Bar](#bar)
* [Boxplot](#boxplot)
* [Candlestick](#candlestick)
* [Error Bar](#error-bar)
* [OHLC](#ohlc)

All of the exported functions have the same signature, `(context) => generator`. The context supplied must be an implementation of the subset of Context2D methods as implemented by [d3-path](https://github.com/d3/d3-path) (or indeed a Context2D!).

You can then configure the `generator` by invoking the relevant methods (e.g. `generator.x(/* ... */)`) as described below. Once suitably configured invoke the generator function itself with the required data (e.g. `generator([/* ... */])`).

### Example usage

#### SVG

```javascript

import { path } from 'd3-path';
import { shapeCandlestick } from 'd3fc-shape';

const ctx = path();

const candlestick = shapeCandlestick()
  .x((d, i) => i)
  .open((d) => d.open)
  .high((d) => d.high)
  .low((d) => d.low)
  .close((d) => d.close);

d3.select('path')
  .datum([
    { open: 4, high: 5, low: 3, close: 3 }
  ])
  .attr('d', candlestick);

```

#### Canvas

```javascript

import { shapeCandlestick } from 'd3fc-shape';

const ctx = document.querySelector('canvas').getContext('2d');

const candlestick = shapeCandlestick()
  .context(ctx)
  .x((d, i) => i)
  .open((d) => d.open)
  .high((d) => d.high)
  .low((d) => d.low)
  .close((d) => d.close);

candlestick([
  { open: 4, high: 5, low: 3, close: 3 }
]);

ctx.stroke();

```

### Bar

<a name="shapeBar" href="#shapeBar">#</a> fc.**shapeBar**(*context*)

<a name="shapeBar_x" href="#shapeBar_x">#</a> *shapeBar*.**x**(*accessorFunc*)  
<a name="shapeBar_y" href="#shapeBar_y">#</a> *shapeBar*.**y**(*accessorFunc*)  
<a name="shapeBar_width" href="#shapeBar_width">#</a> *shapeBar*.**width**(*accessorFunc*)  
<a name="shapeBar_height" href="#shapeBar_height">#</a> *shapeBar*.**height**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

<a name="shapeBar_horizontalAlign" href="#shapeBar_horizontalAlign">#</a> *shapeBar*.**horizontalAlign**(*alignment*)  

`alignment` is one of: `left`, `right` or `center` (default)

<a name="shapeBar_verticalAlign" href="#shapeBar_verticalAlign">#</a> *shapeBar*.**verticalAlign**(*alignment*)  

`alignment` is one of: `bottom`, `top` or `center` (default)

### Boxplot

<a name="shapeBoxPlot" href="#shapeBoxPlot">#</a> fc.**shapeBoxPlot**(*context*)

<a name="shapeBoxPlot_value" href="#shapeBoxPlot_value">#</a> *shapeBoxPlot*.**value**(*accessorFunc*)  
<a name="shapeBoxPlot_median" href="#shapeBoxPlot_median">#</a> *shapeBoxPlot*.**median**(*accessorFunc*)  
<a name="shapeBoxPlot_upperQuartile" href="#shapeBoxPlot_upperQuartile">#</a> *shapeBoxPlot*.**upperQuartile**(*accessorFunc*)  
<a name="shapeBoxPlot_lowerQuartile" href="#shapeBoxPlot_lowerQuartile">#</a> *shapeBoxPlot*.**lowerQuartile**(*accessorFunc*)  
<a name="shapeBoxPlot_high" href="#shapeBoxPlot_high">#</a> *shapeBoxPlot*.**high**(*accessorFunc*)  
<a name="shapeBoxPlot_low" href="#shapeBoxPlot_low">#</a> *shapeBoxPlot*.**low**(*accessorFunc*)  
<a name="shapeBoxPlot_width" href="#shapeBoxPlot_width">#</a> *shapeBoxPlot*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

<a name="shapeBoxPlot_cap" href="#shapeBoxPlot_cap">#</a> *shapeBoxPlot*.**cap**(*accessorFunc*)  

The `accessorFunc(item, index)` function is called on each item of the data, and returns
the **proprtion** of the box width that the caps width should be.

<a name="shapeBoxPlot_orient" href="#shapeBoxPlot_orient">#</a> *shapeBoxPlot*.**orient**(*orientation*)  

Orientation of the chart. Either `horizontal` (default) or `vertical`

### Candlestick

<a name="shapeCandlestick" href="#shapeCandlestick">#</a> fc.**shapeCandlestick**(*context*)

<a name="shapeCandlestick_x" href="#shapeCandlestick_x">#</a> *shapeCandlestick*.**x**(*accessorFunc*)  
<a name="shapeCandlestick_open" href="#shapeCandlestick_open">#</a> *shapeCandlestick*.**open**(*accessorFunc*)  
<a name="shapeCandlestick_high" href="#shapeCandlestick_high">#</a> *shapeCandlestick*.**high**(*accessorFunc*)  
<a name="shapeCandlestick_low" href="#shapeCandlestick_low">#</a> *shapeCandlestick*.**low**(*accessorFunc*)  
<a name="shapeCandlestick_close" href="#shapeCandlestick_close">#</a> *shapeCandlestick*.**close**(*accessorFunc*)  
<a name="shapeCandlestick_width" href="#shapeCandlestick_width">#</a> *shapeCandlestick*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

### Error Bar

<a name="shapeErrorBar" href="#shapeErrorBar">#</a> fc.**shapeErrorBar**(*context*)

<a name="shapeErrorBar_value" href="#shapeErrorBar_value">#</a> *shapeErrorBar*.**value**(*accessorFunc*)  
<a name="shapeErrorBar_high" href="#shapeErrorBar_high">#</a> *shapeErrorBar*.**high**(*accessorFunc*)  
<a name="shapeErrorBar_low" href="#shapeErrorBar_low">#</a> *shapeErrorBar*.**low**(*accessorFunc*)  
<a name="shapeErrorBar_width" href="#shapeErrorBar_width">#</a> *shapeErrorBar*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

<a name="shapeErrorBar_orient" href="#shapeErrorBar_orient">#</a> *shapeErrorBar*.**orient**(*orientation*)  

Orientation of the chart. Either `horizontal` (default) or `vertical`

### OHLC

<a name="shapeOhlc" href="#shapeOhlc">#</a> fc.**shapeOhlc**(*context*)

<a name="shapeOhlc_x" href="#shapeOhlc_x">#</a> *shapeOhlc*.**x**(*accessorFunc*)  
<a name="shapeOhlc_open" href="#shapeOhlc_open">#</a> *shapeOhlc*.**open**(*accessorFunc*)  
<a name="shapeOhlc_high" href="#shapeOhlc_high">#</a> *shapeOhlc*.**high**(*accessorFunc*)  
<a name="shapeOhlc_low" href="#shapeOhlc_low">#</a> *shapeOhlc*.**low**(*accessorFunc*)  
<a name="shapeOhlc_close" href="#shapeOhlc_close">#</a> *shapeOhlc*.**close**(*accessorFunc*)  
<a name="shapeOhlc_width" href="#shapeOhlc_width">#</a> *shapeOhlc*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

<a name="shapeOhlc_orient" href="#shapeOhlc_orient">#</a> *shapeOhlc*.**orient**(*orientation*)  

Orientation of the chart. Either `horizontal` (default) or `vertical`
