(function(d3, fc) {
    var dataPoints = 100000;
    var compressedDataPoints = 1000;
    var width = 600, height = 250;

    var data = fc.data.random.walk()(dataPoints);
    data = data.map(function(d, i) {
        return {x: i, y: d};
    });
    var compressedData = fc.data.samplers.modeMedianBucket()
                .number(compressedDataPoints).field('y')(data);

    var chart = fc.chart.cartesian()
        .xDomain(fc.util.extent().fields(['x'])(compressedData))
        .yDomain(fc.util.extent().fields(['y'])(compressedData));

    var gridlines = fc.annotation.gridline();
    var line = fc.series.line().xValue('x').yValue('y');

    var multi = fc.series.multi()
        .series([gridlines, line]);
    chart.plotArea(multi);

    d3.select('#chart')
        .append('svg')
        .style({
            height: height,
            width: width
        })
        .datum(compressedData)
        .call(chart);
})(d3, fc);
