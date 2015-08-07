(function(d3, fc) {
    'use strict';

    // SVG viewbox constants
    var WIDTH = 1024, HEIGHT = 576;

    // Obviously you should use ES6 modules and mutiple files for this. I'm
    // trying to keep the example as simple (and copy/paste-able) as possible.
    var basecoin = {};

    basecoin.verticalLines = function() {

        return function(selection) {

            selection.each(function(data) {

                var xScale = d3.time.scale()
                    .domain(data.xDomain)
                    // Use the full width
                    .range([0, WIDTH]);

                // Use the simplest scale we can get away with
                var yScale = d3.scale.linear()
                    // Define an arbitrary domain
                    .domain([0, 1])
                    // Use the full height
                    .range([HEIGHT, 0]);

                var line = fc.annotation.line()
                    .value(function(d) { return d.date; })
                    .orient('vertical')
                    .xScale(xScale)
                    .yScale(yScale);

                d3.select(this)
                    .datum(data)
                    .call(line);
            });
        };
    };

    basecoin.gridlines = function() {

        return function(selection) {

            selection.each(function(data) {

                // Use the simplest scale we can get away with
                var xScale = d3.scale.linear()
                    .domain([data[0].date, data[data.length - 1].date])
                    // Use the full width
                    .range([0, WIDTH]);

                // Use the simplest scale we can get away with
                var yScale = d3.scale.linear()
                    // Define an arbitrary domain
                    .domain([0, 1])
                    // Use the full height
                    .range([HEIGHT, 0]);

                var gridline = fc.annotation.gridline()
                    .xScale(xScale)
                    .yScale(yScale)
                    .xTicks(40)
                    .yTicks(20);

                d3.select(this)
                    .call(gridline);
            });
        };
    };

    basecoin.candlestick = function() {

        var xScale = fc.scale.dateTime(),
            yScale = d3.scale.linear();

        var candlestick = fc.svg.candlestick()
            .x(function(d) { return xScale(d.date); })
            .open(function(d) { return yScale(d.open); })
            .high(function(d) { return yScale(d.high); })
            .low(function(d) { return yScale(d.low); })
            .close(function(d) { return yScale(d.close); })
            .width(5);

        var upDataJoin = fc.util.dataJoin()
            .selector('path.up')
            .element('path')
            .attr('class', 'up');

        var downDataJoin = fc.util.dataJoin()
            .selector('path.down')
            .element('path')
            .attr('class', 'down');

        var optimisedCandlestick = function(selection) {
            selection.each(function(data) {
                var upData = data.filter(function(d) { return d.open < d.close; }),
                    downData = data.filter(function(d) { return d.open >= d.close; });

                upDataJoin(this, [upData])
                    .attr('d', candlestick);

                downDataJoin(this, [downData])
                    .attr('d', candlestick);
            });
        };

        optimisedCandlestick.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return optimisedCandlestick;
        };
        optimisedCandlestick.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return optimisedCandlestick;
        };

        return optimisedCandlestick;
    };

    basecoin.series = function() {

        return function(selection) {

            selection.each(function(data) {

                var xScale = d3.time.scale()
                    .domain([data[0].date, data[data.length - 1].date])
                    // Modify the range so that the series only takes up left half the width
                    .range([0, WIDTH * 0.5]);

                var yScale = d3.scale.linear()
                    .domain(fc.util.extent(data, ['low', 'high']))
                    // Modify the range so that the series only takes up middle third of the the width
                    .range([HEIGHT * 0.66, HEIGHT * 0.33]);

                var candlestick = basecoin.candlestick();

                fc.indicator.algorithm.bollingerBands()
                    // Modify the window size so that we more closely track the data
                    .windowSize(8)
                    // Modify the multiplier to narrow the gap between the bands
                    .multiplier(1)(data);

                fc.indicator.algorithm.exponentialMovingAverage()
                    // Use a different window size so that the indicators occasionally touch
                    .windowSize(3)(data);

                var bollingerBands = fc.indicator.renderer.bollingerBands();

                var ema = fc.series.line()
                    // Reference the value computed by the EMA algorithm
                    .yValue(function(d) { return d.exponentialMovingAverage; });

                var multi = fc.series.multi()
                    .xScale(xScale)
                    .yScale(yScale)
                    .series([candlestick, bollingerBands, ema])
                    .decorate(function(g) {
                        g.enter()
                            .attr('class', function(d, i) {
                                return 'multi ' + ['candlestick', 'bollinger-bands', 'ema'][i];
                            });
                    });

                d3.select(this)
                    .call(multi);
            });
        };
    };

    basecoin.labels = function() {

        return function(selection) {

            selection.each(function(data) {

                var xScale = d3.time.scale()
                    .domain(data.xDomain)
                    // Use the full width
                    .range([0, WIDTH]);

                var yScale = d3.scale.linear()
                    // Match the output extent of Math.random()
                    .domain([0, 1])
                    // Use the full height to amplify the relative spacing of the labels
                    // (minus the height of the labels themselves)
                    .range([HEIGHT - 14, 0]);

                var dataJoin = fc.util.dataJoin()
                    // Join on any g descendents
                    .selector('g')
                    // Create any missing as g elements
                    .element('g')
                    // Key the nodes on the x value
                    .key(function(d) { return d.date; });

                var update = dataJoin(this, data);

                var enter = update.enter();

                // Add a path element only when a g first enters the document
                enter.append('path')
                    // Pick between a down arrow or an up arrow and colour appropriately
                    .attr('d', function(d) {
                        return d.open < d.close ?
                            'M 0 14 L 8 0 L 15 14 Z' : 'M 0 0 L 8 14 L 15 0 Z';
                    })
                    .attr('fill', function(d) {
                        return d.open < d.close ?
                            'green' : 'red';
                    });

                // Add a text element only when a g first enters the document
                enter.append('text')
                    .attr({
                        'class': 'label',
                        // Offset to avoid the arrow
                        'x': 18,
                        'y': 12
                    })
                    .text(function(d) {
                        return d.close.toFixed(3);
                    });

                // Position the g on every invocation
                update.attr('transform', function(d) {
                    return 'translate(' + xScale(d.date) + ',' + yScale(d.offset) + ')';
                });
            });
        };
    };

    var dataGenerator = fc.data.random.financial()
        .mu(0.2)                     // % drift
        .sigma(0.05)                 // % volatility
        .filter(fc.util.fn.identity) // don't filter weekends
        .startDate(new Date(2014, 1, 1));

    function enhanceDataItem(d, i, data) {
        // Mark data points which match the sequence
        var sequenceValue = (i % (data.length / 2)) / 10;
        d.highlight = [1, 2, 3, 5, 8].indexOf(sequenceValue) > -1;
        // Add random offset for labels
        d.offset = Math.random();
        return d;
    }

    var data = dataGenerator(300)
        .map(enhanceDataItem);

    var frame = 0;

    var frameTimings = [];

    function render() {
        frameTimings.push(performance.now());

        var d = dataGenerator(1)[0];
        d = enhanceDataItem(d, data.length + frame, data);

        // Roll the data buffer
        data.shift();
        data.push(d);

        // Filter to only show vertical lines and labels for the marked data points
        var highlightedData = data.filter(function(d) {
            return d.highlight;
        });
        // Scales which receive a subset of the data still it's full extent
        highlightedData.xDomain = [data[0].date, data[data.length - 1].date];

        var verticalLines = basecoin.verticalLines();

        d3.select('#vertical-lines')
            .datum(highlightedData)
            .call(verticalLines);

        var gridlines = basecoin.gridlines();

        d3.select('#gridlines')
            .datum(data)
            .call(gridlines);

        var series = basecoin.series();

        d3.select('#series')
            // Filter to only show the series for the first half of the data
            .datum(data.filter(function(d, i) { return i < 150; }))
            .call(series);

        var labels = basecoin.labels();

        d3.select('#labels')
            .datum(highlightedData)
            .call(labels);

        if (frame % 300 === 0) {
            var sum = frameTimings.reduce(function(sum, d, i, arr) {
                if (i < arr.length - 1) {
                    sum += arr[i + 1] - d;
                }
                return sum;
            }, 0);
            console.log('avg', sum / (frameTimings.length - 1));
            frameTimings.length = 0;
        }

        frame++;
        requestAnimationFrame(render);
    }

    render();

})(d3, fc);
