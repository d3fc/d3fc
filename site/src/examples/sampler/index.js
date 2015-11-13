/* global d3:false, fc:false */
'use strict';
var example = {};

example.sampler = fc.data.sampler.largestTriangleThreeBucket()
    .xValue(function(d) { return d.date; })
    .yValue(function(d) { return d.temperature; });
example.numberOfBuckets = 768;

example.tooltip = function() {

    var formatters = {
        date: d3.time.format('%H:%m %e %b %Y'),
        temp: d3.format('.2f')
    };

    function format(type, value) {
        return formatters[type](value);
    }

    var items = [
        function(d) { return format('temp', d.temperature) + '°C ' + format('date', d.date); }
    ];

    var tooltip = function(selection) {

        var container = selection.enter()
            .append('g')
            .attr({
                'class': 'info',
                'transform': 'translate(5, 5)'
            });

        container = selection.select('g.info');

        var tspan = container.selectAll('text')
            .data(items);

        tspan.enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 170)
            .attr('height', 15);
        tspan.enter()
            .append('text')
            .attr('x', 4)
            .attr('dy', 12);

        tspan.text(function(d) {
            return d(container.datum().datum);
        });
    };

    return tooltip;
};

example.mainChart = function() {

    var event = d3.dispatch('crosshair', 'zoom');

    var gridlines = fc.annotation.gridline()
        .yTicks(3);

    var lineSeries = fc.series.line()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.temperature; });

    var tooltip = example.tooltip();

    var crosshairs = fc.tool.crosshair()
        .decorate(tooltip)
        .on('trackingstart.link', event.crosshair)
        .on('trackingmove.link', event.crosshair)
        .on('trackingend.link', event.crosshair)
        .xLabel('')
        .yLabel('');

    var multi = fc.series.multi()
        .series([gridlines, lineSeries, crosshairs])
        .mapping(function(series) {
            switch (series) {
            case crosshairs:
                return this.shared.crosshairs;
            default:
                return this;
            }
        });

    var xScale = fc.scale.dateTime();

    var chart = fc.chart.cartesian(xScale)
        .margin({
            bottom: 20,
            right: 60
        })
        .xTicks(10)
        .yTicks(3)
        .plotArea(multi);

    function mainChart(selection) {

        selection.each(function(data) {

            crosshairs.snap(fc.util.seriesPointSnapXOnly(lineSeries, data));

            chart.xDomain(fc.util.extent().fields(['date'])(data))
                .yDomain(fc.util.extent().fields(['temperature'])(data))
                .yNice();

            var container = d3.select(this)
                .call(chart);

            // Zoom goes nuts if you re-use an instance and also can't set
            // the scale on zoom until it's been initialised by chart.
            var zoom = d3.behavior.zoom()
                .on('zoom', function() {
                    event.zoom.call(this, xScale.domain());
                })
                .x(xScale);

            container.call(zoom);
        });
    }

    d3.rebind(mainChart, event, 'on');

    return mainChart;
};

example.navigatorChart = function() {
    var event = d3.dispatch('brush');

    var chart = fc.chart.cartesian(fc.scale.dateTime())
        .margin({
            top: 10,
            bottom: 20,
            right: 60
        })
        .xTicks(3)
        .yTicks(0);

    var gridlines = fc.annotation.gridline()
        .xTicks(3)
        .yTicks(0);

    var area = fc.series.area()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.temperature; })
        .decorate(function(sel) {
            sel.enter().style({fill: '#9cf'});
        });

    var line = fc.series.line()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.temperature; })
        .decorate(function(sel) {
            sel.enter().style({stroke: '#06c'});
        });

    // TODO: the brush causes a partial render which can glitch things
    var brush = d3.svg.brush()
        .on('brush', function() {
            var domain = [brush.extent()[0][0], brush.extent()[1][0]];
            // Scales with a domain delta of 0 === NaN
            if (domain[0] - domain[1] !== 0) {
                event.brush.call(this, domain);
            }
        });

    var multi = fc.series.multi()
        .series([gridlines, area, line, brush])
        .mapping(function(series) {
            // Need to set the extent AFTER the scales
            // are set AND their ranges defined
            if (series === brush) {
                // Use chart.yDomain to include `nice` adjustments
                brush.extent([
                    [this.shared.dateDomain[0], chart.yDomain()[0]],
                    [this.shared.dateDomain[1], chart.yDomain()[1]]
                ]);
            }
            return this;
        })
        .decorate(function(sel) {
            var height = d3.select(sel.node().parentNode).layout('height');
            sel.enter()
                .selectAll('.resize.e>rect, .resize.w>rect')
                .style('visibility', 'visible')
                .attr('y', height / 4)
                .attr('rx', 4)
                .attr('ry', 4);

            // As a y scale is set on the brush (multi does this),
            // the brush component resets the height of the rect on every redraw,
            // as such it has to be overridden within the update selection,
            // rather than the enter selection
            sel.selectAll('.resize.e>rect, .resize.w>rect')
                .attr('height', height / 2);
        });

    chart.plotArea(multi);

    function navigatorChart(selection) {

        selection.each(function(data) {

            chart.xDomain(data.shared.navigatorDateDomain)
                .yDomain(data.shared.navigatorYDomain)
                .yNice();

            area.y0Value(chart.yDomain()[0]);

            d3.select(this)
              .call(chart);
        });
    }

    d3.rebind(navigatorChart, event, 'on');

    return navigatorChart;
};

example.lowBarrel = function() {
    var event = d3.dispatch('navigate', 'crosshair');

    var bisector = d3.bisector(function(d) { return d.date; });

    var mainChart = example.mainChart()
        .on('crosshair', event.crosshair)
        .on('zoom', event.navigate);

    var navigatorChart = example.navigatorChart()
        .on('brush', event.navigate);

    function lowBarrel(selection) {

        selection.each(function(data) {
            // Calculate visible data for main chart
            var visibleData = data.slice(
                // Pad and clamp the bisector values to ensure extents can be calculated
                Math.max(0, bisector.left(data, data.shared.dateDomain[0]) - 1),
                Math.min(bisector.right(data, data.shared.dateDomain[1]) + 1, data.length)
            );

            var bucketSize = Math.ceil(visibleData.length / example.numberOfBuckets);
            example.sampler.bucketSize(bucketSize);

            visibleData = example.sampler(visibleData);
            visibleData.shared = data.shared;

            var container = d3.select(this);

            container.select('svg.main')
                .datum(visibleData)
                .call(mainChart);

            container.select('svg.navigator')
                .datum(data.navigatorData)
                .call(navigatorChart);
        });
    }

    d3.rebind(lowBarrel, event, 'on');

    return lowBarrel;
};

// Wrap in function to demonstrate no global access to state variables
d3.csv('data.csv', function(err, data) {

    var animationTimeout;

    if (err) {
        //cry
    }

    // parse the dates and simplify property access
    data = data.map(function(d) {
        return d ? {
            date: new Date(Number(d.time)),
            temperature: Number(d.temp)
        } : null;
    });

    // Pass through a shared reference to info about the data. resampling
    // removes this link.
    data.shared = {};

    // Enhance data with interactive state
    data.shared.crosshairs = [];
    var maxDate = data[data.length - 1].date;
    var minDate = data[0].date;
    data.shared.dateDomain = [minDate, maxDate];


    var staticDataSampler = fc.data.sampler.largestTriangleThreeBucket()
        .bucketSize(300)
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.temperature; });

    data.navigatorData = staticDataSampler(data);
    data.navigatorData.shared = data.shared;

    data.shared.navigatorDateDomain = fc.util.extent().fields('date')(data.navigatorData);
    data.shared.navigatorYDomain = fc.util.extent().fields('temperature')(data.navigatorData);

    var container = d3.select('#low-barrel')
        .layout();

    var render = fc.util.render(function() {
        container.datum(data)
            .call(lowBarrel)
            .layoutSuspended(true);
    });

    var lowBarrel = example.lowBarrel()
        .on('crosshair', render)
        .on('navigate', function(domain) {
            data.shared.dateDomain = [
                new Date(Math.max(domain[0], data.shared.navigatorDateDomain[0])),
                new Date(Math.min(domain[1], data.shared.navigatorDateDomain[1]))
            ];
            render();
        });

    render();

    function animate() {
        var randStart = Math.floor(Math.random() * data.length);
        var randEnd = randStart + Math.floor(Math.random() * Math.min(5000, data.length - randStart));

        transition(randStart, randEnd);
        if (Math.random() > 0.5) {
            animationTimeout = setTimeout(zoomOut, 5000);
        } else {
            animationTimeout = setTimeout(animate, 5000);
        }
    }

    function zoomOut() {
        transition(0, data.length - 1);
        animationTimeout = setTimeout(animate, 5000);
    }

    function transition(start, end) {
        if (start === end) { return; }

        d3.transition().delay(0).duration(1000)
            .tween('path', function() {
                var bisector = d3.bisector(function(d) { return d.date; });

                var startPointer = Math.max(0, bisector.left(data, data.shared.dateDomain[0]) - 1);
                var endPointer = Math.min(bisector.right(data, data.shared.dateDomain[1]) + 1, data.length);

                var diffLeft = start - startPointer;
                var diffRight = end - endPointer;
                return function(i) {
                    var leftThisTick = Math.floor(diffLeft * i);
                    var rightThisTick = Math.floor(diffRight * i);
                    data.shared.dateDomain = ([data[startPointer + leftThisTick].date,
                        data[endPointer + rightThisTick].date]);
                    render();
                };
            })
            .each('end', function() {
                data.shared.dateDomain = ([data[start].date, data[end].date]);
                render();
            });
    }
    animate();

    // Bind events for controls.
    d3.select('#low-barrel').on('mouseenter', function() {
        clearTimeout(animationTimeout);
        d3.select('#animation-checkbox')[0][0].checked = false;
    });

    d3.select('#animation-checkbox').on('change', function() {
        if (this.checked) {
            animate();
        } else {
            clearTimeout(animationTimeout);
        }
    });

    d3.select('#three-bucket').on('click', function() {
        example.sampler = fc.data.sampler.largestTriangleThreeBucket()
            .xValue(function(d) { return d.date; })
            .yValue(function(d) { return d.temperature; });
        render();
    });

    d3.select('#mode-median').on('click', function() {
        example.sampler = fc.data.sampler.modeMedian()
            .value(function(d) { return d.temperature; });
        render();
    });
});
