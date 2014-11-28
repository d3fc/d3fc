# fc.**scale**

+ [Finance Scale](#finance-scale)
+ [Pixel Aligned Linear Scale](#pixel-aligned-linear-scale)
+ [Gridlines](#gridlines)

## Finance Scale

This component provides a scale primarily used on the X axis of financial charts which is based on a time scale but allows for the removal of time periods where the market may be closed, namely weekends. 
This scale also contains an option to pixel align when calculating the screen pixel from the real value. This generally produces crisper graphics.

fc.scale.**finance**()

Constructs a new instance of the Finance Scale component.

```javascript
var financeScale = fc.scale.finance()
		.domain([dateFrom, dateTo])
		.range([0, chartInnerWidth]);
```

**financeScale**()

This creates a D3 axis from the scale and applies it to the chart.

```javascript
var dateAxis = d3.svg.axis()
		.scale(financeScale)
		.orient('bottom')
		.ticks(5);

chart.append('g')
		.attr('class', 'axis date')
		.attr('transform', 'translate(0,' + chartInnerHeight + ')')
		.call(dateAxis);
```

financeScale.**scale**([*value*])

Converts a real world value (domain value) in to a pixel value based on the parameters defined for the scale.

financeScale.**copy**()

Used to duplicate this scale object.

financeScale.**domain**([*value*])

Sets the range of real world values covered by this scale. Parameter is an array of two values representing scale minimum and scale maximum.

financeScale.**ticks**([*value*])

Returns or sets approximately count representative values from the scale's input domain. If count is not specified, it defaults to 10.

financeScale.**tickFormat**([*value*])

Returns or sets a number format function suitable for displaying a tick value.

financeScale.**invert**([*value*])

Converts a pixel value in to a real world value (domain value) based on the parameters defined for the scale.

financeScale.**alignPixels**([*value*])

Forces ticks retuned or conversions using the scale function to return values rounded to the nearest 0.5 of a pixel, this causes any strokes drawn to be pixel aligned and not blurred by the antialiasing.

### CSS

A number of CSS classes are used when generating the scale to allow the scale elements to be styled. These classes are detailed below with a brief description of their use.

+ `.axis` the class for the group object that contains all axis elements.
+ `.axis .tick line` the class which styles the axis tick lines.
+ `.axis .tick text` the class which styles the axis tick labels (text elements).

The structure of the elements generated is shown below:

```html
<g class="axis">
	<g class="tick">
		<line></line>
		<text></text>
	</g>
	<path class="domain"></path>
</g>

```
------

## Pixel Aligned Linear Scale

This component provides a scale primarily used on the y axis of financial charts which is based on a d3.scale.linear but contains an option to pixel align when calculating the screen pixel from the real value. This generally produces crisper graphics.

fc.scale.**linear**()

Constructs a new instance of the Linear Scale component.

```javascript
var linearScale = fc.scale.linear()
		.domain([dateFrom, dateTo])
		.range([0, chartInnerWidth]);
```

**linearScale**()

This creates a D3 axis from the scale and applies it to the chart.

```javascript
var priceAxis = d3.svg.axis()
		.scale(linearScale)
		.orient('bottom')
		.ticks(5);

chart.append('g')
		.attr('class', 'axis price')
		.attr('transform', 'translate(0,' + chartInnerHeight + ')')
		.call(priceAxis);
```

linearScale.**scale**([*value*])

Converts a real world value (domain value) in to a pixel value based on the parameters defined for the scale.

linearScale.**copy**()

Used to duplicate this scale object.

linearScale.**domain**([*value*])

Sets the range of real world values covered by this scale. Parameter is an array of two values representing scale minimum and scale maximum.

linearScale.**ticks**([*value*])

Returns or sets approximately count representative values from the scale's input domain. If count is not specified, it defaults to 10.

linearScale.**tickFormat**([*value*])

Returns or sets a number format function suitable for displaying a tick value.

linearScale.**invert**([*value*])

Converts a pixel value in to a real world value (domain value) based on the parameters defined for the scale.

linearScale.**alignPixels**([*value*])

Forces ticks retuned or conversions using the scale function to return values rounded to the nearest 0.5 of a pixel, this causes any strokes drawn to be pixel aligned and not blurred by the antialiasing.

### CSS

A number of CSS classes are used when generating the scale to allow the scale elements to be styled. These classes are detailed below with a brief description of their use.

+ `.axis` the class for the group object that contains all axis elements.
+ `.axis .tick line` the class which styles the axis tick lines.
+ `.axis .tick text` the class which styles the axis tick labels (text elements).

The structure of the elements generated is shown below:

```html
<g class="axis">
	<g class="tick">
		<line></line>
		<text></text>
	</g>
	<path class="domain"></path>
</g>

```

------

## Gridlines

This component draws gridlines on the chart based on the chart scales tick positions unless new tick positions are specified using the xTicks and yTicks properties.

fc.scale.**gridlines**()

Constructs a new instance of the Gridlines component.

```javascript
var gridlines = fc.scale.gridlines()
        .xScale(dateScale)
        .yScale(priceScale)
        .xTicks(10);
```

**gridlines**()

This initialises all the SVG elements the gridlines component requires.

```javascript
plotArea.call(gridlines);
```

gridlines.**xScale**([*value*])

Returns or sets the scale which is used by the X axis to calculate the vertical grid line positions.

gridlines.**yScale**([*value*])

Returns or sets the scale which is used by the Y axis to calculate the horizontal grid line positions.

gridlines.**xTicks**([*value*])

Returns or sets approximately count representative values from the X scale's input domain for the vertical grid lines. If count is not specified, it defaults to 10.

gridlines.**yTicks**([*value*])

Returns or sets approximately count representative values from the Y scale's input domain for the horizontal grid lines. If count is not specified, it defaults to 10.

### CSS

A number of CSS classes are used when generating the gridlines to allow the lines to be styled. These classes are detailed below with a brief description of their use.

+ `.gridlines` the class for the group object that contains all gridlines.
+ `.gridlines .x` the class which styles the vertical lines.
+ `.gridlines .y` the class which styles the horizontal lines.

The structure of the elements generated is shown below:

```html
<g class="gridlines">
	<line class="x"></line>	
	<line class="y"></line>
</g>

```

