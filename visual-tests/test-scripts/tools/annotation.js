(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var chart = d3.select('#annotation'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, ['high', 'low']))
        .range([chartLayout.getPlotAreaHeight(), 0])
        .nice();

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(5);

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('right')
        .ticks(5);

    // Add the axes to the chart
    chartLayout.getAxisContainer('bottom').call(dateAxis);
    chartLayout.getAxisContainer('right').call(priceAxis);

    // Create the OHLC series
    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add the primary OHLC series
    chartLayout.getPlotArea().append('g')
        .attr('class', 'series')
        .datum(data)
        .call(ohlc);

    // Create the annotations
    var annotation = fc.tools.annotation()
        .xScale(dateScale)
        .yScale(priceScale)
        .padding(10);

    var lastCloseAnnotation = fc.tools.annotation()
        .yValue(function(d) { return d.close; })
        .xScale(dateScale)
        .yScale(priceScale)
        .padding(7)
        .label(function(d) {
            return '[Static] Last close: ' + d3.format('.6f')(d.close);
        });

    var annotationDecimal = fc.tools.annotation()
        .xScale(dateScale)
        .yScale(priceScale)
        .decorate(function(selection) {
            selection.select('line')
                .style('stroke', 'red');
            selection.select('text')
                .attr('x', dateScale.range()[1]);
        })
        .label(function(d) {
            return 'Animated: ' + d3.format('.3f')(d);
        });

    // Add the annotations to the chart
    chartLayout.getPlotArea()
        .append('g')
        .attr('id', 'annotation')
        .datum([100, 101.5])
        .call(annotation);

    chartLayout.getPlotArea()
        .append('g')
        .attr('id', 'lastCloseAnnotation')
        .datum([data[data.length - 1]])
        .call(lastCloseAnnotation);

    chartLayout.getPlotArea()
        .append('g')
        .attr('id', 'annotationDecimal')
        .datum([100.675])
        .call(annotationDecimal);

    setInterval(function() {
        // Update an annotation
        chartLayout.getPlotArea()
            .select('#annotation')
            .datum([randomValue()])
            .call(annotation);

        // Update an annotation with a transition
        var decimalData = [randomValue(), randomValue(), randomValue()];
        decimalData.splice(0, Math.floor(Math.random() * 2));
        chartLayout.getPlotArea()
            .select('#annotationDecimal')
            .datum(decimalData)
            .transition()
            .duration(2000)
            .call(annotationDecimal);
    }, 3000);

    function randomValue() {
        // In the range 100-102
        return Math.random() * 2 + 100;
    }

})(d3, fc);