// creates a few common elements that are used across the various examples. This fixture code
// should be kept very very simple!
function createFixture(elementId) {
    var data = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select(elementId)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, ['high', 'low']))
        .range([height, 0])
        .nice();

    return {
        data: data,
        dimensions: { width: width, height: height },
        xScale: dateScale,
        yScale: priceScale,
        container: container
    }
}
