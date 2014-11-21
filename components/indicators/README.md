# sl.**indicators**

+ [Bollinger Bands](#bollingerbands)
+ [Moving Average](#movingaveragetracker)
+ [Relative Strength Index](#slindicatorsrsi)


## Bollinger Bands

Information and code examples here

------

## Moving Average Tracker

This component draws a line on a chart which follows the value of a given data field, optionally applying a moving average calculation.

sl.indicators**movingAverage**()

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

movingAverage.**xScale([*value*])

Specifies the X scale which the tracker uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

movingAverage.**yScale([*value*])

Specifies the Y scale which the tracker uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

movingAverage.**yValue([*value*])

Specifies the name of the data field which the tracker will follow.
You can also pass in an integer value, in which case the component will draw a horizontal line at that price value.
If not specified, returns the current data field or price value, which defaults to 0.

movingAverage.**averagePoints([*value*])

Specifies the number of data points the tracker will use when calculating its moving average value.
If not specified, returns the current value, which defaults to 5.

movingAverage.**css([*value*])

Specifies a CSS class which will be applied to the tracker line.
This can be useful if you have multiple trackers on the same chart and need to differentiate them.
If not specified, returns the current CSS class, which defaults to an empty string.

----

## sl.indicators.rsi()

This component will generate an RSI data series on a chart based on data generated in the format produced by the dataGenerator component. The RSI algorithm is based on the accepted algorithm for RSI presented on [Wikipedia](http://en.wikipedia.org/wiki/Relative_strength_index).

**Dependencies**

The dependencies for this component can be injected using [require.js](http://requirejs.org/) but should require.js not be used you will need to include the following dependencies:

+ [d3.js](http://d3js.org/)
+ [sl.js](https://github.com/ScottLogic/d3-financial-components)

###Properties:

**xScale** - The 'xScale' property defines the scale used on the X (time) axis.

**yScale** - The 'yScale' property defines the scale used on the Y axis. This is primarily for scaling values to pixels as the domain of this scale is almost always going to be 0-100.

**samplePeriods** - The 'samplePeriods' property defines the number of samples to take while calculating the Exponential Moving Average for the gains and losses. The default value is 14.

**upperMarker** - The 'upperMarker' property is used to set the position of the upper marker line (over buy) on the chart. The default value is 70.

**lowerMarker** - The 'lowerMarker' property is used to set the position of the lower marker line (over sell) on the chart. The default value is 30.

**lambda** - The 'lambda' property for the Exponential Moving Average. The default is 0.94, a value of 1.0 yields a Simple Moving Average.

**css** - An optional 'css' property for the RSI data series. This property is blank by default but can be set to force a CSS style on the data series.

###Methods:

####rsi()

Generates the RSI data series based on the data provided using d3 datum commands. The data will normally be an array of objects in with the following fields, however the RSI component only uses the `date` and `close` fields, so negating other fields will not result in errors.

+ *date*: The date and time of the data point
+ *open*: The open price
+ *close*: The close price
+ *high*: The maximum price reached in this period
+ *low*: The minimum price reached in this period
+ *volume*: The total market volume for this period

This data format is the data format output by the [dataGenerator](https://github.com/ScottLogic/d3-financial-components/tree/master/components/utilities) component.

**Return Value**

The function returns a d3 selection which can then be called against a d3 selection or appended. An example of this is shown in the code below.

###Example Code:

```javascript
var rsi = sl.indicators.rsi()
    .xScale(dateScale)
    .yScale(percentageScale)
    .lambda(0.94)
    .upperMarker(70)
    .lowerMarker(30)
    .samplePeriods(14);

plotArea.append('g')
    .datum(data)
    .call(rsi);
```
