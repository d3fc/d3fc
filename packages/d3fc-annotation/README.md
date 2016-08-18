# d3fc-annotation

A collection of components for rendering plot area annotations onto cartesian charts - bands, crosshairs, gridlines and lines.

<table>
<tr>
<td><a href="#annotationBand"><img src="screenshots/band.png"/></a></td>
<td><a href="#annotationBand"><img src="screenshots/crosshair.png"/></a></td>
</tr>
<tr>
<td><a href="#annotationBand"><img src="screenshots/gridline.png"/></a></td>
<td><a href="#annotationBand"><img src="screenshots/line.png"/></a></td>
</tr>
</table>

[Main d3fc package](https://github.com/ScottLogic/d3fc)

# Installation

```bash
npm install d3fc-annotation
```

# API

## Gridline Annotation

The gridline component renders horizontal and vertical gridlines.

<a name="dataJoin" href="#annotationGridline">#</a> *fc*.**annotationGridline**()

Constructs a new gridline annotation component. Once constructed, configure the component with scales and call it on a selection -

```js
const xScale = d3.scaleLinear()
  .range([0, 100]);

const yScale = d3.scaleLinear()
  .range([0, 100]);

const gridline = fc.annotationGridline()
  .xScale(xScale)
  .yScale(yScale);

d3.select('svg')
  .call(gridline);
```

<a name="annotationGridline_xScale" href="#annotationGridline_xScale">#</a> *annotationGridline*.**xScale**(*scale*)

Sets the scale used for the vertical gridline positions (combined with [xTicks](#annotationGridline_xTicks)). Additionally, its [range](https://github.com/d3/d3-scale#continuous_range) is taken as the bounds of the horizontal gridlines.

<a name="annotationGridline_yScale" href="#annotationGridline_yScale">#</a> *annotationGridline*.**yScale**(*scale*)

Sets the scale used for the horizontal gridline positions (combined with [yTicks](#annotationGridline_yTicks)). Additionally, its [range](https://github.com/d3/d3-scale#continuous_range) is taken as the bounds of the vertical gridlines.

<a name="annotationGridline_xTicks" href="#annotationGridline_xTicks">#</a> *annotationGridline*.**xTicks**(*args*)

When [xScale](#annotationGridline_xScale) is a continuous scale, specifies the arguments passed to [ticks](https://github.com/d3/d3-scale#continuous_ticks) when requesting the horizontal gridline positions. For other scales, the [domain](https://github.com/d3/d3-scale#ordinal_domain) is used directly.

<a name="annotationGridline_yTicks" href="#annotationGridline_yTicks">#</a> *annotationGridline*.**yTicks**(*args*)

When [yScale](#annotationGridline_yScale) is a continuous scale, specifies the arguments passed to [ticks](https://github.com/d3/d3-scale#continuous_ticks) when requesting the horizontal gridline positions. For other scales, the [domain](https://github.com/d3/d3-scale#ordinal_domain) is used directly.

## Band Annotation
## Line Annotation
## Crosshair Annotation
