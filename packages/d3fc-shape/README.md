# d3fc-path

A collection of SVG/canvas path generators for creating chart series

[Main d3fc package](https://github.com/ScottLogic/d3fc)

# API

## General API

All of the exported functions have the same signature, `(context) => generator`.

You can then call a few helper methods on the **generator** which is returned
(which are specific to the type of chart).

### Example usage

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


## Bar

The attribute accessor methods available to set the way the bar chart accesses
its attributes.

### Accessor functions

The `accessorFunc(item, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

#### x(accessorFunc)
#### y(accessorFunc)
#### width(accessorFunc)
#### height(accessorFunc)

#### horizontalAlign(alignment)

`alignment` is one of: **left**, **right** or **center**

#### verticalAlign(alignment)

`alignment` is one of: **bottom**, **top** or **center**


## Box Plot

The attribute accessor methods available to set the way the box plot chart accesses
its attributes.

### Accessor functions

The `accessorFunc(item, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

#### value(accessorFunc)
#### median(accessorFunc)
#### upperQuartile(accessorFunc)
#### lowerQuartile(accessorFunc)
#### high(accessorFunc)
#### low(accessorFunc)
#### width(accessorFunc)

#### cap(accessorFunc)

The `accessorFunc(item, index)` function is called on each item of the data, and returns
the **proprtion** of the box width that the caps width should be.

#### orient(orientation)

Orientation of the chart. Either `horizontal` (default) or `vertical`


## Candlestick

The attribute accessor methods available to set the way the candlestick chart accesses
its attributes.

### Accessor functions

The `accessorFunc(item, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

#### x(accessorFunc)
#### open(accessorFunc)
#### high(accessorFunc)
#### low(accessorFunc)
#### close(accessorFunc)
#### width(accessorFunc)


## Error Bar

The attribute accessor methods available to set the way the error bar chart accesses
its attributes.

### Accessor functions

The `accessorFunc(item, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

#### value(accessorFunc)
#### high(accessorFunc)
#### low(accessorFunc)
#### width(accessorFunc)

#### orient(orientation)

Orientation of the chart. Either `horizontal` (default) or `vertical`



## OHLC

The attribute accessor methods available to set the way the OHLC chart accesses
its attributes.

### Accessor functions

The `accessorFunc(item, index)` function is called on each item of the data, and returns
the relevant value for the relevant attribute for that item.

#### x(accessorFunc)
#### open(accessorFunc)
#### high(accessorFunc)
#### low(accessorFunc)
#### close(accessorFunc)
#### width(accessorFunc)

#### orient(orientation)

Orientation of the chart. Either `horizontal` (default) or `vertical`
