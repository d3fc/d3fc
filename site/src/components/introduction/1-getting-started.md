---
layout: component
title: Getting Started
namespace: introduction

example-code: |
    var data = fc.data.random.financial()(50);

    var chart = fc.chart.linearTimeSeries()
        .xDomain(fc.util.extent(data, 'date'))
        .yDomain(fc.util.extent(data, ['high', 'low']));

    var gridlines = fc.annotation.gridline();
    var candlestick = fc.series.candlestick();

    var multi = fc.series.multi()
        .series([gridlines, candlestick]);
    chart.plotArea(multi);

    d3.select('#chart')
        .append('svg')
        .style({
            height: '250px',
            width: '600px'
        })
        .datum(data)
        .call(chart);
---

## Grabbing the code

d3fc and its dependencies are available via npm or cdnjs.

### Installing with npm

You can install d3fc and its dependencies via npm as follows:

```
npm install d3fc
```

Once installed, you can reference the d3fc JavaScript, CSS and dependencies within an HTML page as follows:

```html
<script src="node_modules/d3fc/node_modules/d3/d3.js"></script>
<script src="node_modules/d3fc/node_modules/css-layout/dist/css-layout.js"></script>
<script src="node_modules/d3fc/node_modules/svg-innerhtml/svg-innerhtml.js"></script>
<script src="node_modules/d3fc/dist/d3fc.js"></script>

<link href="node_modules/d3fc/dist/d3fc.css" rel="stylesheet"/>
```

### Using cdnjs

Alternatively you can link to d3fc and its dependencies directly via cdnjs:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3fc/{{ package.version }}/d3fc.bundle.min.js"></script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/d3fc/{{ package.version }}/d3fc.min.css" rel="stylesheet"/>
```

## A quick chart

If you want a quick verification that everything has installed correctly, the following code will render a simple time series chart:

```html
<div id="chart"></div>
```

```js
{{{example-code}}}
```

Here is how the chart should look:

<div id="chart"></div>
<script type="text/javascript">
(function() {
    {{{example-code}}}
}());
</script>

## Next steps

The next step is to browse the d3fc components to determine which you need for your chart or visualisation. You should also read about the <a href="2-decorate-pattern.html">decorate pattern</a> which allows you to customise the d3fc components.
