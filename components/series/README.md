# fc.**series**

+ [Candlestick](#candlestick-data-series)
+ [Comparison](#comparison-data-series)
+ [OHLC](#ohlc-data-series)
+ [Line](#line-data-series)
+ [Volume](#volume-data-series)

## Candlestick Data Series

This component calculates and draws a candlestick data series, the series shows high, low, open and close values on the Y axis against Date/Time on the X axis.
The series can be styled using CSS to represent market gains or market losses.

fc.series.**candlestick**()

Constructs a new instance of the Candlestick component.

```javascript
var candlestick = fc.series.candlestick()
		        .xScale(x)
		        .yScale(y)
		        .rectangleWidth(5);
```

**candlestick**()

This adds the Candlestick component to a chart. 

```javascript
plotArea.append('g')
	.attr('class', 'series')
	.datum(data)
	.call(candlestick);
```

The datum function is passed the data for the series. The data is an array of objects consistant with the output of the [dataGenerator component](../utilities/#slutilitiesdatagenerator).

```javascript
plotArea.append('g')
	.attr('class', 'series')
	.datum(data)
	.call(candlestick);
```

candlestick.**xScale**([*value*])

Specifies the X scale which the component uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

candlestick.**yScale**([*value*])

Specifies the Y scale which the component uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

candlestick.**rectangleWidth**([*value*])

Specifies the width of the candle bodies in the data series. If not specified the value defaults to 5.

### CSS

A number of CSS classes are used when generating the data series to allow the series to be styled. These classes are detailed below with a brief description of their use.

------

## Comparison Data Series

Documentation Pending

------

## OHLC Data Series

Documentation Pending

------

## Line Data Series

Documentation Pending

------

## Volume Data Series

Documentation Pending

