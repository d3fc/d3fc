# sl.**utilities**

+ [Data Generator](#slutilitiesdatagenerator)
+ [Weekday](#slutilitiesweekday)
+ [Dimensions](#dimensions)


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

+ [sl.js](https://github.com/tunerscafe/d3-financial-components/blob/master/components/sl.js)
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

####generate

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
  .generate();
```

------

## sl.utilities.**weekday**

Information and code examples here

------

## Dimensions

Based on the [Margin Convention](http://bl.ocks.org/mbostock/3019563), the dimensions component is responsible for defining the chart area.

It attempts to simplify the repetitive process of constructing the chart area:

+ Define the margins, height and width
+ Calculate the inner height and inner width
+ Create an SVG
+ Create a group for the chart; translate it based on the margins
+ Create a clipping path for the plot area; add it to the group

### API

#### sl.ultities.dimensions()

Constructs the dimensions component, with default values.

#### dimensions(selection)

Apply the dimensions to a [selection](https://github.com/mbostock/d3/wiki/Selections). (Commonly  a `div`.) The dimensions component can be applied to one or more elements.

If the width or height have not been set, for example:

```js
// Create the dimensions
var dimensions = sl.utility.dimensions();

// Setup the chart
// Height and width automatically calculated from dimensions of #chart 
var setupArea = d3.select('#chart')
    .call(dimensions);
```

Then the width and height of the dimensions will try to expand to the dimensions of the selected element, respectively. If this results in an invalid value, i.e. less than 0, a default value will be used.

#### dimensions.marginTop(value)

If _value_ is specified, sets the top margin and returns the dimensions; if _value_ is not specified, returns the top margin.

#### dimensions.marginRight(value)

If _value_ is specified, sets the right margin and returns the dimensions; if _value_ is not specified, returns the right margin.

#### dimensions.marginBottom(value)

If _value_ is specified, sets the bottom margin and returns the dimensions; if _value_ is not specified, returns the bottom margin.

#### dimensions.marginLeft(value)

If _value_ is specified, sets the left margin and returns the dimensions; if _value_ is not specified, returns the left margin.

#### dimensions.width(value)

If _value_ is specified, sets the width and returns the dimensions; if _value_ is not specified, returns the width.

#### dimensions.height(value)

If _value_ is specified, sets the height and returns the dimensions; if _value_ is not specified, returns the height.

#### dimensions.innerWidth()

Returns the width of the chart minus the horizontal margins.

#### dimensions.innerHeight()

Returns the height of the chart minus the vertical margins.

### Example Usage

```js
// Setup the dimensions
  var dimensions = sl.utility.dimensions()
      .marginBottom(30)
      .marginLeft(50)
      .width(660)
      .height(400);

  // Setup the chart
  var setupArea = d3.select('#chart')
      .call(dimensions);

  // Select the elements which we may want to use
  var svg = setupArea.select('svg'),
      chart = svg.select('g'),
      plotArea = chart.select('.plotArea');
```