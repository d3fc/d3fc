# Building a Chart

This brief tutorial introduces the core concepts behind D3FC, via the process of
building a chart. You'll find out why we created D3FC and what makes it
different from the numerous other charting libraries out there!

Here's the chart you're going to be building:

[<img src="https://d3fc.io/examples/building-a-chart/screenshot.png"/>](https://d3fc.io/examples/building-a-chart/)

It's a pretty conventional 'sales dashboard' chart, in this case showing some
fictional monthly sales data, with a couple of lines indicating targets.

But before we start putting this chart together, let's look at charting
libraries in a more general sense ...

## Charting APIs

Charts are complex UI components, they are designed to be highly flexible in
order to support a wide range of different chart types, styles and
configurations. However, this flexibility is most often presented as a complex
API of hundreds of classes and thousands of methods. Searching for the correct
configuration that will yield the result you are after is a challenge, and you
are heavily reliant on the designer of the chart having considered your use-case
to make that configuration possible.

D3 offers a fresh perspective, offering a different way to create charts and
visualisations. It is an expressive, yet low-level tool, that if wielded
correctly, can be used to create practically any visual representation you like.

There are a number of charting libraries built with D3, however these invariably
hide the underlying power of D3 behind the same-old complex and confusing APIs.

With D3FC our aim is to enhance D3 by providing a suite of powerful [charting
components](http://bost.ocks.org/mike/chart/) that make it easy for you to
assemble exactly the chart you want. These components 'speak the language' of
D3, supporting [selections](https://github.com/d3/d3-selection) and [data
joins](http://bl.ocks.org/mbostock/3808218). Furthermore, using the decorate
pattern, you can enhance and manipulate the way in which they are rendered.

With D3FC components you can quickly assemble bespoke charts, without hiding the
power of D3.

## Creating the data

Typically chart data will be supplied by some external source, in JSON or CSV
format. For the purposes of this example we'll just generate some random data.
D3FC has a number of `data` utilities, including components that help construct
realistic random data. For this example we'll use the random Brownian motion
component to generate 12 datapoints, mapping them to create datapoints with
`sales` and `month` properties:

```js
// a random number generator
const generator = fc.randomGeometricBrownianMotion()
  .steps(11);

// some formatters
const dateFormatter = d3.timeFormat('%b');
const valueFormatter = d3.format('$.0f');

const yExtent = fc.extentLinear()
  .include([0])
  .pad([0, 0.5])
  .accessors([d => d.sales]);

const data = {
  // target values for the annotations
  targets: [{
    name: 'low',
    value: 4.5
  }, {
    name: 'high',
    value: 7.2
  }],
  // randomly generated sales data
  sales: generator(1).map((d, i) => ({
      month: dateFormatter(new Date(0, i + 1, 0)),
      sales: d + i / 2
  }))
};
```

## Rendering the data

The sales data is rendered as a bar chart. With D3 this typically involves
rendering paths or rectangles and doing a bit of maths to locate each bar
correctly, as illustrated in [Mike Bostock's excellent
tutorial](http://bost.ocks.org/mike/bar/).

D3FC has a bar series component (among others) that makes this task much easier.
To render the data, we create a bar series component and supply it with suitable
D3 scales, configure the `mainValue` and `crossValue` accessors (which the
component uses to extract the x and y values from the datapoints). Notice these
value accessors are prefixed `main` and `cross`, this is because d3fc-series
component support both horizontal and vertical orientations where the meanings
of x and y would be transposed.

The bar series is a regular D3 component, and is rendered via the `call` method
on a D3 selection:

```js
const bar = fc.autoBandwidth(fc.seriesSvgBar())
  .crossValue(d => d.month)
  .mainValue(d => d.sales)
  .align('left');
```

At this point you might like to read more about the [D3 component
pattern](http://bost.ocks.org/mike/chart/) that we follow with d3fc.

You can set the `bandwidth` directly on the D3FC bar series, or, as per this
example, adapt a series using the `autoBandwidth` component. This detects
whether the scale associated with the series exposes a `bandwidth` function, and
uses this to set the series band width automatically (hence the 'auto' name!).

I'll forgive you if you are not too impressed with the above example. So far
you've got a bar series, but no axes or labels, yet the example involves quite a
bit of code.

The reason for this is that the bar series component is relatively low-level
component, it renders a series and nothing more. (It's actually not the lowest
level of component, the bar series uses the bar shape component as part of its
own implementation). In order to quickly assemble a chart you need to make use
of a more high-level component ... a chart.

## Cartesian chart

The Cartesian chart component does a number of things, it constructs a suitable
layout (composed of div, d3fc-group and d3fc-svg elements), setting a suitable
range on the scales that you supply (it's still your job to set the domain on
each). The chart renders a pair of axes and, optionally, other cosmetic features
such as chart and axis labels.

You can render a series within the chart by setting it as the `svgPlotArea`. The
chart sets the x and y scales on the component you supply.

Here's the complete example:

```js
const chart = fc.chartCartesian(
    d3.scaleBand(),
    d3.scaleLinear()
  )
  .chartLabel('2015 Cumulative Sales')
  .xDomain(data.sales.map(d => d.month))
  .yDomain(yExtent(data.sales))
  .xPadding(0.2)
  .yTicks(5)
  .yTickFormat(valueFormatter)
  .yLabel('Sales (millions)')
  .yNice();
```

This renders a more complete chart. You'll notice that the x-axis for this chart
uses the [d3 band scale](https://github.com/d3/d3-scale#band-scales). This scale
is typically used for bar charts, where it computes the width of each bar,
returning this via the `bandwidth` function.

As you can see from the above code, the Cartesian chart exposes a number of the
properties of the components it encapsulates. Most of the x and y scale and axes
properties are exposed, with a suitable `x` or `y` prefix. This makes use of a
standard D3 concept of property rebinding, which gives rise to a compositional
pattern rather than inheritance.

D3FC extends the D3 rebind concept by making it easier to rebind all of the
properties of a component, and allowing prefixing / renaming.

## Annotations

The sales targets, which are illustrated as horizontal lines on the chart, can
be rendered using the line annotation component.

But how to add the annotations to the chart? Annotations, just like series, are
associated with both an x and a y scale, so can be supplied to the chart via the
`svgPlotArea`. But the bar series is currently set as the plot area. The
solution to this problem is the multi series component. This component acts a
container for multiple series instances, setting their scales and also
(optionally) mapping the data so that each series can be bound to a subset of
the data. If a mapping function is not provided, each series will 'inherit' the
data bound to the multi series component.

```js
const annotation = fc.annotationSvgLine()
  .value(d => d.value);

const multi = fc.seriesSvgMulti()
  .series([bar, annotation])
  .mapping((data, index, series) => {
    switch (series[index]) {
      case bar:
        return data.sales;
      case annotation:
        return data.targets;
    }
  });

chart.svgPlotArea(multi);
```

## Decorate pattern

The chart is starting to look pretty good! The only remaining tasks are to add
text to the annotations and highlight the bars which have exceeded the lower
target line.

This is an interesting problem, the elements that need to be styled or modified
have been created by the various components you have been making use of. How do
you modify the way that components render themselves? This is where decorate
pattern comes in.

With the decorate pattern you gain access to the data join that is used to
render a component, this allows you to add logic to the enter, update and exit
selections, adding elements or mutating the elements that the component itself
constructs. You can see numerous examples of this pattern in the decorate
pattern documentation.

In this case, decorate is used to locate the 'left handle' of the line
annotation, to add the text label, and to change the fill property of the path
elements used to render the bar series.

Here's the part of the code that 'decorates' the components:

```js
  bar.decorate(selection => {
    // The selection passed to decorate is the one which the component creates
    // within its internal data join, here we use the update selection to
    // apply a style to 'path' elements created by the bar series
    selection.select('.bar > path')
      .style('fill', d => d.sales < data.targets[0].value ? 'inherit' : '#0c0');
  });

  annotation.decorate(selection => {
    selection.enter()
      .select('g.left-handle')
      .append('text')
      .attr('x', 5)
      .attr('y', -5);
    selection.select('g.left-handle text')
      .text(d => d.name + ' - ' + valueFormatter(d.value) + 'M');
  });
```

And here's the result:

[<img src="https://d3fc.io/examples/building-a-chart/screenshot.png">](https://d3fc.io/examples/building-a-chart/)

## Resizing the chart

The Cartesian component uses a combination of standard and custom DOM elements,
with layout performed via CSS flexbox. With SVG charts, when the size of the
chart changes, the SVG needs to be re-rendered. The d3fc-group and d3fc-svg
custom elements take care of this for you - rendering themselves automatically
when the chart resizes! Go ahead and change the width of your browser window (or
rotate your phone is viewing via mobile) to see the charts updating.

Now that you've learnt the basic concepts of d3fc, why not browse the various
charting components and see what you can build?

If you want to make a more complex chart, for example, one with multiple axes, a
good starting point is to look at the source code for the Cartesian chart
component to see how that has been constructed form other D3FC components.
