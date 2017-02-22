d3.text('repeat-data.csv', function(text) {
    var data = d3.csvParseRows(text, function(d) {
        return d.map(function(s) { return Number(s); });
    });

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var width = 500;
    var height = 250;
    var container = d3.select('#repeat-svg');

    var xScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, 60])
        .range([height, 0]);

    var svgLine = fc.seriesSvgLine()
        .crossValue(function(_, i) { return i; })
        .mainValue(function(d) { return d; });

    var svgRepeat = fc.seriesSvgRepeat()
        .xScale(xScale)
        .yScale(yScale)
        .series(svgLine)
        .decorate(function(sel) {
            sel.attr('stroke', function(_, i) { return color(i); });
        });

    container.append('g')
        .datum(data)
        .call(svgRepeat);

    var canvas = d3.select('#repeat-canvas').node();
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');

    var canvasLine = fc.seriesCanvasLine()
        .crossValue(function(_, i) { return i; })
        .mainValue(function(d) { return d; });

    var canvasMulti = fc.seriesCanvasRepeat()
        .xScale(xScale)
        .yScale(yScale)
        .context(ctx)
        .series(canvasLine)
        .decorate(function(context, _, index) {
            context.strokeStyle = color(index);
        });

    canvasMulti(data);
});
