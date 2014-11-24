# sl.**indicators**

+ [Bollinger Bands](#bollingerbands)
+ [Moving Average](#movingaveragetracker)
+ [Relative Strength Index](#relativestrengthindexrsi)

## Bollinger Bands

This component calculates and draws Bollinger bands on a data series, calculated using a moving average and a standard deviation value.

sl.indicators.**bollingerBands**()

Constructs a new instance of the Bollinger band component.

```javascript
var bollinger = sl.indicators.bollingerBands()
		        .xScale(x)
		        .yScale(y)
		        .yValue('close')
		        .movingAverage(20)
		        .standardDeviations(2);
```

**bollingerBands**()

This adds the Bollinger band component to a chart.

```javascript
plotArea.append('g')
    .datum(data)
    .call(bollinger);
```

bollingerBands.**xScale**([*value*])

Specifies the X scale which the component uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

bollingerBands.**yScale**([*value*])

Specifies the Y scale which the component uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

bollingerBands.**yValue**([*value*])

Specifies the name of the data field which the component will follow.
If not specified, returns the current data field, which defaults to 0.

bollingerBands.**movingAverage**([*value*])

Specifies the number of data points the component will use when calculating its moving average value.
If not specified, returns the current value, which defaults to 20.

bollingerBands.**standardDeviations**([*value*])

Specifies the number of standard deviations to use as the amplitude of the displayed bands.
If not specified, returns the current data field, which defaults to 2.

bollingerBands.**cssBandUpper**([*value*])

Specifies a CSS class which will be applied to the upper band line.
If not specified, returns the current CSS class, which defaults to `bollingerBandUpper`.

bollingerBands.**cssBandLower**([*value*])

Specifies a CSS class which will be applied to the lower band line.
If not specified, returns the current CSS class, which defaults to `bollingerBandLower`.

bollingerBands.**cssBandArea**([*value*])

Specifies a CSS class which will be applied to the band area.
If not specified, returns the current CSS class, which defaults to `bollingerBandArea`.

bollingerBands.**cssAverage**([*value*])

Specifies a CSS class which will be applied to the middle band line.
If not specified, returns the current CSS class, which defaults to `bollingerAverage`.

------

## Moving Average Tracker

This component draws a line on a chart which follows the value of a given data field, optionally applying a moving average calculation.

sl.indicators.**movingAverage**()

Constructs a new instance of the moving average component.

```javascript
var indicator = sl.indicators.movingAverage()
				.xScale(x)
				.yScale(y)
				.averagePoints(8)
				.yValue('close');
```

**movingAverage**()

This adds the moving average line to the chart.

```javascript
plotArea.append('g')
				.datum($rootScope.chartData)
				.call(indicator);
```

movingAverage.**xScale**([*value*])

Specifies the X scale which the tracker uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

movingAverage.**yScale**([*value*])

Specifies the Y scale which the tracker uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

movingAverage.**yValue**([*value*])

Specifies the name of the data field which the tracker will follow.
You can also pass in an integer value, in which case the component will draw a horizontal line at that price value.
If not specified, returns the current data field or price value, which defaults to 0.

movingAverage.**averagePoints**([*value*])

Specifies the number of data points the tracker will use when calculating its moving average value.
If not specified, returns the current value, which defaults to 5.

movingAverage.**css**([*value*])

Specifies a CSS class which will be applied to the tracker line.
This can be useful if you have multiple trackers on the same chart and need to differentiate them.
If not specified, returns the current CSS class, which defaults to an empty string.

----

## Relative Strength Index (RSI)

This component will generate an RSI data series on a chart based on data generated in the format produced by the dataGenerator component. The RSI algorithm is based on the accepted algorithm for RSI presented on [Wikipedia](http://en.wikipedia.org/wiki/Relative_strength_index).

sl.indicators.**rsi**()

Constructs a new instance of the RSI component.

```javascript
var indicator = sl.indicators.rsi()
				.xScale(x)
				.yScale(y)
				.lambda(0.94);
```

**rsi**()

This adds the RSI lines to the chart.

```javascript
plotArea.append('g')
				.datum($rootScope.chartData)
				.call(indicator);
```

rsi.**xScale**([*value*])

Specifies the X scale which the RSI uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

rsi.**yScale**([*value*])

Specifies the Y scale which the tracker uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

rsi.**samplePeriods**([*value*])

Specifies the number of data samples used to calculte the RSI over, much like the number of points for the moving average indicator.
If not set the default value is 14, which is the accepted value given by Wilder, please refernce the Wikipedia page mentioned above.

rsi.**upperMarker**([*value*])

Specifies the location of the upper marker used to mark the level at which the market/instrument is considered over bought. 
The default value of this 70%. The value is specified as a percentage so 70 as opposed to 0.7.

rsi.**lowerMarker**([*value*])

Specifies the location of the lower marker used to mark the level at which the market/instrument is considered over sold. 
The default value of this 30%. The value is specified as a percentage so 30 as opposed to 0.3.

rsi.**lambda**([*value*])

Specifies the relative influence that the samples have on the Exponential Moving average calculation. A value of 1 (Default value) will mean that every data sample will have equal weight in the calculation. 
The most widley used values are in the region 0.92 to 0.98.

rsi.**css**([*value*])

Specifies a CSS class which will be applied to the RSI line.
This can be useful if you have multiple RSI's on the same chart and need to differentiate them.
If not specified, returns the current CSS class, which defaults to an empty string.
