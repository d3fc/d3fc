// a random number generator
const generator = fc.randomGeometricBrownianMotion().steps(11);

// some formatters
const dateFormatter = d3.timeFormat('%b');
const valueFormatter = d3.format('$.0f');

const yExtent = fc
    .extentLinear()
    .include([0])
    .pad([0, 0.5])
    .accessors([d => d.sales]);

const data = {
    // target values for the annotations
    targets: [
        {
            name: 'low',
            value: 4.5
        },
        {
            name: 'high',
            value: 7.2
        }
    ],
    // randomly generated sales data
    sales: generator(1).map((d, i) => ({
        month: dateFormatter(new Date(0, i + 1, 0)),
        sales: d + i / 2
    }))
};

const chart = fc
    .chartCartesian(d3.scaleBand(), d3.scaleLinear())
    .chartLabel('2015 Cumulative Sales')
    .xDomain(data.sales.map(d => d.month))
    .yDomain(yExtent(data.sales))
    .xPadding(0.2)
    .yTicks(5)
    .yTickFormat(valueFormatter)
    .yLabel('Sales (millions)')
    .yNice();

const bar = fc
    .autoBandwidth(fc.seriesSvgBar())
    .crossValue(d => d.month)
    .mainValue(d => d.sales)
    .align('left')
    .decorate(selection => {
        // The selection passed to decorate is the one which the component creates
        // within its internal data join, here we use the update selection to
        // apply a style to 'path' elements created by the bar series
        selection
            .select('.bar > path')
            .style('fill', d =>
                d.sales < data.targets[0].value ? 'inherit' : '#0c0'
            );
    });

const annotation = fc
    .annotationSvgLine()
    .value(d => d.value)
    .decorate(selection => {
        selection
            .enter()
            .select('g.left-handle')
            .append('text')
            .attr('x', 5)
            .attr('y', -5);
        selection
            .select('g.left-handle text')
            .text(d => d.name + ' - ' + valueFormatter(d.value) + 'M');
    });

const multi = fc
    .seriesSvgMulti()
    .series([bar, annotation])
    .mapping((data, index, series) => {
        switch (series[index]) {
            case bar:
                return data.sales;
            case annotation:
                return data.targets;
        }
    });

chart.svgPlotArea(multi);

d3.select('#chart')
    .datum(data)
    .call(chart);
