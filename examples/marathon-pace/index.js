// sum the splits and round to the nearest 30 mins
const bucketByHour = splits => {
    const secondsPerHour = 60 * 60;
    const hours = d3.sum(splits) / secondsPerHour;
    return Math.floor(hours * 2) / 2;
};

// the splits CSV file is the split times (in seconds) between each mile on the marathon
// for ~7000 athletes
d3.text('splits.csv').then(text => {
    const splits = d3.csvParseRows(text, d => d.map(Number));

    // group into buckets
    let grouped = d3
        .groups(splits, bucketByHour)
        .map(([key, values]) => ({ key, values }))
        .sort((a, b) => d3.ascending(+a.key, +b.key));

    grouped.forEach(g => {
        // Each bucket contains all the splits for the given time interval. Here we
        // reduce them down to a single array of splits giving the mean.
        g.mean = d3
            .range(0, 27)
            .map((d, i) => d3.mean(g.values.map(h => h[i])))
            // and convert from seconds per mile to mph
            .map(d => 60 / (d / 60));
        g.datapoints = g.values.length;
    });

    // use d3.pairs to pair the data allowing us to render the data as bands
    grouped = d3
        .pairs(grouped)
        .map(d => {
            const mean = d[0].mean.map((r, i) => ({
                y0: r,
                y1: d[1].mean[i]
            }));
            mean.upperKey = d[0].key;
            mean.lowerKey = d[1].key;
            mean.datapoints = d[0].datapoints;
            return mean;
        })
        // remove any that don't have many points
        .filter(d => d.datapoints > 100);

    // construct an array of annotations to label the bands
    const annotations = grouped.map(d => {
        const f = d3.format('.1f');
        return {
            time: f(d.upperKey) + ' - ' + f(d.lowerKey),
            mph: (d[26].y1 + d[26].y0) / 2
        };
    });

    const gridlines = fc.annotationSvgGridline();

    const series = fc
        .seriesSvgArea()
        .crossValue((d, i) => i)
        .mainValue(d => d.y0)
        .baseValue(d => d.y1)
        .curve(d3.curveCatmullRom.alpha(0.5));

    const annotation = fc
        .annotationSvgLine()
        .value(d => d.mph)
        .label(d => d.time);

    const multi = fc
        .seriesSvgMulti()
        .series(
            [gridlines].concat(grouped.map(() => series).concat(annotation))
        )
        .mapping(
            (data, index) =>
                // the gridlines are not bound to data, so skip the first index
                data[index - 1]
        )
        .decorate(sel =>
            // make the bands pretty!
            sel.attr('fill', (d, i) => d3.interpolateSpectral(i / 12))
        );

    const chart = fc
        .chartCartesian(d3.scaleLinear(), d3.scaleLinear())
        .xDomain([0, 26])
        .yDomain([3, 11])
        .yOrient('left')
        .yLabel('Speed (mph)')
        .xLabel('Distance (miles)')
        .chartLabel('London Marathon 2016 Pacing vs. Finish Time')
        .svgPlotArea(multi);

    d3.select('#chart')
        .datum(grouped.concat([annotations]))
        .call(chart);
});
