const customAxis = (baseAxis, isVertical = false, sign = 1) => {
    const translate = (x, y, o = 0) =>
        isVertical ? `translate(${y}, ${x + o})` : `translate(${x}, ${y + o})`;

    const axis = selection => {
        selection.each((data, index, group) => {
            const container = d3.select(group[index]);
            const scale = baseAxis.scale();
            const ticks = scale.ticks(baseAxis.tickArguments());

            container.attr('font-size', 10);

            const labels = container.selectAll('g').data(ticks);

            const enter = labels
                .enter()
                .append('g')
                .attr('class', 'tick');

            const merged = labels.merge(enter);

            enter
                .append('circle')
                .attr('r', 10)
                .attr('fill', 'rgba(100, 0, 0, 0.2)');

            merged
                .select('circle')
                .attr('transform', d => translate(scale(d), sign * 20));

            enter.append('text').attr('text-anchor', 'middle');

            merged
                .select('text')
                .text(d => d)
                .attr('transform', d => translate(scale(d), sign * 20, 3));
        });
    };

    fc.rebindAll(axis, baseAxis);
    return axis;
};

const data = d3.range(50).map(d => ({
    x: d / 4,
    y: Math.sin(d / 4),
    z: Math.cos(d / 4) * 0.7
}));

const xExtent = fc.extentLinear().accessors([d => d.x]);
const yExtent = fc
    .extentLinear()
    .accessors([d => d.y, d => d.z])
    .pad([0.1, 0.1]);

const gridlines = fc.annotationSvgGridline();
const line = fc.seriesSvgLine();
const area = fc.seriesSvgArea().mainValue(d => d.z);

const multi = fc.seriesSvgMulti().series([gridlines, area, line]);

const chart = fc
    .chartCartesian({
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

d3.select('#chart')
    .datum(data)
    .call(chart);
