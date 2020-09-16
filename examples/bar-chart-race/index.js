const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

d3.csv('data.csv', d => ({
    ...d,
    // convert string properties to numbers
    yr: Number(d.yr),
    mo: Number(d.mo),
    total: Number(d.total)
})).then(data => {
    // find all unique tags
    const tags = new Set(data.map(d => d.tag)).values();

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(tags);

    const percentFormat = d3.format('.1%');

    // a D3FC bar series component
    const barSeries = fc
        .autoBandwidth(fc.seriesSvgBar())
        .crossValue(d => d.tag)
        .align('left')
        .orient('horizontal')
        .key(d => d.tag)
        .mainValue(d => d.percent)
        .decorate(selection => {
            // this section uses the decorate pattern
            // to modify the data-join used by the bar series, allowing various customisations

            // colour each bar
            selection.enter().style('fill', d => colorScale(d.tag));

            // add language and percent indicators
            selection
                .enter()
                .append('text')
                .classed('language-label', true)
                .attr('transform', 'translate(-5, 0)')
                .text(d => d.tag);
            selection
                .enter()
                .append('text')
                .classed('language-percent', true)
                .attr('transform', 'translate(5, 0)');
            selection
                .select('.language-percent')
                .text(d => percentFormat(d.percent));
        });

    // use D3FC extent to compute
    // a suitable y axis range
    const yDomain = fc
        .extentLinear()
        .accessors([d => d.percent])
        .include([0])
        .pad([0.0, 0.05]);

    // the D3FC chart component
    const chart = fc
        .chartCartesian(d3.scaleLinear(), d3.scaleBand())
        .xOrient('top')
        .xTickFormat(percentFormat)
        .svgPlotArea(barSeries);

    const renderChart = (year, month) => {
        // filter the tag data for year / month and sort
        const currentTags = data
            .filter(d => d.yr === year && d.mo === month)
            .sort((a, b) => a.total - b.total);

        // compute the percentages
        const totalTagCount = d3.sum(currentTags, d => d.total);
        currentTags.forEach(d => (d.percent = d.total / totalTagCount));

        // update the chart domain
        chart
            .yDomain(currentTags.map(d => d.tag))
            .xDomain(yDomain(currentTags));

        // render the chart
        d3.select('#chart')
            .datum(currentTags)
            .transition()
            .ease(d3.easeLinear)
            .duration(700)
            .call(chart);

        // update the date indicator
        d3.select('#date').text(`${months[month - 1]} ${year}`);
    };

    let currentYear = 2009;
    let currentMonth = 1;

    // update the year / month on an interval timer
    const interval = setInterval(() => {
        renderChart(currentYear, currentMonth);
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
        if (currentMonth === 9 && currentYear === 2019) {
            clearInterval(interval);
        }
    }, 800);

    renderChart(2019, 1);
});
