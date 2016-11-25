---
layout: section
section: introduction
namespace: Introduction
title: Building A Chart
externals:
  building-a-chart-complete-js: building-a-chart-complete.js
  building-a-chart-complete-html: building-a-chart-complete.html
  building-a-chart-complete-css: building-a-chart-complete.css
  creating-some-data-html: creating-some-data.html
  creating-some-data-js: creating-some-data.js
  rendering-a-series-html: rendering-a-series.html
  rendering-a-series-js: rendering-a-series.js
  cartesian-chart-html: cartesian-chart.html
  cartesian-chart-js: cartesian-chart.js
  cartesian-chart-extent-html: cartesian-chart-extent.html
  cartesian-chart-extent-js: cartesian-chart-extent.js
  tidy-chart-html: tidy-chart.html
  tidy-chart-js: tidy-chart.js
  adding-annotations-html: adding-annotations.html
  adding-annotations-js: adding-annotations.js
---

This brief tutorial introduces the core concepts behind d3fc, via the process of building a chart. You'll find out why we created d3fc and what makes it different from the numerous other charting libraries out there!

Here's the chart you're going to be building:

<style>
{{{ building-a-chart-complete-css }}}
</style>

{{{ dynamic-include 'codepen' html="building-a-chart-complete-html" js="building-a-chart-complete-js" css="building-a-chart-complete-css"}}}
{{{ building-a-chart-complete-html }}}
{{{ dynamic-include 'javascript' js="building-a-chart-complete-js" }}}

It's a pretty conventional 'sales dashboard' chart, in this case showing some fictional monthly sales data, with a couple of lines indicating targets.

But before we start putting this chart together, let's look at charting libraries in a more general sense ...

## Charting APIs

Charts are complex UI components, they are designed to be highly flexible in order to support a wide range of different chart types, styles and configurations. However, this flexibility is most often presented as a complex API of hundreds of classes and thousands of methods. Searching for the correct configuration that will yield the result you are after is a challenge, and you are heavily reliant on the designer of the chart having considered your use-case to make that configuration possible.

D3 offers a fresh perspective, offering a different way to create charts and visualisations. It is an expressive, yet low-level tool, that if wielded correctly, can be used to create practically any visual representation you like.

There are a number of charting libraries built with D3, however these invariably hide the underlying power of D3 behind the same-old complex and confusing APIs.

With d3fc our aim is to enhance D3 by providing a suite of powerful [charting components](http://bost.ocks.org/mike/chart/) that make it easy for you to assemble exactly the chart you want. These components 'speak the language' of D3, supporting [selections](https://github.com/d3/d3-selection) and [data joins](http://bl.ocks.org/mbostock/3808218). Furthermore, using the {{{ hyperlink 'decorate-pattern.html' title='decorate pattern' }}}, you can enhance and manipulate the way in which they are rendered.

With d3fc components you can quickly assemble bespoke charts, without hiding the power of D3.

## Creating the data

Typically chart data will be supplied by some external source, in JSON or CSV format. For the purposes of this example we'll just generate some random data. d3fc has a number of `data` utilities, including components that help construct realistic random data. For this example we'll use the {{{ hyperlink 'random-data-api.html' title='random brownian motion component' }}} to generate 12 datapoints, mapping them to create datapoints with `sales` and `month` properties:

```js
{{{creating-some-data-js}}}
```

Here's the resulting data:

{{{ dynamic-include 'codepen' html="creating-some-data-html" js="creating-some-data-js" css="building-a-chart-complete-css"}}}
{{{ creating-some-data-html }}}
{{{ dynamic-include 'javascript' js="creating-some-data-js" }}}

## Rendering the data

The sales data is rendered as a bar chart. With D3 this typically involves rendering paths or rectangles and doing a bit of maths to locate each bar correctly, as illustrated in [Mike Bostock's excellent tutorial](http://bost.ocks.org/mike/bar/).

d3fc has a {{{ hyperlink 'series-api.html' title='bar series component' }}} (among others) that makes this task much easier. To render the data, we create a bar series component and supply it with suitable D3 scales, configure the `mainValue` and `crossValue` accessors (which the component uses to extract the x and y values from the datapoints). Notice these value accessors are prefixed `main` and `cross`, this is because d3fc-series component support both horizontal and vertical orientations where the meanings of x and y would be transposed.

The bar series is a regular D3 component, and is rendered via the `call` method on a D3 selection:

```js
{{{ codeblock rendering-a-series-js }}}
```

This renders as follows:

{{{ dynamic-include 'codepen' html="rendering-a-series-html" js="rendering-a-series-js" css="building-a-chart-complete-css"}}}
{{{ rendering-a-series-html }}}
{{{ dynamic-include 'javascript' js="rendering-a-series-js" }}}

At this point you might like to read more about the [D3 component pattern](http://bost.ocks.org/mike/chart/) that we follow with d3fc.

I'll forgive you if you are not too impressed with the above example. So far you've got a bar series, but no axes or labels, yet the example involves quite a bit of code.

The reason for this is that the bar series component is relatively low-level component, it renders a series and nothing more. (It's actually not the lowest level of component, the bar series uses the {{{ hyperlink 'shape-api.html' title='bar shape component' }}} as part of its own implementation). In order to quickly assemble a chart you need to make use of a more high-level component ... a chart.

## Cartesian chart

The {{{ hyperlink 'chart-api.html' title='cartesian chart component' }}} does a number of things, it constructs a suitable layout (composed of div, {{{ hyperlink 'element-api.html' title='d3fc-group and d3fc-svg' }}} elements), setting a suitable range on the scales that you supply (it's still your job to set the domain on each). The chart renders a pair of axes and, optionally, other cosmetic features such as chart and axis labels.

You can render a series within the chart by setting it as the `plotArea`. The chart sets the x and y scales on the component you supply.

Here's the complete example:

```js
{{{ codeblock cartesian-chart-js }}}
```

This renders a more complete chart:

{{{ dynamic-include 'codepen' html="cartesian-chart-html" js="cartesian-chart-js" css="building-a-chart-complete-css"}}}
{{{ cartesian-chart-html }}}

{{{ dynamic-include 'javascript' js="cartesian-chart-js" }}}

## Setting the axis domain

The current logic for setting the domain for each axis isn't ideal. Firstly, the x-axis domain is hard-coded with the months of the year. This is easily resolved by mapping the data to return the month component for each datapoint:

```js
data.map(function(d) { return d.month; })
```

The current y-domain is a bit of a guess, being hard-coded to a range `[0, 10]`. Ideally the domain should be computed based on the data. In this case the domain should accommodate the greatest sales value, plus some padding, and also extent to zero.

There's another d3fc component that can help here, the {{{ hyperlink 'extent-api.html' title='extent' }}} utility. The following code ensures that zero is included, and adds a small amount of padding, as a percentage of the overall extent, to the 'top' end of the range:

```js
{{{ codeblock cartesian-chart-extent-js }}}
```

Here's the overall result:

{{{ dynamic-include 'codepen' html="cartesian-chart-extent-html" js="cartesian-chart-extent-js" css="building-a-chart-complete-css"}}}
{{{ cartesian-chart-extent-html }}}
{{{ dynamic-include 'javascript' js="cartesian-chart-extent-js" }}}

## Tidying the chart

Let't tidy up the chart a bit by setting suitable labels:

```js
{{{ codeblock tidy-chart-js }}}
```

This gives a much more appealing chart:

{{{ dynamic-include 'codepen' html="tidy-chart-html" js="tidy-chart-js" css="building-a-chart-complete-css"}}}
{{{ tidy-chart-html }}}
{{{ dynamic-include 'javascript' js="tidy-chart-js" }}}

As you can see from the above code, the cartesian chart exposes a number of the properties of the components it encapsulates. Most of the x and y scale and axes properties are exposed, with a suitable `x` or `y` prefix. This makes use of a standard D3 concept of property {{{ hyperlink 'rebind-api.html' title='rebinding' }}}, which gives rise to a compositional pattern rather than inheritance.

d3fc extends the D3 rebind concept by making it easier to rebind all of the properties of a component, and allowing prefixing / renaming.

## Annotations

The sales targets, which are illustrated as horizontal lines on the chart, can be rendered using the {{{ hyperlink 'annotation-api.html' title='line annotation component' }}}.

The chart now has two sources of data, an array of monthly sales figures, and a second array which supplies annotation values. These need to be combined into a single object which is supplied to the chart via the D3 `datum` method as before.

```js
{{{ codeblock adding-annotations-js }}}
```

As you can see in the above code, the `data` now has two properties, `targets` and `sales`, one for the annotations, the other for the series. As a results of this, the extent and domain calculations are updated to reference `data.sales`.

But how to add the annotations to the chart? Annotations, just like series, are associated with both an x and a y scale, so can be supplied to the chart via the `plotArea`. But the bar series is currently set as the plot area. The solution to this problem is the {{{ hyperlink 'series-api.html' title='multi series component' }}}. This component acts a container for multiple series instances, setting their scales and also (optionally) mapping the data so that each series can be bound to a subset of the data. If a mapping function is not provided, each series will 'inherit' the data bound to the multi series component.

Here's the result:

{{{ dynamic-include 'codepen' html="adding-annotations-html" js="adding-annotations-js" css="building-a-chart-complete-css"}}}
{{{ adding-annotations-html }}}
{{{ dynamic-include 'javascript' js="adding-annotations-js" }}}

## Decorate pattern

The chart is starting to look pretty good! The only remaining tasks are to add text to the annotations and highlight the bars which have exceeded the lower target line.

This is an interesting problem, the elements that need to be styled or modified have been created by the various components you have been making use of. How do you modify the way that components render themselves? This is where {{{ hyperlink 'decorate-pattern.html' title='decorate pattern' }}} comes in.

With the decorate pattern you gain access to the data join that is used to render a component, this allows you to add logic to the enter, update and exit selections, adding elements or mutating the elements that the component itself constructs. You can see numerous examples of this pattern in the {{{ hyperlink 'decorate-pattern.html' title='decorate pattern' }}} documentation.

In this case, decorate is used to locate the 'left handle' of the line annotation, to add the text label, and to change the fill property of the path elements used to render the bar series.

Here's the part of the code that 'decorates' the bar series:

```js
{{{ codeblock building-a-chart-complete-js }}}
```

And here's the result:

<style>
{{{ building-a-chart-complete-css }}}
</style>

{{{ dynamic-include 'codepen' html="building-a-chart-complete-html" js="building-a-chart-complete-js" css="building-a-chart-complete-css"}}}
{{{ building-a-chart-complete-html }}}
{{{ dynamic-include 'javascript' js="building-a-chart-complete-js" }}}

## Resizing the chart

The cartesian component uses a combination of standard and custom DOM elements, with layout performed via CSS flexbox. With SVG charts, when the size of the chart changes, the SVG needs to be re-rendered. The {{{ hyperlink 'element-api.html' title='d3fc-group and d3fc-svg' }}} custom elements take care of this for you - rendering themselves automatically when the chart resizes! Go ahead and change the width of your browser window (or rotate your phone is viewing via mobile) to see the charts updating.

Now that you've learnt the basic concepts of d3fc, why not browse the various charting components and see what you can build?

If you want to make a more complex chart, for example, one with multiple axes, a good starting point is to look at the source code for the cartesian chart component to see how that has been constructed form other d3fc components.
