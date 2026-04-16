// Axis label badge decoration on a Canvas bar chart via chartCartesian.
//
// Demonstrates:
// - Using .xDecorate() on chartCartesian to style individual tick labels
// - Axes are always SVG regardless of the canvas plot area
// - Badge backgrounds and conditional text styling on specific ticks

var data = fc.randomGeometricBrownianMotion().steps(30)(1);

var xScale = d3
    .scaleLinear()
    .domain([0, data.length - 1]);

var yScale = d3
    .scaleLinear()
    .domain(fc.extentLinear()(data));

// Define which ticks get special treatment
var highlighted = [10]; // blue badge
var flagged = [20]; // gold badge with flag marker

var bar = fc
    .seriesCanvasBar()
    .bandwidth(10)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .decorate(function(context, datum, index) {
        context.fillStyle = datum > 1 ? '#2164C2' : '#D6591C';
    });

var chart = fc
    .chartCartesian(xScale, yScale)
    .canvasPlotArea(bar)
    .xDecorate(function(s) {
        // On enter, insert a rect behind the text for badge backgrounds
        s.enter()
            .insert('rect', 'text')
            .attr('class', 'label-bg')
            .attr('rx', 4)
            .attr('ry', 4);

        // Style the badge background based on tick value
        s.select('.label-bg')
            .attr('fill', function(d) {
                if (highlighted.indexOf(d) !== -1) return '#4a90d9';
                if (flagged.indexOf(d) !== -1) return '#e8b84b';
                return 'none';
            })
            .attr('opacity', function(d) {
                if (highlighted.indexOf(d) !== -1 || flagged.indexOf(d) !== -1) return 1;
                return 0;
            });

        // Style the text color — white on colored badges, grey otherwise
        s.select('text')
            .style('fill', function(d) {
                if (highlighted.indexOf(d) !== -1 || flagged.indexOf(d) !== -1) return '#ffffff';
                return '#999999';
            })
            .style('font-weight', function(d) {
                if (highlighted.indexOf(d) !== -1 || flagged.indexOf(d) !== -1) return 'bold';
                return 'normal';
            });

        // Set final text content BEFORE measuring — flag marker must be
        // included in the bbox so the badge rect covers the full label
        s.select('text')
            .text(function(d) {
                if (flagged.indexOf(d) !== -1) return d + ' \u2691';
                return d;
            });

        // Measure text and size the badge rect to fit.
        // getBBox() doesn't account for the dy="0.71em" offset that
        // axisBottom applies to tick labels, so we add it manually.
        s.each(function(d) {
            var g = d3.select(this);
            var text = g.select('text').node();
            if (!text) return;
            var bbox = text.getBBox();
            var fontSize = parseFloat(getComputedStyle(text).fontSize);
            var dyOffset = fontSize * 0.71;
            var padX = 12;
            var padY = 6;
            g.select('.label-bg')
                .attr('x', bbox.x - padX / 2)
                .attr('y', bbox.y + dyOffset - padY / 2)
                .attr('width', bbox.width + padX)
                .attr('height', bbox.height + padY);
        });
    });

d3.select('#chart')
    .datum(data)
    .call(chart);
