// Crosshair centered on band scale bars.
//
// d3.scaleBand() returns the left edge of each band, so the crosshair
// snaps to the left side of bars by default. Adding bandwidth() / 2
// to the crosshair's .x() accessor centers it on each bar.
//
// Demonstrates:
// - Centering crosshair on scaleBand bars via bandwidth/2 offset
// - Snapping to nearest bar category (scaleBand has no .invert())
// - Using fc.pointer() to track mouse position in plot-area coords

var categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
var data = categories.map(function(cat) {
    return { category: cat, value: Math.round(Math.random() * 80 + 20) };
});

var chartData = {
    series: data,
    crosshair: []
};

var xScale = d3
    .scaleBand()
    .domain(categories)
    .paddingInner(0.2)
    .paddingOuter(0.1);

var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.value; }) * 1.1]);

var bar = fc
    .autoBandwidth(fc.seriesSvgBar())
    .align('left')
    .crossValue(function(d) { return d.category; })
    .mainValue(function(d) { return d.value; })
    .decorate(function(sel) {
        sel.enter()
            .select('path')
            .attr('fill', '#2164C2');
    });

// scaleBand has no .invert() — find the nearest category from a mouse x position
function snapToCategory(mouseX) {
    var domain = xScale.domain();
    var step = xScale.step();
    var rangeStart = xScale.range()[0];
    var index = Math.floor((mouseX - rangeStart) / step);
    index = Math.max(0, Math.min(domain.length - 1, index));
    return domain[index];
}

var crosshair = fc
    .annotationSvgCrosshair()
    // X snaps to bar center — category is resolved via snapToCategory(),
    // then positioned at the band center with bandwidth/2 offset
    .x(function(d) { return xScale(d.category) + xScale.bandwidth() / 2; })
    // Y tracks the mouse freely — raw screen coordinate, not snapped to data.
    // To snap Y to the bar's value instead, use:
    //   .y(function(d) { return yScale(dataByCategory[d.category]); })
    .y(function(d) { return d.mouseY; })
    .xLabel(function(d) { return d.category; })
    .yLabel(function(d) { return Math.round(yScale.invert(d.mouseY)); })
    .decorate(function(sel) {
        sel.selectAll('line').style('stroke-width', '2px');
    });

var multi = fc
    .seriesSvgMulti()
    .series([bar, crosshair])
    .mapping(function(data, index, series) {
        switch (series[index]) {
        case bar: return data.series;
        case crosshair: return data.crosshair;
        }
    });

var pointer = fc.pointer().on('point', function(event) {
    if (event.length === 0) {
        chartData.crosshair = [];
    } else {
        // X: snap to nearest category (discrete — band scale)
        // Y: pass raw mouse position (continuous — free tracking)
        var category = snapToCategory(event[0].x);
        chartData.crosshair = [{
            category: category,
            mouseY: event[0].y
        }];
    }
    render();
});

var chart = fc
    .chartCartesian(xScale, yScale)
    .svgPlotArea(multi)
    .decorate(function(sel) {
        sel.enter()
            .select('.plot-area')
            .call(pointer);
    });

function render() {
    d3.select('#chart')
        .datum(chartData)
        .call(chart);
}

render();
