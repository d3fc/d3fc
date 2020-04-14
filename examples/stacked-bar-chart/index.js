d3.csv('energy-production.csv').then(data => {
    // manipulate the data into stacked series
    const stack = d3
        .stack()
        .keys(Object.keys(data[0]).filter(k => k !== 'Country'));
    const seriesData = stack(data);

    const color = d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain(seriesData.map(s => s.key));

    const legend = d3
        .legendColor()
        .shapeWidth(80)
        .labelWrap(80)
        .orient('horizontal')
        .scale(color);

    const barSeries = fc
        .seriesSvgBar()
        .orient('horizontal')
        .bandwidth(40)
        .crossValue(d => d.data.Country)
        .mainValue(d => d[1])
        .baseValue(d => d[0]);

    const repeat = fc
        .seriesSvgRepeat()
        .series(barSeries)
        .decorate(selection => {
            selection
                .selectAll('g.bar')
                .attr('fill', (data, index) => color(seriesData[index].key));
        });

    const xExtent = fc
        .extentLinear()
        .accessors([a => a.map(d => d[1])])
        .pad([0, 1])
        .padUnit('domain');

    const chart = fc
        .chartCartesian(d3.scaleLinear(), d3.scalePoint())
        .xDomain(xExtent(seriesData))
        .yDomain(data.map(d => d.Country))
        .yOrient('left')
        .yPadding([0.5])
        .xLabel('Million tonnes of oil equivalent')
        .chartLabel('2013 Energy Production')
        .svgPlotArea(repeat)
        .decorate(function(selection, data, index) {
            // append an svg for the d3-legend
            selection
                .enter()
                .append('d3fc-svg')
                .attr('class', 'legend');

            // render the legend
            selection
                .select('.legend')
                .select('svg')
                .call(legend);
        });

    d3.select('#stacked-chart')
        // remove the loading text from the container
        .text(null)
        .datum(seriesData)
        .call(chart);
});
