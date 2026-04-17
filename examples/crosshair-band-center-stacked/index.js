// Crosshair centered on stacked band scale bars.
//
// Stacked bar series use d3.scaleBand() for categories. The crosshair
// snaps to the left edge by default because scaleBand() returns the
// left edge of each band. Adding bandwidth() / 2 centers it.
//
// Demonstrates:
// - Centering crosshair on stacked bars via bandwidth/2 offset
// - d3.stack() + seriesSvgRepeat for stacked bar rendering
// - Snapping crosshair to nearest category (scaleBand has no .invert())
// - Crosshair .y() showing total stack height for the hovered category

var categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
var rawData = categories.map(function(cat) {
    return {
        category: cat,
        series1: Math.round(Math.random() * 40 + 10),
        series2: Math.round(Math.random() * 30 + 5),
        series3: Math.round(Math.random() * 20 + 5)
    };
});

var stack = d3.stack()
    .keys(['series1', 'series2', 'series3'])
    .value(function(d, key) { return d[key]; });
var seriesData = stack(rawData);

var color = d3
    .scaleOrdinal()
    .domain(['series1', 'series2', 'series3'])
    .range(['#2164C2', '#D6591C', '#666680']);

var chartData = {
    stacked: seriesData,
    crosshair: []
};

var xScale = d3
    .scaleBand()
    .domain(categories)
    .paddingInner(0.2)
    .paddingOuter(0.1);

var yExtent = fc
    .extentLinear()
    .accessors([function(a) { return a.map(function(d) { return d[1]; }); }])
    .pad([0, 0.1]);

var yScale = d3
    .scaleLinear()
    .domain(yExtent(seriesData));

var barSeries = fc
    .autoBandwidth(fc.seriesSvgBar())
    .align('left')
    .crossValue(function(d) { return d.data.category; })
    .mainValue(function(d) { return d[1]; })
    .baseValue(function(d) { return d[0]; });

var repeat = fc
    .seriesSvgRepeat()
    .series(barSeries)
    .decorate(function(sel) {
        sel.selectAll('g.bar')
            .attr('fill', function(_, index) { return color(seriesData[index].key); });
    });

// scaleBand has no .invert() — find the nearest category from mouse x
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
    // Y tracks the mouse freely — lets the user inspect individual stack
    // segments by moving vertically within the stacked bar.
    // To snap Y to the total stack height instead, use:
    //   .y(function(d) { return yScale(totalByCategory[d.category]); })
    .y(function(d) { return d.mouseY; })
    .xLabel(function(d) { return d.category; })
    .yLabel(function(d) { return Math.round(yScale.invert(d.mouseY)); })
    .decorate(function(sel) {
        sel.selectAll('line').style('stroke-width', '2px');
    });

var multi = fc
    .seriesSvgMulti()
    .series([repeat, crosshair])
    .mapping(function(data, index, series) {
        switch (series[index]) {
        case repeat: return data.stacked;
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
