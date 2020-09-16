d3.csv('repos-users-dump.csv').then(githubData => {
    // count the organisations / users for each language
    const scatter = d3
        .groups(githubData, d => d.language)
        .map(([key, values]) => ({
            language: key,
            orgs: values.filter(d => d.type === 'Organization').length,
            users: values.filter(d => d.type === 'User').length
        }))
        .filter(d => d.language);

    // Use the text label component for each datapoint. This component renders both
    // a text label and a circle at the data-point origin. The circle is hidden
    // in CSS because the point series is responsible for  this.
    const textLabel = fc
        .layoutTextLabel()
        .padding(2)
        .value(d => d.language);

    // a strategy that combines simulated annealing with removal
    // of overlapping labels
    const strategy = fc.layoutRemoveOverlaps(fc.layoutGreedy());

    // create the layout that positions the labels
    const labels = fc
        .layoutLabel(strategy)
        .size((d, i, g) => {
            // measure the label and add the required padding
            const textSize = g[i].getElementsByTagName('text')[0].getBBox();
            return [textSize.width, textSize.height];
        })
        .position(d => {
            return [d.users, d.orgs];
        })
        .component(textLabel);

    const points = fc
        .seriesSvgPoint()
        .size(10)
        .crossValue(d => d.users)
        .mainValue(d => d.orgs);

    const line = fc
        .seriesSvgLine()
        .crossValue(d => d[0])
        .mainValue(d => d[1]);

    const multiSeries = fc
        .seriesSvgMulti()
        .series([points, labels, line])
        .mapping((data, index, series) => {
            switch (series[index]) {
                case line:
                    return data.diagonal;
                default:
                    return data.scatter;
            }
        });

    const extent = fc
        .extentLinear()
        .accessors([d => d.orgs, d => d.users])
        .pad([0.05, 0.2]);

    const data = {
        scatter,
        // add a two-point data-series for the diagonal line
        diagonal: [
            [-1e6, -1e6],
            [1e6, 1e6]
        ]
    };

    // create a chart
    const chart = fc
        .chartCartesian(d3.scaleLinear(), d3.scaleLinear())
        .yDomain(extent(scatter))
        .xDomain(extent(scatter))
        .yOrient('left')
        .xLabel('GitHub Users')
        .yLabel('GitHub Organisations')
        .chartLabel('GitHub Organizations vs. Individuals')
        .svgPlotArea(multiSeries);

    // render
    d3.select('#chart')
        .datum(data)
        .call(chart);
});
