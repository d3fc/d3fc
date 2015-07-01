// creates a few common elements that are used across the various examples. This fixture code
// should be kept very very simple!
function createFixture(elementId, desiredWidth, desiredHeight, numPoints, filter) {
    var dataGenerator = fc.data.random.financial()
        .startDate(new Date(2014, 1, 1));

    if (filter) {
        dataGenerator.filter(filter);
    }

    var data = dataGenerator(numPoints || 50);

    var width = desiredWidth || 600, height = desiredHeight || 250;

    var container = d3.select(elementId)
        .insert('svg', 'div')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent(data, 'date'))
        .range([0, width]);

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent(data, ['high', 'low']))
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
