// Demonstrates webglOpacity with two overlapping bar series.
// The first series uses constant opacity; the second uses per-datum opacity.

var redData = [];
var blueData = [];
for (var i = 0; i < 10; i++) {
    redData.push({ x: i, y: 0.3 + Math.sin(i * 0.8) * 0.25 });
    blueData.push({ x: i, y: 0.2 + Math.cos(i * 0.8) * 0.25 });
}

var xScale = d3.scaleLinear().domain([-0.5, 9.5]);
var yScale = d3.scaleLinear().domain([0, 0.8]);
var container = document.querySelector('d3fc-canvas');

// -- Red series: constant opacity --
// webglOpacity().value(number) sets a uniform opacity for the entire series.
var redFill = fc.webglFillColor();
var redOpacity = fc.webglOpacity();

var redSeries = fc
    .seriesWebglBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(d) {
        return d.x;
    })
    .mainValue(function(d) {
        return d.y;
    })
    .bandwidth(150)
    .defined(function() {
        return true;
    })
    .equals(function(p) {
        return p.length > 0;
    })
    .decorate(function(program) {
        redFill
            .value(function() {
                return [0.9, 0.1, 0.1, 1];
            })
            .data(redData)(program);
        // Constant opacity: every bar in this series is 60% opaque
        redOpacity.value(0.6)(program);
    });

// -- Blue series: per-datum opacity --
// webglOpacity().value(function) sets opacity per element.
var blueFill = fc.webglFillColor();
var blueOpacity = fc.webglOpacity();

var blueSeries = fc
    .seriesWebglBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(d) {
        return d.x;
    })
    .mainValue(function(d) {
        return d.y;
    })
    .bandwidth(150)
    .defined(function() {
        return true;
    })
    .equals(function(p) {
        return p.length > 0;
    })
    .decorate(function(program) {
        blueFill
            .value(function() {
                return [0.1, 0.1, 0.9, 1];
            })
            .data(blueData)(program);
        // Per-datum opacity: bars fade from opaque (left) to transparent (right)
        blueOpacity
            .value(function(d, i) {
                return 1 - i / 12;
            })
            .data(blueData)(program);
    });

var gl = null;

d3.select(container)
    .on('measure', function(event) {
        var detail = event.detail;
        xScale.range([0, detail.width]);
        yScale.range([detail.height, 0]);
        gl = container.querySelector('canvas').getContext('webgl');
        redSeries.context(gl);
        blueSeries.context(gl);
    })
    .on('draw', function() {
        redSeries(redData);
        blueSeries(blueData);
    });

container.requestRedraw();
