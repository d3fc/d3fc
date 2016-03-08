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
import { candlestick } from 'd3fc-shape';

const ctx = path();

const drawCandlestick = candlestick(ctx)
  .x((d, i) => i)
  .open((d) => d.open)
  .high((d) => d.high)
  .low((d) => d.low)
  .close((d) => d.close);

d3.select('path')
  .datum([
    { open: 4, high: 5, low: 3, close: 3 }
  ])
  .attr('d', drawCandlestick);

```

### Example usage - Canvas

```javascript

import { candlestick } from 'd3fc-shape';

const ctx = document.querySelector('canvas').getContext('2d');

const drawCandlestick = candlestick(ctx)
  .x((d, i) => i)
  .open((d) => d.open)
  .high((d) => d.high)
  .low((d) => d.low)
  .close((d) => d.close);

drawCandlestick([
  { open: 4, high: 5, low: 3, close: 3 }
]);

```


#### *shape*.**bar**(*context*)

*bar*.**x**(*accessorFunc*)  
*bar*.**y**(*accessorFunc*)  
*bar*.**width**(*accessorFunc*)  
*bar*.**height**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

*bar*.**horizontalAlign**(*alignment*)  

`alignment` is one of: `left`, `right` or `center` (default)

*bar*.**verticalAlign**(*alignment*)  

`alignment` is one of: `bottom`, `top` or `center` (default)


#### *shape*.**boxPlot**(*context*)

*boxPlot*.**value**(*accessorFunc*)  
*boxPlot*.**median**(*accessorFunc*)  
*boxPlot*.**upperQuartile**(*accessorFunc*)  
*boxPlot*.**lowerQuartile**(*accessorFunc*)  
*boxPlot*.**high**(*accessorFunc*)  
*boxPlot*.**low**(*accessorFunc*)  
*boxPlot*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

*boxPlot*.**cap**(*accessorFunc*)  

The `accessorFunc(item, index)` function is called on each item of the data, and returns
the **proprtion** of the box width that the caps width should be.

*boxPlot*.**orient**(*orientation*)  

Orientation of the chart. Either `horizontal` (default) or `vertical`


#### *shape*.**candlestick**(*context*)

*candlestick*.**x**(*accessorFunc*)  
*candlestick*.**open**(*accessorFunc*)  
*candlestick*.**high**(*accessorFunc*)  
*candlestick*.**low**(*accessorFunc*)  
*candlestick*.**close**(*accessorFunc*)  
*candlestick*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.


#### *shape*.**errorBar**(*context*)

*errorBar*.**value**(*accessorFunc*)  
*errorBar*.**high**(*accessorFunc*)  
*errorBar*.**low**(*accessorFunc*)  
*errorBar*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

*errorBar*.**orient**(*orientation*)  

Orientation of the chart. Either `horizontal` (default) or `vertical`


#### *shape*.**ohlc**(*context*)

*errorBar*.**x**(*accessorFunc*)  
*errorBar*.**open**(*accessorFunc*)  
*errorBar*.**high**(*accessorFunc*)  
*errorBar*.**low**(*accessorFunc*)  
*errorBar*.**close**(*accessorFunc*)  
*errorBar*.**width**(*accessorFunc*)  

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

*errorBar*.**orient**(*orientation*)  

Orientation of the chart. Either `horizontal` (default) or `vertical`
