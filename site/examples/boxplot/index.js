const valueAtLocation = (d, location) => d[Math.floor(location * d.length)];

d3.csv('github-repo-data.csv', d => ({
    ...d,
    stars: Number(d.stars),
    forks: Number(d.forks),
    forksPerStar: d.forks / d.stars
})).then(githubData => {
    githubData = githubData.filter(
        d => d.stars > 0 && d.forks > 0 && d.language
    );

    // for any array of values, compute the quartile values
    const quartile = data => {
        data.sort();
        return {
            low: valueAtLocation(data, 0.02),
            lower: valueAtLocation(data, 0.25),
            median: valueAtLocation(data, 0.5),
            upper: valueAtLocation(data, 0.75),
            high: valueAtLocation(data, 0.98)
        };
    };

    const languageQuartiles = d3
        .groups(githubData, d => d.language)
        .map(([language, values]) => ({
            language,
            quartile: quartile(values.map(d => d.forksPerStar))
        }))
        .sort((a, b) => a.quartile.median - b.quartile.median);

    // the data that will be bound to the chart
    const data = {
        githubData,
        languageQuartiles
    };

    // obtain the unique list of languages
    const languages = languageQuartiles.map(d => d.language);

    const pointSeries = fc
        .seriesSvgPoint()
        .size(2)
        .mainValue(d => d.forksPerStar)
        .crossValue(
            d => languages.indexOf(d.language) + (Math.random() - 0.5) / 2
        );

    const boxSeries = fc
        .autoBandwidth(fc.seriesSvgBoxPlot())
        .orient('vertical')
        .cap(0.5)
        .crossValue(d => languages.indexOf(d.language))
        .medianValue(d => d.quartile.median)
        .lowerQuartileValue(d => d.quartile.lower)
        .upperQuartileValue(d => d.quartile.upper)
        .lowValue(d => d.quartile.low)
        .highValue(d => d.quartile.high);

    const multiSeries = fc
        .seriesSvgMulti()
        .series([fc.annotationSvgGridline(), boxSeries, pointSeries])
        .mapping((data, index, series) => {
            switch (series[index]) {
                case boxSeries:
                    return data.languageQuartiles;
                case pointSeries:
                    return data.githubData;
            }
        });

    const extent = fc.extentLinear().accessors([d => d.forksPerStar]);

    const chart = fc
        .chartCartesian(d3.scaleLinear(), d3.scaleLog())
        .yDomain(extent(githubData))
        .yLabel('Forks per Star (Log)')
        .yNice()
        .yTicks(5, d3.format('.0'))
        .xDomain([-0.5, languages.length - 0.5])
        .xTickValues(d3.range(0, languages.length))
        .xTickFormat(i => languages[i])
        .svgPlotArea(multiSeries)
        .xDecorate(sel =>
            sel
                .select('text')
                .style('text-anchor', 'start')
                .attr('transform', 'rotate(45 -10 10)')
        );

    d3.select('#chart')
        .datum(data)
        .call(chart);
});
