---
title: Building A Chart
---

This brief tutorial introduces the core concepts behind D3FC, via the process of building a chart. You'll find out why we created D3FC and what makes it different from the numerous other charting libraries out there!

Here's the chart you're going to be building:

<a href="/examples/building-a-chart-complete" class="d3fc-preview-link">
  <div class="d3fc-preview-cover"></div>
  <iframe class="d3fc-preview-home" title="d3fc-preview" src="/building-a-chart-complete/index.html"></iframe>
</a>

It's a pretty conventional 'sales dashboard' chart, in this case showing some fictional monthly sales data, with a couple of lines indicating targets.

But before we start putting this chart together, let's look at charting libraries in a more general sense ...

## Charting APIs

Charts are complex UI components, they are designed to be highly flexible in order to support a wide range of different chart types, styles and configurations. However, this flexibility is most often presented as a complex API of hundreds of classes and thousands of methods. Searching for the correct configuration that will yield the result you are after is a challenge, and you are heavily reliant on the designer of the chart having considered your use-case to make that configuration possible.

D3 offers a fresh perspective, offering a different way to create charts and visualisations. It is an expressive, yet low-level tool, that if wielded correctly, can be used to create practically any visual representation you like.

There are a number of charting libraries built with D3, however these invariably hide the underlying power of D3 behind the same-old complex and confusing APIs.

With D3FC our aim is to enhance D3 by providing a suite of powerful [charting components](http://bost.ocks.org/mike/chart/) that make it easy for you to assemble exactly the chart you want. These components 'speak the language' of D3, supporting [selections](https://github.com/d3/d3-selection) and [data joins](http://bl.ocks.org/mbostock/3808218). Furthermore, using the [decorate pattern](/introduction/decorate-pattern), you can enhance and manipulate the way in which they are rendered.

With D3FC components you can quickly assemble bespoke charts, without hiding the power of D3.

## Creating the data

Typically chart data will be supplied by some external source, in JSON or CSV format. For the purposes of this example we'll just generate some random data. D3FC has a number of `data` utilities, including components that help construct realistic random data. For this example we'll use the [random Brownian motion component](/api/random-data-api) to generate 12 datapoints, mapping them to create datapoints with `sales` and `month` properties:

`embed:examples/creating-some-data/index.js`

Here's the resulting data:

<a href="/examples/creating-some-data" class="d3fc-preview-link">
  <div class="d3fc-preview-cover"></div>
  <iframe class="d3fc-preview-home" title="d3fc-preview" src="/creating-some-data/index.html"></iframe>
</a>

## Rendering the data

The sales data is rendered as a bar chart. With D3 this typically involves rendering paths or rectangles and doing a bit of maths to locate each bar correctly, as illustrated in [Mike Bostock's excellent tutorial](http://bost.ocks.org/mike/bar/).

D3FC has a [bar series component](/api/series-api) (among others) that makes this task much easier. To render the data, we create a bar series component and supply it with suitable D3 scales, configure the `mainValue` and `crossValue` accessors (which the component uses to extract the x and y values from the datapoints). Notice these value accessors are prefixed `main` and `cross`, this is because d3fc-series component support both horizontal and vertical orientations where the meanings of x and y would be transposed.

The bar series is a regular D3 component, and is rendered via the `call` method on a D3 selection:

`embed:examples/rendering-a-series/index.js`

This renders as follows:

<a href="/examples/rendering-a-series" class="d3fc-preview-link">
  <div class="d3fc-preview-cover"></div>
  <iframe class="d3fc-preview-home" title="d3fc-preview" src="/rendering-a-series/index.html"></iframe>
</a>

At this point you might like to read more about the [D3 component pattern](http://bost.ocks.org/mike/chart/) that we follow with d3fc.

I'll forgive you if you are not too impressed with the above example. So far you've got a bar series, but no axes or labels, yet the example involves quite a bit of code.

The reason for this is that the bar series component is relatively low-level component, it renders a series and nothing more. (It's actually not the lowest level of component, the bar series uses the [bar shape component](/api/shape-api) as part of its own implementation). In order to quickly assemble a chart you need to make use of a more high-level component ... a chart.

## Cartesian chart

The [Cartesian chart component](/api/chart-api) does a number of things, it constructs a suitable layout (composed of div, [d3fc-group and d3fc-svg](/api/element-api) elements), setting a suitable range on the scales that you supply (it's still your job to set the domain on each). The chart renders a pair of axes and, optionally, other cosmetic features such as chart and axis labels.

You can render a series within the chart by setting it as the `plotArea`. The chart sets the x and y scales on the component you supply.

Here's the complete example:

`embed:examples/cartesian-chart/index.js`

This renders a more complete chart:

<a href="/examples/cartesian-chart" class="d3fc-preview-link">
  <div class="d3fc-preview-cover"></div>
  <iframe class="d3fc-preview-home" title="d3fc-preview" src="/cartesian-chart/index.html"></iframe>
</a>

You'll notice that the x-axis for this chart uses the [d3 band scale](https://github.com/d3/d3-scale#band-scales). This scale is typically used for bar charts, where it computes the width of each bar, returning this via the `bandwidth` function.

You can set the `bandwidth` directly on the D3FC bar series, or, as per this example, adapt a series using the `autoBandwidth` component. This detects whether the scale associated with the series exposes a `bandwidth` function, and uses this to set the series band width automatically (hence the 'auto' name!).

## Setting the axis domain

The current logic for setting the domain for each axis isn't ideal. Firstly, the x-axis domain is hard-coded with the months of the year. This is easily resolved by mapping the data to return the month component for each datapoint:

```js
data.map(function(d) {
  return d.month;
});
```

The current y-domain is a bit of a guess, being hard-coded to a range `[0, 10]`. Ideally the domain should be computed based on the data. In this case the domain should accommodate the greatest sales value, plus some padding, and also extent to zero.

There's another D3FC component that can help here, the [extent](/api/extent-api) utility. The following code ensures that zero is included, and adds a small amount of padding, as a percentage of the overall extent, to the 'top' end of the range:

`embed:examples/cartesian-chart-extent/index.js`

Here's the overall result:

<a href="/examples/cartesian-chart-extent" class="d3fc-preview-link">
  <div class="d3fc-preview-cover"></div>
  <iframe class="d3fc-preview-home" title="d3fc-preview" src="/cartesian-chart-extent/index.html"></iframe>
</a>

## Tidying the chart

Let't tidy up the chart a bit by setting suitable labels:

`embed:examples/tidy-chart/index.js`

This gives a much more appealing chart:

<a href="/examples/tidy-chart" class="d3fc-preview-link">
  <div class="d3fc-preview-cover"></div>
  <iframe class="d3fc-preview-home" title="d3fc-preview" src="/tidy-chart/index.html"></iframe>
</a>

As you can see from the above code, the Cartesian chart exposes a number of the properties of the components it encapsulates. Most of the x and y scale and axes properties are exposed, with a suitable `x` or `y` prefix. This makes use of a standard D3 concept of property [rebinding](/api/rebind-api), which gives rise to a compositional pattern rather than inheritance.

D3FC extends the D3 rebind concept by making it easier to rebind all of the properties of a component, and allowing prefixing / renaming.

## Annotations

The sales targets, which are illustrated as horizontal lines on the chart, can be rendered using the [line annotation component](/api/annotation-api).

The chart now has two sources of data, an array of monthly sales figures, and a second array which supplies annotation values. These need to be combined into a single object which is supplied to the chart via the D3 `datum` method as before.

`embed:examples/adding-annotations/index.js`

As you can see in the above code, the `data` now has two properties, `targets` and `sales`, one for the annotations, the other for the series. As a results of this, the extent and domain calculations are updated to reference `data.sales`.

But how to add the annotations to the chart? Annotations, just like series, are associated with both an x and a y scale, so can be supplied to the chart via the `plotArea`. But the bar series is currently set as the plot area. The solution to this problem is the [multi series component](/api/series-api). This component acts a container for multiple series instances, setting their scales and also (optionally) mapping the data so that each series can be bound to a subset of the data. If a mapping function is not provided, each series will 'inherit' the data bound to the multi series component.

Here's the result:

<a href="/examples/adding-annotations" class="d3fc-preview-link">
  <div class="d3fc-preview-cover"></div>
  <iframe class="d3fc-preview-home" title="d3fc-preview" src="/adding-annotations/index.html"></iframe>
</a>

## Decorate pattern

The chart is starting to look pretty good! The only remaining tasks are to add text to the annotations and highlight the bars which have exceeded the lower target line.

This is an interesting problem, the elements that need to be styled or modified have been created by the various components you have been making use of. How do you modify the way that components render themselves? This is where [decorate pattern](/introduction/decorate-pattern) comes in.

With the decorate pattern you gain access to the data join that is used to render a component, this allows you to add logic to the enter, update and exit selections, adding elements or mutating the elements that the component itself constructs. You can see numerous examples of this pattern in the [decorate pattern](/introduction/decorate-pattern) documentation.

In this case, decorate is used to locate the 'left handle' of the line annotation, to add the text label, and to change the fill property of the path elements used to render the bar series.

Here's the part of the code that 'decorates' the bar series:

`embed:examples/building-a-chart-complete/index.js`

And here's the result:

<a href="/examples/building-a-chart-complete" class="d3fc-preview-link">
  <div class="d3fc-preview-cover"></div>
  <iframe class="d3fc-preview-home" title="d3fc-preview" src="/building-a-chart-complete/index.html"></iframe>
</a>

## Resizing the chart

The Cartesian component uses a combination of standard and custom DOM elements, with layout performed via CSS flexbox. With SVG charts, when the size of the chart changes, the SVG needs to be re-rendered. The [d3fc-group and d3fc-svg](/api/element-api) custom elements take care of this for you - rendering themselves automatically when the chart resizes! Go ahead and change the width of your browser window (or rotate your phone is viewing via mobile) to see the charts updating.

Now that you've learnt the basic concepts of d3fc, why not browse the various charting components and see what you can build?

If you want to make a more complex chart, for example, one with multiple axes, a good starting point is to look at the source code for the Cartesian chart component to see how that has been constructed form other D3FC components.
