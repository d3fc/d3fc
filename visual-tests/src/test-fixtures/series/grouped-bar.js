(function(d3, fc) {
    'use strict';

    var data = [
        {
            size: 'small',
            flavour: 'chocolate',
            sales: 3
        },
        {
            size: 'small',
            flavour: 'vanilla',
            sales: 12
        },
        {
            size: 'medium',
            flavour: 'chocolate',
            sales: 16
        },
        {
            size: 'medium',
            flavour: 'vanilla',
            sales: 2
        },
        {
            size: 'large',
            flavour: 'chocolate',
            sales: 3
        },
        {
            size: 'large',
            flavour: 'vanilla',
            sales: 18
        },
        {
            size: 'extra-large',
            flavour: 'vanilla',
            sales: 20
        },
        {
            size: 'extra-large',
            flavour: 'chocolate',
            sales: 120
        }
    ];

    var width = 600,
        height = 250,
        axisHeight = 25,
        plotHeight = height - axisHeight;

    var chart = d3.select('#grouped-bar')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var axisContainer = chart.append('g')
        .classed('axis', true)
        .attr('transform', 'translate(0, ' + (plotHeight) + ')');

    var plotArea = chart.append('g')
        .classed('plot-area', true)
        .attr({
            height: height - axisHeight,
            width: width
        });

    function render(data) {

        var flavourScale = d3.scale.ordinal()
            .domain(['chocolate', 'vanilla'])
            .rangePoints([0, width], 1);

        var salesScale = d3.scale.linear()
            .domain([0, 20])
            .range([plotHeight, 0])
            .nice();

        var colorScale = d3.scale.category20();

        var bar = fc.series.bar()
            .xValue(function(d) { return d.flavour; })
            .yValue(function(d) { return d.sales; })
            .barWidth(20);

        var cycle = fc.series.group()
            .yScale(salesScale)
            .xScale(flavourScale)
            .subSeries(bar)
            .xValue(function(d) { return d.flavour; })
            .groupValue(function(d) { return d.size; })
            .decorate(function(g) {
                g.enter()
                    .attr('fill', function(d, i) {
                        return colorScale(i);
                    });
            });

        plotArea.datum(data)
            .call(cycle);

        // Create the axes
        var xAxis = d3.svg.axis()
            .scale(flavourScale)
            .orient('bottom');

        // Add the axes to the chart
        axisContainer.call(xAxis);
    }

    render(data);

})(d3, fc);
