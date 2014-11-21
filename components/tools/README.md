# sl.**tools**

+ [Annotation](#sltoolsannotation)
+ [Crosshairs](#crosshairs)
+ [Fibonacci fan](#fibonacci-fan)
+ [Measure](#sltoolsmeasure)

## sl.tools.annotation

Information and code examples here

----

## Crosshairs

This component draws a crosshairs on a target element.
The crosshairs can be made to snap to a particular field on the data model, but by default will snap to any field.
By default the component will become fixed at its current position in response to a mouse click event, and unfrozen in response to a second click.

The component is comprised of the following SVG elements:

* A circle around the snapped data field (CSS: `circle.crosshairs.circle`)
* A horizontal crosshair line which reaches the full width of the target control (CSS: `line.crosshairs.horizontal`)
* A vertical crosshair line which reaches the full height of the target control (CSS: `line.crosshairs.vertical`)
* A label for the horizontal crosshair (CSS: `text.crosshairs.callout.horizontal`)
* A label for the vertical crosshair (CSS: `text.crosshairs.callout.vertical`)

sl.tools.**crosshairs**()

Constructs a new instance of the crosshairs component.

```javascript
var crosshairs = sl.tools.crosshairs()
		        .target(plotArea)
		        .series(data)
		        .xScale(x)
		        .yScale(y);
```

**crosshairs**()

This initialises all the SVG elements the crosshairs component requires.
You must have set the `target` property before calling this function.

```javascript
plotArea.call(crosshairs);
```

crosshairs.**update**()

This function causes the crosshairs component to be redrawn.
The X and Y co-ordinates at which the component should be drawn are recalculated.
If the SVG elements which comprise the component are currently hidden, they are made visible.
This is useful if, for example, the underlying chart is panned or zoomed.

crosshairs.**clear**()

This function hides the SVG elements that comprise the crosshairs component.

crosshairs.**target**([*value*])

Specifies the target element on which the crosshairs will be displayed.
If not specified, returns the current target element, which defaults to `null`.

crosshairs.**series**([*value*])

Specifies the data series which the crosshairs will snap to.
If not specified, returns the current data series, which defaults to `null`.

crosshairs.**xScale**([*value*])

Specifies the X scale which the crosshairs component uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

crosshairs.**yScale**([*value*])

Specifies the Y scale which the crosshairs component uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

crosshairs.**yValue**([*value*])

Specifies the data field which the crosshairs component will attempt to snap to.
If this property is set to `null`, the component will snap to the closest data field to the mouse.
If not specified, returns the current data field, which defaults to `null`.

crosshairs.**formatH**([*value*])

Specifies the callback function to use when formatting the label on the horizontal crosshair.
This function should take two parameters: the data object the crosshairs are currently over and the name of the field the crosshairs are snapped to.
If not specified, returns the current format callback function, which defaults to `null`.

```javascript
crosshairs.formatH(function(d, field) { return field + " : " + d3.format('.1f')(d); });
```

crosshairs.**formatV**([*value*])

Specifies the callback function to use when formatting the label on the vertical crosshair.
This function should take one parameter: the date field of the data object the crosshairs are currently over.
If not specified, returns the current format callback function, which defaults to `null`.

```javascript
crosshairs.formatV(function(date) { return d3.time.format('%b %e')(date); })
```

crosshairs.**active**([*value*])

Specifies a value indicating whether the crosshairs component will respond to mouse events.
If not specified, returns the current state, which defaults to `true`.

crosshairs.**freezable**([*value*])

Specifies a value indicating whether the crosshairs component will 'freeze' in place in response to a mouse click event.
If not specified, returns the current state, which defaults to `true`.

crosshairs.**padding**([*value*])

Specifies the padding of the crosshair labels, in pixels.
If not specified, returns the current padding, which defaults to 2px.

----

## Fibonacci Fan

This component allows the user to draw a Fibonacci fan onto a chart.
For a Fibonacci fan, a trend line is drawn between two points, then three fan lines are drawn from the leftmost point to the rightmost edge of the chart at gradients of 38.2%, 50% and 61.8% of the trend line's gradient.
When added, the component exists in one of three phases:

* In the first phase, a circle is drawn around the data point closest to the mouse (the **origin**); a mouse click advances the component to the next phase.
* In the second phase, a second circle is drawn around the data point closest to the mouse (the **target**) and a trend line is drawn between it and the origin point; a mouse click advances the component to the final phase.
* In the final phase, the three fan lines are drawn from the origin point to the edge of the chart; a mouse click hides the fan and returns the component to the first phase.

The component comprises the following SVG elements:

* Two circles to mark the origin and target points (CSS: `circle.fibonacci-fan.origin` and `circle.fibonacci-fan.target`)
* A trend line between these points (CSS: `line.fibonacci-fan.source`)
* Three lines which together make up the fan itself (CSS: `line.fibonacci-fan.a`, `line.fibonacci-fan.b` and `line.fibonacci-fan.c`)
* A polygon to make up the area inside the fan (CSS: `polygon.fibonacci-fan.area`)

sl.tools.**fibonacciFan**()

Constructs a new instance of the Fibonacci fan component.

```javascript
fibonacci = sl.tools.fibonacciFan()
                .target(plotArea)
                .series(data)
                .xScale(x)
                .yScale(y);
```

**fibonacciFan**()

This initialises all the SVG elements the fan component requires.
You must have set the `target` property before calling this function.

```javascript
plotArea.call(fibonacci);
```

fibonacciFan.**update**()

This function causes the fan component to be redrawn.
The X and Y co-ordinates at which the various SVG elements should be drawn are recalculated.
This is useful if, for example, the underlying chart is panned or zoomed.

fibonacciFan.**visible**(*value*)

Makes the fan visible or invisible.

* Call this function with a `value` of `false` to hide the fan's SVG elements.
* Call this function with a `value` of `true` to show the fan if it is currently hidden.

When showing the component, only the SVG elements that should be shown will be made visible.

fibonacciFan.**target**([*value*])

Specifies the target element on which the fan will be displayed.
If not specified, returns the current target element, which defaults to `null`.

fibonacciFan.**series**([*value*])

Specifies the data series which the fan's trend line will snap to.
If not specified, returns the current data series, which defaults to `null`.

fibonacciFan.**xScale**([*value*])

Specifies the X scale which the fan component uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

fibonacciFan.**yScale**([*value*])

Specifies the Y scale which the fan component uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

fibonacciFan.**active**([*value*])

Specifies a value indicating whether the fan component will respond to mouse events.
If not specified, returns the current state, which defaults to `true`.

----

## Measurement Tool

The measurement tool allows the difference between two times and prices to be measured by drawing a line between two points on the data series (the measurement tool snaps to points).

The procedure for measuring values is below:

+ Move the cursor over the first point and click.
+ Drag the line to the second point.
+ Read the values from the Y and X axes.
+ Click to freeze the measurement on the chart.
+ Click to clear the measurement and start again.

### API Reference

#### sl.tools.measure()

Constructs the measurement component, with default values.

#### measure()

