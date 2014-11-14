# sl.**utilities**

+ [Data Generator](#slutilitiesdatagenerator)
+ [Chart Layout](#chart-layout)
+ [Weekday](#slutilitiesweekday)


## sl.utilities.dataGenerator()

This component will generate some 'fake' daily price data to use when developing charts using these components. The generator uses the [Geometric Brownian motion](http://en.wikipedia.org/wiki/Geometric_Brownian_motion) model to generate price data points and a standard randomisation to generate volume values.

```javascript
// Geometric Brownian motion model.
var deltaY = period / steps,

sqrtDeltaY = Math.sqrt(deltaY),

deltaW = jStat()
    .randn(1, steps)
    .multiply(sqrtDeltaY),

increments =  deltaW
    .multiply(sigma)
    .add((mu - ((sigma * sigma) / 2)) * deltaY),

expIncrements = increments.map(function (x) { return Math.exp(x); });
```

**Dependencies**

The dependencies for this component are injected using [require.js](http://requirejs.org/) but shoudl require.js not be used you will need to include the following dependencies:

+ [sl.js](https://github.com/ScottLogic/d3-financial-components)
+ [moment.js](http://momentjs.com/)
+ [moment-range.js](https://github.com/gf3/moment-range)
+ [jstat.js](https://github.com/jstat/jstat)

###Properties:

**mu** - The 'mu' parameter for the Geometric Brownian motion algorithm.

**sigma** - The 'sigma' parameter for the Geometric Brownian motion algorithm.

**startingPrice** - The price of the first data point generated.

**intraDaySteps** - The number of price values generated for each day candle.

**filter** - This property receives a function which will filter out dates which would not exist in a real world situation, i.e. when the market is closed. And example filter to filter weekends is shown below:

```javascript
function (moment) { return !(moment.day() === 0 || moment.day() === 6); }
```

**toDate** - The last date and time (Date object) that data is generated for.

**fromDate** - The first date and time (Date object) that data is generated for.

###Methods:

####generate()

Generates the data based on the current properties and returns an object array.

**Return Value**

The function returns an array of objects each of which contains the following members:

+ *date*: The date and time of the data point
+ *open*: The open price
+ *close*: The close price
+ *high*: The maximum price reached in this period
+ *low*: The minimum price reached in this period
+ *volume*: The total market volume for this period

###Example Code:

```javascript
var data = sl.utilities.dataGenerator()
  .mu(0.1)
  .sigma(0.1)
  .startingPrice(100)
  .intraDaySteps(50)
  .fromDate(new Date(2013, 10, 1))
  .toDate(new Date(2014, 10, 30))
  .filter(function (moment) { return !(moment.day() === 0 || moment.day() === 6); })
  .generate();
```

------


## Chart Layout

Based on the [Margin Convention](http://bl.ocks.org/mbostock/3019563), the chart layout component is responsible for defining the chart area.

It attempts to simplify the repetitive process of constructing the chart area:

+ Define the margins, height and width
+ Calculate the inner height and inner width
+ Create an SVG
+ Create a group for all chart elements; translate it based on the margins
+ Create a clipping path for the plot area; add it to the group

### API Reference

#### sl.utilities.chartLayout()

Constructs the chartLayout component, with default values.

#### chartLayout(selection)

Apply the chartLayout to a [selection](https://github.com/mbostock/d3/wiki/Selections). (Commonly  a `div`.) The chartLayout component can be applied to one or more elements.

If the width or height have not been set, for example:

```javascript
// Create the chartLayout (width and height not set)
var chartLayout = sl.utilities.chartLayout();

// Setup the chart
// Height and width automatically calculated from chartLayout of #chart 
var setupArea = d3.select('#chart')
    .call(chartLayout);
```

Then the width and height of the chartLayout will try to expand to the chartLayout of the selected element, respectively. If this results in an invalid value, i.e. less than 0, a default value will be used.

#### chartLayout.marginTop(value)

If _value_ is specified, sets the top margin and returns the chartLayout; if _value_ is not specified, returns the top margin.

#### chartLayout.marginRight(value)

If _value_ is specified, sets the right margin and returns the chartLayout; if _value_ is not specified, returns the right margin.

#### chartLayout.marginBottom(value)

If _value_ is specified, sets the bottom margin and returns the chartLayout; if _value_ is not specified, returns the bottom margin.

#### chartLayout.marginLeft(value)

If _value_ is specified, sets the left margin and returns the chartLayout; if _value_ is not specified, returns the left margin.

#### chartLayout.width(value)

If _value_ is specified, sets the width and returns the chartLayout; if _value_ is not specified, returns the width.

#### chartLayout.height(value)

If _value_ is specified, sets the height and returns the chartLayout; if _value_ is not specified, returns the height.

#### chartLayout.innerWidth()

Returns the width of the chart minus the horizontal margins.

#### chartLayout.innerHeight()

Returns the height of the chart minus the vertical margins.

### Example Usage

Explicitly define the height, width, bottom margin and left margin; use default top and right margins:

```javascript
// Setup the chart layout
var layout = sl.utilities.chartLayout()
    .marginBottom(30)
    .marginLeft(50)
    .width(660)
    .height(400);

// Setup the chart
var setupArea = d3.select('#chart')
    .call(layout);

// Select the elements which we may want to use
// Typically the axes will be added to the 'chart' and series to the 'plotArea'
var svg = setupArea.select('svg'),
    chart = svg.select('g'),
    plotArea = chart.select('.plotArea');
```

Attempt to size the chart to the selected element, by not specifying the width or height; use default margins:

```javascript
// Setup the chart layout
var layout = sl.utilities.chartLayout();

// Setup the chart
var setupArea = d3.select('#chart')
    .call(layout);

// Select the elements which we may want to use
// Typically the axes will be added to the 'chart' and series to the 'plotArea'
var svg = setupArea.select('svg'),
    chart = svg.select('g'),
    plotArea = chart.select('.plotArea');
```

Attempt to size the chart to the width of the selected element; use specified height and margins:

```javascript
// Setup the chart layout
var layout = sl.utilities.chartLayout()
  .height(380)
  .marginTop(25)
  .marginRight(40)
  .marginBottom(30)
  .marginLeft(40);

// Setup the chart
var setupArea = d3.select('#chart')
    .call(layout);

// Select the elements which we may want to use
// Typically the axes will be added to the 'chart' and series to the 'plotArea'
var svg = setupArea.select('svg'),
    chart = svg.select('g'),
    plotArea = chart.select('.plotArea');
```

------

## sl.utilities.weekday

Information and code examples here
