# fc.**utilities**

+ [Data Generator](#fcutilitiesdatagenerator)
+ [Chart Layout](#chart-layout)
+ [Weekday](#fcutilitiesweekday)


## fc.utilities.dataGenerator()

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

+ [fc.js](https://github.com/ScottLogic/d3-financial-components)

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
var data = fc.utilities.dataGenerator()
  .mu(0.1)
  .sigma(0.1)
  .startingPrice(100)
  .intraDaySteps(50)
  .fromDate(new Date(2013, 10, 1))
  .toDate(new Date(2014, 10, 30))
  .filter(function (date) { return !(date.getDay() === 0 || date.getDay() === 6); })
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
+ Create groups for the axes

Given a `div` to contain the chart:

```html
<div id="chart"></div>
```

The following code:

```javascript
// Setup the chart layout
var layout = fc.utilities.chartLayout();

// Setup the chart
var setupArea = d3.select('#chart')
    .call(layout);
```

Will create and position the elements for the chart:

```html
<div id="chart">
    <svg width="1330" height="440">
        <g class="chartArea" transform="translate(20,20)">
            <defs>
                <clipPath id="plotAreaClip">
                    <rect width="1290" height="400"></rect>
                </clipPath>
            </defs>
            <rect class="background" width="1290" height="400"></rect>
            <g clip-path="url(#plotAreaClip)" class="plotArea"></g>
            <g class="axis bottom" transform="translate(0,400)"></g>
            <g class="axis top" transform="translate(0, 0)"></g>
            <g class="axis left" transform="translate(0, 0)"></g>
            <g class="axis right" transform="translate(1290, 0)"></g>
        </g>
    </svg>
</div>
```

### API Reference

fc.utilities.**chartLayout**()

Constructs the chartLayout component, with default values.

**chartLayout**(_selection_)

Apply the chartLayout to a [selection](https://github.com/mbostock/d3/wiki/Selections). (Commonly  a `div`.) The chartLayout component can only be applied to the first element in a selection, all other elements will be ignored.

If the width or height have not been set, for example:

```javascript
// Create the chartLayout (width and height not set)
var chartLayout = fc.utilities.chartLayout();

// Setup the chart
// Height and width automatically calculated from chartLayout of #chart 
var setupArea = d3.select('#chart')
    .call(chartLayout);
```

Then the width and height of the chartLayout will try to expand to the dimensions of the selected element. If this results in an invalid value, i.e. less than 1, a default value will be used.

chartLayout.**marginTop**([_value_])

If _value_ is specified, sets the top margin and returns the chartLayout; if _value_ is not specified, returns the top margin.

chartLayout.**marginRight**([_value_])

If _value_ is specified, sets the right margin and returns the chartLayout; if _value_ is not specified, returns the right margin.

chartLayout.**marginBottom**([_value_])

If _value_ is specified, sets the bottom margin and returns the chartLayout; if _value_ is not specified, returns the bottom margin.

chartLayout.**marginLeft**([_value_])

If _value_ is specified, sets the left margin and returns the chartLayout; if _value_ is not specified, returns the left margin.

chartLayout.**width**([_value_])

If _value_ is specified, sets the width and returns the chartLayout; if _value_ is not specified, returns the width.

chartLayout.**height**([_value_])

If _value_ is specified, sets the height and returns the chartLayout; if _value_ is not specified, returns the height.

chartLayout.**innerWidth**()

Returns the width of the chart minus the horizontal margins.

chartLayout.**innerHeight**()

Returns the height of the chart minus the vertical margins.

chartLayout.**getSVG**(_setupArea_) {

Returns the SVG for the chart.

chartLayout.**getChartArea**(_setupArea_)

Returns the chart's chart area. Typically axes will be added to the chart area.

chartLayout.**getPlotArea**(_setupArea_)

Returns the chart's plot area. The plot area has a clipping path, so this is typically where series and indicators will be added.

chartLayout.**getAxisContainer**(_setupArea_, _orientation_)

Returns the container for a specified axis. Orientation is the position relative to the chart, valid values are the following strings: `'bottom'`, `'top'`, `'left'` and `'right'`.

chartLayout.**getPlotAreaBackground**(_setupArea_)

Returns the chart's background for the plot area.

### Example Usage

Attempt to size the chart to the selected element, by not specifying the width or height; use default margins:

```javascript
// Setup the chart layout
var layout = fc.utilities.chartLayout();

// Setup the chart
var setupArea = d3.select('#chart')
    .call(layout);
```

Attempt to size the chart to the width of the selected element; use specified height and margins, and add an axis to the chart:

```javascript
// Setup the chart layout
var layout = fc.utilities.chartLayout()
    .height(380)
    .marginTop(25)
    .marginRight(40)
    .marginBottom(30)
    .marginLeft(40);

// Setup the chart
var setupArea = d3.select('#chart')
    .call(layout);

// Add an axis to the bottom of the chart
var bottomAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(5);
chartLayout.getAxisContainer(setupArea, 'bottom').call(bottomAxis);
```
### CSS

The chart's background can be styled using CSS:

```CSS
.chartArea rect.background
```

------

## fc.utilities.weekday

Information and code examples here
