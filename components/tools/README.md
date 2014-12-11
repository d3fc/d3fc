# fc.**tools**

+ [Annotation](#annotation)
+ [Callouts](#callouts)
+ [Crosshairs](#crosshairs)
+ [Fibonacci fan](#fibonacci-fan)
+ [Measure](#measurement-tool)

## Annotation

This component draws a horizontal marker on the chart at a given yValue. The marker has a label and can be styled using CSS.

The component is comprised of the following SVG elements:

* A horizontal line which reaches the full width of the chart.
* A label for the horizontal marker.

fc.tools.**annotation**()

Constructs a new instance of the annotation component.

```javascript
var annotation = fc.tools.annotation()
  .xScale(chart.dateScale)
  .yScale(chart.priceScale)
  .yValue(100)
  .yLabel('Annotation')
  .formatCallout(function(d) { return d3.format('.1f')(d); });
```

**annotation**()

This initialises all the SVG elements the annotation component requires.

```javascript
chart.plotArea.call(annotation);
```

annotation.**index**([*value*])

Specifies the index of this annotation to make the annotation referenceable when more than one annotation is included on the same chart.

annotation.**xScale**([*value*])

Specifies the X scale which the annotation component uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

annotation.**yScale**([*value*])

Specifies the Y scale which the annotation component uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

annotation.**yValue**([*value*])

Specifies a value indicating the location of the annotation on the y axis.

annotation.**yLabel**([*value*])

Specifies the label for the annotation. The label will always represent a prefix to the value returned by the `formatCallout()` function. 
If you only require the label to be shown with no callout you can specify a function which return an empty string as a parameter to the `formatCallout()` function. 

annotation.**formatCallout**([*value*])

Specifies the callback function to use when formatting the values on the annotation.
If not specified, returns the current format callback function, which defaults to `function(d) { return d; }`.

annotation.**padding**([*value*])

Specifies the padding of the annotation labels, in pixels.
If not specified, returns the current padding, which defaults to 2px.

----

## Callouts

This component draws a number of callouts on the chart. Callouts are labels which indicate a specific piece of information at a specific point on the chart.
Callouts can specify almost any value or just be used as a marker for a point. The callouts can be styled using CSS. 
The callouts component will try and maintain distance between each callout using a 'Greedy Algorithm'.

fc.tools.**callouts**()

Constructs a new instance of the callouts component. Each callout is created by adding the data structure for that callout to the callouts component.
Each callout object consists of a label and an x and y position in domain values. 
The component calculates the pixel locations for each callout using the x and y scales passed in during creation.

```javascript
var callouts = fc.tools.callouts()
  .xScale(chart.dateScale)
  .yScale(chart.priceScale)
  .rounded(8)
  .addCallout( {
    x: dataSeries1[10].date,
    y: dataSeries1[10].high,
    label: 'Data point 10 high'
  })
  .addCallout( {
    x: dataSeries1[15].date,
    y: dataSeries1[15].low,
    label: 'Data point 15 low'
  });
```

**callouts**()

This initialises all the SVG elements the annotation callouts requires.

```javascript
chart.plotArea.append('g')
  .attr("class", "callouts")
  .call(callouts);
```

callouts.**addCallout**([*value*])

Allows a new callout data structure to be added to the component, causing an additional callout to be drawn. 
The structure of the callout is an object containing label, x and y fields, where x and y are values in the domain of the data in the chart.

callouts.**xScale**([*value*])

Specifies the X scale which the callouts component uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

callouts.**yScale**([*value*])

Specifies the Y scale which the callouts component uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

callouts.**padding**([*value*])

Specifies the padding of the callouts labels, in pixels.
If not specified, returns the current padding, which defaults to 5px.

callouts.**spacing**([*value*])

Specifies the spacing between the callouts labels, in pixels.
If not specified, returns the current spacing, which defaults to 5px.

callouts.**rounded**([*value*])

Specifies the radius fo the callouts label corners, in pixels.
If not specified, returns the current spacing, which defaults to 0.

callouts.**rotationStart**([*value*])
callouts.**rotationSteps**([*value*])

Callouts are arranged about the point of interest. In order that the callout does not overlap the actual point you are looking at the are arranged in a circle around the point. 
The distribution of the callouts is dictated by the `rotationStart` and `rotationSteps` values. 
Labels are positioned at clockwise angle `rotationSteps` from `rotationStart` where angle 0 is straight up (in the direction of the Y axis) on the chart.
If not specified, returns the current rotationStart, which defaults to 20 degrees.

callouts.**css**([*value*])

Specifies and optional custom stylesheet for the callouts component.
If not specified, returns the current custom stylesheet, which defaults to 'callout'.

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

fc.tools.**crosshairs**()

Constructs a new instance of the crosshairs component.

```javascript
var crosshairs = fc.tools.crosshairs()
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

fc.tools.**fibonacciFan**()

Constructs a new instance of the Fibonacci fan component.

```javascript
fibonacci = fc.tools.fibonacciFan()
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

This component allows the user to draw a ruler on to a chart.
For teh ruler, a line is drawn between two points, then two axis aligned lines are drawn showing measurments on the Y axis and X axis for the give points.
When added, the component exists in one of three phases:

* In the first phase, a circle is drawn around the data point closest to the mouse (the **origin**); a mouse click advances the component to the next phase.
* In the second phase, a second circle is drawn around the data point closest to the mouse (the **target**) and a line is drawn between it and the origin point; a mouse click advances the component to the final phase.
* In the final phase, the two axis aligned lines are drawn showing measurements on the Y axis and X axis; a mouse click hides the ruler and returns the component to the first phase.

The component comprises the following SVG elements:

* Two circles to mark the origin and target points.
* A line between these points.
* Two lines which show the x and y components of the measurement.
* Two labels which show the x and y components of the measurement.

fc.tools.**measure**()

Constructs a new instance of the measure component.

```javascript
var measure = fc.tools.measure()
  .target(chart.plotArea)
  .series(dataSeries1)
  .xScale(chart.dateScale)
  .yScale(chart.priceScale)
  .formatH(function(d) { return d3.format('.2f')(d); });
  .formatV(function(d) { return d3.format('.2f')(d); });
```

The measurement tool also requires an overlay in order that mouse events are captured efficiently. This overlay can be created using the code below.

```javascript
var overlay = d3.svg.area()
  .x(function (d) { return chart.dateScale(d.date); })
  .y0(0)
  .y1(chart.layout.innerHeight());
```

**measure**()

This initialises all the SVG elements the measure component requires.
You must have set the `target` property before calling this function.

```javascript
chart.plotArea.append('path')
  .attr('class', 'overlay')
  .attr('d', overlay(dataSeries1))
  .call(measure);
```

measure.**update**()

This function causes the measure component to be redrawn.
The X and Y co-ordinates at which the various SVG elements should be drawn are recalculated.
This is useful if, for example, the underlying chart is panned or zoomed.

measure.**visible**(*value*)

Makes the measure visible or invisible.

* Call this function with a `value` of `false` to hide the measure component's SVG elements.
* Call this function with a `value` of `true` to show the measure component if it is currently hidden.

When showing the component, only the SVG elements that should be shown will be made visible.

measure.**target**([*value*])

Specifies the target element on which the measure component will be displayed.
If not specified, returns the current target element, which defaults to `null`.

measure.**series**([*value*])

Specifies the data series which the measure component's line will snap to.
If not specified, returns the current data series, which defaults to `null`.

measure.**xScale**([*value*])

Specifies the X scale which the measure component uses to locate its SVG elements.
If not specified, returns the current X scale, which defaults to an unmodified `d3.time.scale`.

measure.**yScale**([*value*])

Specifies the Y scale which the measure component uses to locate its SVG elements.
If not specified, returns the current Y scale, which defaults to an unmodified `d3.scale.linear`.

measure.**active**([*value*])

Specifies a value indicating whether the measure component will respond to mouse events.
If not specified, returns the current state, which defaults to `true`.

measure.**padding**([*value*])

Specifies the padding of the measure component labels, in pixels.
If not specified, returns the current padding, which defaults to 2px.

measure.**formatH**([*value*])

Specifies the callback function to use when formatting the values on the horizontal axis.
If not specified, returns the current format callback function, which defaults to `function(d) { return d; }`.

measure.**formatV**([*value*])

Specifies the callback function to use when formatting the values on the vertical axis.
If not specified, returns the current format callback function, which defaults to `function(d) { return d; }`.

----