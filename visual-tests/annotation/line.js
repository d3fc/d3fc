(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#line')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields(['date'])(data))
        .range([100, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['high', 'low'])(data))
        .range([height, 0])
        .nice();

    // Create the OHLC series
    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add the primary OHLC series
    container.append('g')
        .datum(data)
        .call(ohlc);

    // Create the annotations
    var annotation = fc.annotation.line()
        .xScale(dateScale)
        .yScale(priceScale);

    var lastCloseAnnotation = fc.annotation.line()
        .value(function(d) { return d.close; })
        .xScale(dateScale)
        .yScale(priceScale)
        .label(function(d) {
            return '[Static] Last close: ' + d3.format('.6f')(d.close);
        });

    var annotationDecimal = fc.annotation.line()
        .xScale(dateScale)
        .yScale(priceScale)
        .decorate(function(selection) {
            selection.select('line')
                .style('stroke', 'red');
            selection.enter()
                .select('g.left-handle')
                .append('circle')
                .attr('r', 5)
                .attr('fill', 'black');
        })
        .label(function(d) {
            return 'Animated: ' + d3.format('.3f')(d);
        });

    var verticalAnnotation = fc.annotation.line()
        .xScale(dateScale)
        .yScale(priceScale)
        .orient('vertical')
        .label(function(d) {
            return d3.time.format('%Y-%m-%d')(d);
        });

    // Add the annotations to the chart
    container
        .append('g')
        .attr('id', 'annotation')
        .datum([100, 101.5])
        .call(annotation);

    container
        .append('g')
        .attr('id', 'lastCloseAnnotation')
        .datum([data[data.length - 1]])
        .call(lastCloseAnnotation);

    container
        .append('g')
        .attr('id', 'annotationDecimal')
        .datum([100.675])
        .call(annotationDecimal);

    container
        .append('g')
        .attr('id', 'verticalAnnotation')
        .datum([data[20].date, data[10].date])
        .call(verticalAnnotation);

    setInterval(function() {
        // Update an annotation
        container
            .select('#annotation')
            .datum([randomValue()])
            .call(annotation);

        // Update an annotation with a transition
        var decimalData = [randomValue(), randomValue(), randomValue()];
        decimalData.splice(0, Math.floor(Math.random() * 2));
        container
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
