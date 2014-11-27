# fc.**series**

+ [Candlestick](#candlestick-series)
+ [Comparison](#comparison-series)
+ [OHLC](#ohlc-series)
+ [Line](#line-series)
+ [Volume](#volume-series)

## Candlestick Series

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

**candlestick**(selection)

Draws the candlestick series on a selection. The selection must contain an `svg` or `g` element. For example:

```javascript
plotArea.append('g')
    .attr('class', 'series')
    .datum(data)
    .call(candlestick);
```

The datum function is passed the data for the series. The data is an array of objects consistent with the output of the [dataGenerator component](../utilities/#slutilitiesdatagenerator).

candlestick.**xScale**([*value*])

Specifies the X scale which the component uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to `d3.time.scale`.

candlestick.**yScale**([*value*])

Specifies the Y scale which the component uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to `d3.scale.linear`.

candlestick.**rectangleWidth**([*value*])

Specifies the width of the candle bodies in the data series. If not specified the value defaults to 5.

### CSS

A number of CSS classes are used when generating the data series to allow the series to be styled. These classes are detailed below with a brief description of their use.

+ `g.candlestick-series` the class for the group object that contains the entire data series.
+ `g.candlestick-series g.bar` the class for the group object that contains the svg elements for each candle.
+ `g.candlestick-series g.down-day` the override class which overrides the candle style based on the candles direction (Down, usually Red).
+ `g.candlestick-series g.up-day` the override class which overrides the candle style based on the candles direction (Up, usually Green).
+ `g.candlestick-series g.bar path.high-low-line` the class for the candle centre line, usually called the wick.
+ `g.candlestick-series g.bar rect` the class for the rectangle itself.

The structure of the elements generated is shown below:

```html
<g class="candlestick-series">
    <g class="bar down-day">
        <path class="high-low-line"></path>
        <rect></rect>
    </g>
    <g class="bar up-day">
        <path class="high-low-line"></path>
        <rect></rect>
    </g>
</g>

```

------

## Comparison Series

Documentation Pending

------

## OHLC Series

Draws a series of open-high-low-close bars.

fc.series.**ohlc**([*method*])

Constructs a new OHLC series component instance. If *method* is supplied, sets the method used to draw the bars. Three different drawing methods are supported:

* `"path"` - Each OHLC bar is drawn as a single SVG path element. Balanced performance / flexibility.
* `"line"` - Each OHLC bar is a group of three line elements. Worst performing under zoom, but could be useful if you wish to style or animate the open/close ticks independently of the high/low lines.
* `"paths"` - The whole series is drawn with a total of three SVG path elements (all 'up' days, all 'down' days, and all 'static' days). Best performing under zoom, but least flexible. For example, using this method, you won't be able to add event listeners to individual bars.

If *method* is not supplied, the component defaults to the "path" drawing method.

**ohlc**(selection)

Draws the ohlc bars on a selection.

ohlc.**xScale**([*value*])

If *value* is specified, sets the X scale which the component uses to position its SVG elements.
If not specified, returns the current X scale, which defaults to `d3.time.scale`.

ohlc.**yScale**([*value*])

If *value* is specified, sets the Y scale which the component uses to position its SVG elements.
If not specified, returns the current Y scale, which defaults to `d3.scale.linear`.

ohlc.**tickWidth**([*value*])

If *value* is specified, sets the width from the high/low line of the up/down day ticks.
If not specified, returns the current width, which defaults to 5 pixels.

### CSS

You can style the ohlc bars using CSS.

+ `.ohlc-series .bar .up-day` for the 'up day' bars.
+ `.ohlc-series .bar .down-day` for the 'down day' bars.
+ `.ohlc-series .bar .static-day` for the 'static day' bars.

When using the `"paths"` drawing method:
+ `.ohlc-series .up-days` for the 'up day' bars.
+ `.ohlc-series .down-days` for the 'down day' bars.
+ `.ohlc-series .static-days` for the 'static day' bars.

The structure of the elements produced depends on the selected draw method:

* By default, or with `"path"` selected:
```html
<g class="ohlc-series">
    <path class="bar up-day"></path>
    <path class="bar down-day"></path>
    <path class="bar static-day"></path>
    <!-- ... 1 path for each bar -->
</g>
```
* With `"line"` selected:
```html
<g class="ohlc-series">
    <g class="bar up-day">
        <line class="high-low-line"></line>
        <line class="open-tick"></line>
        <line class="close-tick"></line>
    </g>
    <!-- ... 1 group for each bar -->
</g>
```
* With `"paths"` selected:
```html
<g class="ohlc-series">
    <path class="up-days"></path>
    <path class="down-days"></path>
    <path class="static-days"></path>
</g>
```

------

## Line Series

This component calculates and draws a line data series, the series shows price or any other linear values on the Y axis against Date/Time on the X axis.
The series has the option to be under filled and the series and under fill can be styled using CSS.

fc.series.**line**()

Constructs a new instance of the Line Series component.

```javascript
var line = fc.series.line()
                .xScale(x)
                .yScale(y)
                .yValue('close')
                .underFill(true);
```

**line**()

This adds the Line Series component to a chart. 

```javascript
plotArea.append('g')
    .attr('class', 'series')
    .datum(data)
    .call(line);
```

The datum function is passed the data for the series. The data is an array of objects. The field used to render the line is specified in the `yValue()` property. 
While the data set usually is of the form produced by the `fc.utilities.dataGenerator` component, any array of objects can be plotted so long as the object contains the field named in the `yValue()` property.

line.**xScale**([*value*])

Specifies the X scale which the component uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

line.**yScale**([*value*])

Specifies the Y scale which the component uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

line.**yValue**([*value*])

Specifies the name of the field in the object, whose value is used to render the series. The default value is 'close'.

line.**underFill**([*value*])

Is set to true or false depending on whether an under fill is required. If `true` an area will be created under the data series which can be styled using CSS. The default value is `true`.

### CSS

A number of CSS classes are used when generating the data series to allow the series to be styled. These classes are detailed below with a brief description of their use.

+ `path.lineSeries` the class for the data series line.
+ `path.lineSeriesArea` the class for the data series under fill area.

The structure of the elements generated is shown below:

```html
<g class="series">
    <path class="lineSeriesArea"></path>
    <path class="lineSeries"></path>
</g>

```

------

## Volume Data Series

This component calculates and draws a bar chart data series primarily for display market volume information, the series shows volume or any other linear values on the Y axis against Date/Time on the X axis.
The series can be styled using CSS to represent market gains or market losses in that time period.

fc.series.**volume**()

Constructs a new instance of the Volume component.

```javascript
var volume = fc.series.volume()
                .xScale(x)
                .yScale(y)
                .barWidth(5)
                .yValue('volume');
```

**volume**()

This adds the Volume component to a chart. 

```javascript
plotArea.append('g')
    .attr('class', 'series')
    .datum(data)
    .call(volume);
```

The datum function is passed the data for the series. The data is an array of objects consistent with the output of the [dataGenerator component](../utilities/#slutilitiesdatagenerator). The bars are rendered using the value from the `volume` field in each data object.

line.**xScale**([*value*])

Specifies the X scale which the component uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

line.**yScale**([*value*])

Specifies the Y scale which the component uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

line.**barWidth**([*value*])

Specifies the width of the volume bars in the data series. If not specified the value defaults to 5.

line.**yValue**([*value*])

Specifies the name of the data field which the series will show.
If not specified, returns the current data field, which defaults to `'volume'`.

### CSS

A number of CSS classes are used when generating the data series to allow the series to be styled. These classes are detailed below with a brief description of their use.

+ `g.volume-series` the class for the group object that contains the entire data series.
+ `g.volume-series g.volumebar` the class for the group object that contains the svg elements for each bar.
+ `g.volume-series g.down-day` the override class which overrides the bar style based on the market direction (Down, usually Red).
+ `g.volume-series g.up-day` the override class which overrides the bar style based on the market direction (Up, usually Green).
+ `g.volume-series g.volumebar rect` the class for the rectangle itself.

The structure of the elements generated is shown below:

```html
<g class="volume-series">
    <g class="volumebar down-day">
        <rect></rect>
    </g>
    <g class="volumebar up-day">
        <rect></rect>
    </g>
</g>

```

