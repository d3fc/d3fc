# d3fc-shape

A collection of SVG/canvas path generators for creating chart series

[Main d3fc package](https://github.com/ScottLogic/d3fc)

# Installation

```bash
npm install d3fc-shape
```

# API

## General API

All of the exported functions have the same signature, `(context) => generator`. The context supplied must be an implementation of the subset of Context2D methods as implemented by [d3-path](https://github.com/d3/d3-path) (or indeed a Context2D!).

You can then configure the `generator` by invoking the relevant methods (e.g. `generator.x(/* ... */)`) as described below. Once suitably configured invoke the generator function itself with the required data (e.g. `generator([/* ... */])`).

### Example usage - SVG

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

### Example usage - Canvas

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

*fc*.**shapeBar**(*context*)

*shapeBar*.**x**(*accessorFunc*)  
*shapeBar*.**y**(*accessorFunc*)  
*shapeBar*.**width**(*accessorFunc*)  
*shapeBar*.**height**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

*shapeBar*.**horizontalAlign**(*alignment*)  

`alignment` is one of: `left`, `right` or `center` (default)

*shapeBar*.**verticalAlign**(*alignment*)  

`alignment` is one of: `bottom`, `top` or `center` (default)

### Boxplot

*fc*.**shapeBoxPlot**(*context*)

*shapeBoxPlot*.**value**(*accessorFunc*)  
*shapeBoxPlot*.**median**(*accessorFunc*)  
*shapeBoxPlot*.**upperQuartile**(*accessorFunc*)  
*shapeBoxPlot*.**lowerQuartile**(*accessorFunc*)  
*shapeBoxPlot*.**high**(*accessorFunc*)  
*shapeBoxPlot*.**low**(*accessorFunc*)  
*shapeBoxPlot*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

*shapeBoxPlot*.**cap**(*accessorFunc*)  

The `accessorFunc(item, index)` function is called on each item of the data, and returns
the **proprtion** of the box width that the caps width should be.

*shapeBoxPlot*.**orient**(*orientation*)  

Orientation of the chart. Either `horizontal` (default) or `vertical`

### Candlestick

*fc*.**shapeCandlestick**(*context*)

*shapeCandlestick*.**x**(*accessorFunc*)  
*shapeCandlestick*.**open**(*accessorFunc*)  
*shapeCandlestick*.**high**(*accessorFunc*)  
*shapeCandlestick*.**low**(*accessorFunc*)  
*shapeCandlestick*.**close**(*accessorFunc*)  
*shapeCandlestick*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

### Error Bar

*fc*.**shapeErrorBar**(*context*)

*shapeErrorBar*.**value**(*accessorFunc*)  
*shapeErrorBar*.**high**(*accessorFunc*)  
*shapeErrorBar*.**low**(*accessorFunc*)  
*shapeErrorBar*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

*shapeErrorBar*.**orient**(*orientation*)  

Orientation of the chart. Either `horizontal` (default) or `vertical`

### OHLC

*fc*.**shapeOhlc**(*context*)

*shapeOhlc*.**x**(*accessorFunc*)  
*shapeOhlc*.**open**(*accessorFunc*)  
*shapeOhlc*.**high**(*accessorFunc*)  
*shapeOhlc*.**low**(*accessorFunc*)  
*shapeOhlc*.**close**(*accessorFunc*)  
*shapeOhlc*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

*shapeOhlc*.**orient**(*orientation*)  

Orientation of the chart. Either `horizontal` (default) or `vertical`
