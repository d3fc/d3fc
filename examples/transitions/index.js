// generate some random data
const data = d3.range(40).map(Math.random);

// render a bar series via the cartesian chart component
const barSeries = fc
    .seriesSvgBar()
    .key(function(d) {
        return d;
    })
    .crossValue(function(_, i) {
        return i;
    })
    .mainValue(function(d) {
        return d;
    });

const chart = fc
    .chartCartesian(d3.scaleLinear(), d3.scaleLinear())
    .xDomain([-1, data.length])
    .svgPlotArea(barSeries);

let index = 0;
function render() {
    if (index === data.length) {
        return; // we're all done!
    }

    // perform a single iteration of the bubble sort
    for (let j = index; j > 0; j--) {
        if (data[j] < data[j - 1]) {
            const temp = data[j];
            data[j] = data[j - 1];
            data[j - 1] = temp;
        }
    }
    index++;

    // re-render the chart
    d3.select('#chart')
        .datum(data)
        .transition()
        .duration(500)
        .call(chart);
}

setInterval(render, 1000);
render();
