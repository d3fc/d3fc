# sl.**indicators**

+ [Bollinger Bands](#slindicatorsbollingerbands)
+ [Moving Average](#slindicatorsmovingaverage)
+ [Relative Strength Index](#slindicatorsrsi)


## sl.indicators.bollingerBands()

Information and code examples here

------

## sl.indicators.movingAverage()

Information and code examples here

----

## sl.indicators.rsi()

This component will generate an RSI data series on a chart based on data generated in the format produced by the dataGenerator component. The RSI algorithm is based on the accepted algorithm for RSI presented on [Wikipedia](http://en.wikipedia.org/wiki/Relative_strength_index).

**Dependencies**

The dependencies for this component are injected using [require.js](http://requirejs.org/) but shoudl require.js not be used you will need to include the following dependencies:

+ [d3.js](http://d3js.org/)
+ [sl.js](https://github.com/ScottLogic/d3-financial-components)

###Properties:

**xScale** - The 'xScale' property defines the scale used on the x (Time) axis.

**yScale** - The 'yScale' property defines the scale used on the Y axis. This is primarily for scaling values to pixels as the domain of this scale is almost always going to be 0-100.

**samplePeriods** - The 'samplePeriods' property defines the number of samples to take while calculating the Exponential Moving Average for the gains and losses. The default value is 14.

**upperMarker** - The 'upperMarker' property is used to set the postion of the upper marker line (over buy) on the chart. The default value is 70.

**lowerMarker** - The 'lowerMarker' property is used to set the postion of the lower marker line (over sell) on the chart. The default value is 30.

**lambda** - The 'lambda' property for the Exponential Moving Average. The default is 0.94, a value of 1.0 yields a Simple Moving Average.

**css** - The 'css' property for the chart.

###Methods:

####rsi()

Generates the RSI data series based on the data provided using d3 datum commands. The data should be a array of objects in with the following fields:

+ *date*: The date and time of the data point
+ *open*: The open price
+ *close*: The close price
+ *high*: The maximum price reached in this period
+ *low*: The minimum price reached in this period
+ *volume*: The total market volume for this period

This data format is the data format output by the dataGenerator component.

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
