# d3fc-path

A collection of SVG/canvas path generators for creating chart series

[Main d3fc package](https://github.com/ScottLogic/d3fc)

# API

## General API

All of the exported functions have the same signature, `(context) => generator`. The context supplied must be an implementation of the subset of Context2D methods as implemented by [d3-path](https://github.com/d3/d3-path) (or indeed a Context2D!).

You can then configure the `generator` by invoking the relevant methods (e.g. `generator.x(/* ... */)`) as described below. Once suitably configured invoke the generator function itself with the required data (e.g. `generator([/* ... */])`).

### Example usage - SVG

```javascript

import { path } from 'd3-path';
import { candlestick } from 'd3fc-path';

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

import { candlestick } from 'd3fc-path';

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


## Bar

### x(accessorFunc)
### y(accessorFunc)
### width(accessorFunc)
### height(accessorFunc)

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

### horizontalAlign(alignment)

`alignment` is one of: `left`, `right` or `center` (default)

### verticalAlign(alignment)

`alignment` is one of: `bottom`, `top` or `center` (default)


## Box Plot

### value(accessorFunc)
### median(accessorFunc)
### upperQuartile(accessorFunc)
### lowerQuartile(accessorFunc)
### high(accessorFunc)
### low(accessorFunc)
### width(accessorFunc)

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

### cap(accessorFunc)

The `accessorFunc(item, index)` function is called on each item of the data, and returns
the **proprtion** of the box width that the caps width should be.

### orient(orientation)

Orientation of the chart. Either `horizontal` (default) or `vertical`


## Candlestick

### x(accessorFunc)
### open(accessorFunc)
### high(accessorFunc)
### low(accessorFunc)
### close(accessorFunc)
### width(accessorFunc)

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

## Error Bar

### value(accessorFunc)
### high(accessorFunc)
### low(accessorFunc)
### width(accessorFunc)

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

### orient(orientation)

Orientation of the chart. Either `horizontal` (default) or `vertical`

## OHLC

### x(accessorFunc)
### open(accessorFunc)
### high(accessorFunc)
### low(accessorFunc)
### close(accessorFunc)
### width(accessorFunc)

The attribute accessor methods available to set the way the bar chart accesses the data.
The `accessorFunc(datum, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

#### orient(orientation)

Orientation of the chart. Either `horizontal` (default) or `vertical`
