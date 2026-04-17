// Crosshair centered on WebGL bars via SVG overlay.
//
// d3fc provides crosshair implementations for SVG and Canvas but not
// WebGL. This is by design — not a gap:
//
// - Crosshairs are interactive, DOM-based elements that follow the mouse.
//   There is only ever one crosshair on screen, so there is no performance
//   benefit from GPU-accelerated rendering.
// - SVG provides free label rendering, CSS styling, and DOM event handling
//   that would need to be reimplemented in WebGL.
// - chartCartesian supports simultaneous .webglPlotArea() and .svgPlotArea(),
//   rendering them as stacked layers. The WebGL layer draws the data (bars),
//   and the SVG layer draws the crosshair on top.
//
// Note: WebGL bar series excludes .align() from its API, so scaleBand
// cannot be used directly for bar positioning (bars would be centered on
// the band's left edge). This example uses scaleLinear with category
// tick labels instead, matching the existing series-webgl-bar pattern.
//
// This example demonstrates:
// - WebGL bar rendering with SVG crosshair overlay via chartCartesian
// - Centering crosshair on bars
// - Custom x-axis tick formatting for category labels

var categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
var data = categories.map(function(cat, i) {
    return { category: cat, index: i, value: Math.round(Math.random() * 80 + 20) };
});

var crosshairData = [];

var xScale = d3
    .scaleLinear()
    .domain([-0.5, categories.length - 0.5]);

var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.value; }) * 1.1]);

// WebGL bar series for the data layer
var bar = fc
    .autoBandwidth(fc.seriesWebglBar())
    .crossValue(function(d) { return d.index; })
    .mainValue(function(d) { return d.value; })
    .defined(function() { return true; })
    .decorate(function(program) {
        fc.webglFillColor()
            .value(function() { return [0.13, 0.39, 0.76, 1]; })
            .data(data)(program);
    });

// Find nearest bar index from mouse x position
function snapToIndex(mouseX) {
    var index = Math.round(xScale.invert(mouseX));
    return Math.max(0, Math.min(data.length - 1, index));
}

// SVG crosshair for the overlay layer
var crosshair = fc
    .annotationSvgCrosshair()
    // X snaps to bar center — index is resolved via snapToIndex(),
    // then positioned at the bar center via scaleLinear
    .x(function(d) { return xScale(d.index); })
    // Y tracks the mouse freely — raw screen coordinate, not snapped to data.
    // To snap Y to the bar's value instead, use:
    //   .y(function(d) { return yScale(d.value); })
    .y(function(d) { return d.mouseY; })
    .xLabel(function(d) { return d.category; })
    .yLabel(function(d) { return Math.round(yScale.invert(d.mouseY)); })
    .decorate(function(sel) {
        sel.selectAll('line').style('stroke-width', '2px');
    });

var pointer = fc.pointer().on('point', function(event) {
    if (event.length === 0) {
        crosshairData = [];
    } else {
        // X: snap to nearest bar index (discrete)
        // Y: pass raw mouse position (continuous — free tracking)
        var index = snapToIndex(event[0].x);
        var datum = data[index];
        crosshairData = [{
            index: datum.index,
            category: datum.category,
            mouseY: event[0].y
        }];
    }
    render();
});

// chartCartesian layers: WebGL for bars, SVG for crosshair overlay.
// Wrap crosshair in multi to decouple its data from the chart datum.
var svgOverlay = fc
    .seriesSvgMulti()
    .series([crosshair])
    .mapping(function() { return crosshairData; });

var chart = fc
    .chartCartesian(xScale, yScale)
    .webglPlotArea(bar)
    .svgPlotArea(svgOverlay)
    .xTickValues(d3.range(categories.length))
    .xTickFormat(function(i) { return categories[i]; })
    .decorate(function(sel) {
        // All plot areas have class 'plot-area' — select the SVG one
        // specifically so pointer events fire on the topmost layer.
        sel.enter()
            .select('.svg-plot-area')
            .call(pointer);
    });

function render() {
    d3.select('#chart')
        .datum(data)
        .call(chart);
}

render();
