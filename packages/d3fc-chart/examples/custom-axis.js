const customAxis = (baseAxis, isVertical = false, sign = 1) => {
    const translate = (x, y, o = 0) => isVertical ? `translate(${y}, ${x + o})` : `translate(${x}, ${y + o})`;

    const axis = selection => {
        selection.each((data, index, group) => {
            const container = d3.select(group[index]).append('g');
            const scale = baseAxis.scale();
            const ticks = scale.ticks(baseAxis.tickArguments());

            container.attr('font-size', 10);

            const labels = container.selectAll('text').data(ticks)
                .enter().append('g').attr('class', 'tick');

            labels.append('circle')
                .attr('r', 10)
                .attr('fill', 'rgba(100, 0, 0, 0.2)')
                .attr('transform', d => translate(scale(d), sign * 20));

            labels.append('text')
                .text(d => d)
                .attr('text-anchor', 'middle')
                .attr('transform', d => translate(scale(d), sign * 20, 3));
        });
    };

    fc.rebindAll(axis, baseAxis);
    return axis;
};

var data = d3.range(50).map((d) => ({
    x: d / 4,
    y: Math.sin(d / 4),
    z: Math.cos(d / 4) * 0.7
}));

var xExtent = fc.extentLinear()
    .accessors([d => d.x]);
var yExtent = fc.extentLinear()
    .accessors([d => d.y, d => d.z])
    .pad([0.1, 0.1]);

var gridlines = fc.annotationSvgGridline();
var line = fc.seriesSvgLine();
var area = fc.seriesSvgArea()
    .mainValue(d => d.z);

var multi = fc.seriesSvgMulti()
    .series([gridlines, area, line]);

var chart = fc.chartCartesian({
    xScale: d3.scaleLinear(),
    yScale: d3.scaleLinear(),
    xAxis: {
        bottom: scale => customAxis(fc.axisBottom(scale), false)
    },
    yAxis: {
        left: scale => customAxis(fc.axisLeft(scale), true, -1)
    }
})
    .xLabel('Value')
    .yLabel('Sine / Cosine')
    .yOrient('left')
    .yTicks([5])
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .svgPlotArea(multi);

d3.select('#custom-axis')
    .datum(data)
    .call(chart);
