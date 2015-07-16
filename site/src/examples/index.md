---
layout: example
title: Examples
---
<style>
.volume-row>td {
  padding-bottom: 20px;
}
svg, #low-barrel {
  width: 100%;
}
#low-barrel span {
  display:block;
  transform: rotate(90deg);
}


rect.background {
    fill: none;
    stroke: #C0C0C0;
}
.gridlines line {
    stroke: #C0C0C0;
    stroke-width: 0.5px;
}
.candlestick.up rect {
    fill: #fff;
}
.candlestick.down rect {
    fill: #7CB5EC;
}
rect.extent {
    fill: rgba(128, 179, 236, 0.3);
    stroke: #C0C0C0;
    stroke-width: 1px;
}
.line {
    stroke: rgba(128, 179, 236, 1);
    stroke-width: 1px;
}
.area {
    fill: rgba(128, 179, 236, 0.05);
}
.crosshairs .vertical {
    stroke: #C0C0C0;
    stroke-width: 1px;
}
.crosshairs .horizontal {
    display: none;
}
.info {
    font: 10px sans-serif;
}
.info rect {
    fill: rgba(249, 249, 249, 0.85);
    stroke: rgba(124, 181, 236, 1);
    stroke-width: 1px;
}
</style>

<div class="row">
  <div class="col-md-12">
    <h1>Advanced Charting Example</h1>
  </div>
</div>

<div class="row">
  <div class="col-md-4">
    <p>The example on this page shows how a more complex chart can be built using the d3fc components.</p>
    <p>The three charts that make up this example are each <a href="../components/chart/linearTimeSeries.html">linear time series</a> charts. The top-most chart uses the <a href="../components/annotation/gridlines.html">gridlines</a>, <a href="../components/tool/crosshairs.html">crosshairs</a> and <a href="../components/series/candlestick.html">candlestick</a> components, rendered via the <a href="../components/series/multi.html">multi-series</a> component. The volume and navigator charts uses a similar mix of components.</p>
    <p>These charts all share the same underlying data, however, this is enhanced with the data that represents the current interactive state.</p>
    <p>The top-most chart uses a tooltip component that was written specifically for this example application. It is added as a 'decoration' of the crosshair.</p>
  </div>
  <div class="col-md-8">
    <table id="low-barrel">
      <tr class="main-row">
        <td>
          <svg class="main" viewBox="0 0 640 220"></svg>
        </td>
        <td>
          <span>OHLC</span>
        </td>
      </tr>
      <tr class="volume-row">
        <td>
          <svg class="volume" viewBox="0 0 640 140"></svg>
        </td>
        <td>
          <span>Volume</span>
        </td>
      </tr>
      <tr class="navigator-row">
        <td>
          <svg class="navigator" viewBox="0 0 640 80"></svg>
        </td>
        <td></td>
      </tr>
    </table>
  </div>
</div>


<script type="text/javascript">
(function(d3, fc) {
    'use strict';

    // Assigning to fc is nasty but there's not a lot of choice I don't think...
    fc.tooltip = function() {

        var formatters = {
            date: d3.time.format('%A, %b %e, %Y'),
            price: d3.format('.2f'),
            volume: d3.format('0,5p')
        };

        function format(type, value) {
            return formatters[type](value);
        }

        var items = [
            function(d) { return format('date', d.date); },
            function(d) { return 'Open: ' + format('price', d.open); },
            function(d) { return 'High: ' + format('price', d.high); },
            function(d) { return 'Low: ' + format('price', d.low); },
            function(d) { return 'Close: ' + format('price', d.close); },
            function(d) { return 'Volume: ' + format('volume', d.volume); }
        ];

        var tooltip = function(selection) {

            var container = selection.enter()
                .append('g')
                .attr({
                    'class': 'info',
                    'transform': 'translate(5, 5)'
                });

            container.append('rect')
                .attr({
                    width: 130,
                    height: 76
                });

            container.append('text');

            container = selection.select('g.info');

            var tspan = container.select('text')
                .selectAll('tspan')
                .data(items);

            tspan.enter()
                .append('tspan')
                .attr('x', 4)
                .attr('dy', 12);

            tspan.text(function(d) {
                return d(container.datum().datum);
            });
        };

        return tooltip;
    };

})(d3, fc);

(function(d3, fc) {
    'use strict';

    var dataGenerator = fc.data.random.financial()
        .startDate(new Date(2014, 1, 1));

    var container = d3.select('#low-barrel')
        .datum(dataGenerator(250));

    function mainChart(selection) {

        var data = selection.datum();

        var gridlines = fc.annotation.gridline()
            .yTicks(3);

        var candlestick = fc.series.candlestick();

        var tooltip = fc.tooltip();

        var crosshairs = fc.tool.crosshair()
            .decorate(tooltip)
            .snap(fc.util.seriesPointSnap(candlestick, data))
            .on('trackingstart.link', render)
            .on('trackingmove.link', render)
            .on('trackingend.link', render)
            .xLabel('')
            .yLabel('');

        var multi = fc.series.multi()
            .series([gridlines, candlestick, crosshairs])
            .mapping(function(series) {
                switch (series) {
                    case crosshairs:
                        return data.crosshairs;
                    default:
                        return data;
                }
            });

        var chart = fc.chart.linearTimeSeries()
            .xDomain(data.dateDomain)
            .xTicks(0)
            .yDomain(fc.util.extent(data, ['high', 'low']))
            .yNice()
            .yTicks(3)
            .plotArea(multi);

        selection.call(chart);

        var zoom = d3.behavior.zoom()
            .x(chart.xScale())
            .on('zoom', function() {
                data.dateDomain[0] = chart.xDomain()[0];
                data.dateDomain[1] = chart.xDomain()[1];
                render();
            });

        selection.call(zoom);
    }

    function volumeChart(selection) {

        var data = selection.datum();

        var chart = fc.chart.linearTimeSeries()
            .xDomain(data.dateDomain)
            .yDomain(fc.util.extent(data, 'volume'))
            .yNice()
            .yTicks(2);

        var gridlines = fc.annotation.gridline()
            .yTicks(2);

        var bar = fc.series.bar()
            .yValue(function(d) { return d.volume; })
            .y0Value(chart.yDomain()[0]);

        var crosshairs = fc.tool.crosshair()
            .snap(fc.util.seriesPointSnap(bar, data))
            .xLabel('')
            .yLabel('')
            .on('trackingstart.link', render)
            .on('trackingmove.link', render)
            .on('trackingend.link', render);

        var multi = fc.series.multi()
            .series([gridlines, bar, crosshairs])
            .mapping(function(series) {
                switch (series) {
                    case crosshairs:
                        return data.crosshairs;
                    default:
                        return data;
                }
            });

        chart.plotArea(multi);

        selection.call(chart);
    }

    function navigatorChart(selection) {

        var data = selection.datum();

        var chart = fc.chart.linearTimeSeries()
            .xDomain(fc.util.extent(data, 'date'))
            .yDomain(fc.util.extent(data, 'close'))
            .yNice()
            .xTicks(3)
            .yTicks(0);

        var gridlines = fc.annotation.gridline()
            .xTicks(3)
            .yTicks(0);

        var line = fc.series.line();

        var area = fc.series.area()
            .y0Value(chart.yDomain()[0]);

        var brush = d3.svg.brush()
            .on('brush', function() {
                var domain = [brush.extent()[0][0], brush.extent()[1][0]];
                // Scales with a domain delta of 0 === NaN
                if (domain[0] - domain[1] !== 0) {
                    data.dateDomain = domain;
                    render();
                }
            });

        var multi = fc.series.multi()
            .series([gridlines, line, area, brush])
            .mapping(function(series) {
                // Need to set the extent AFTER the scales
                // are set AND their ranges defined
                if (series === brush) {
                    brush.extent([
                        [data.dateDomain[0], chart.yDomain()[0]],
                        [data.dateDomain[1], chart.yDomain()[1]]
                    ]);
                }
                return data;
            });

        chart.plotArea(multi);

        selection.call(chart);
    }

    function render() {
        var data = container.datum();

        // Enhance data with interactive state
        if (data.crosshairs == null) {
            data.crosshairs = [];
        }
        if (data.dateDomain == null) {
            var maxDate = fc.util.extent(container.datum(), 'date')[1];
            var dateScale = d3.time.scale()
                .domain([maxDate - 50 * 24 * 60 * 60 * 1000, maxDate])
                .nice();
            data.dateDomain = dateScale.domain();
        }

        // Calculate visible data for main/volume charts
        var bisector = d3.bisector(function(d) { return d.date; });
        var visibleData = data.slice(
            // Pad and clamp the bisector values to ensure extents can be calculated
            Math.max(0, bisector.left(data, data.dateDomain[0]) - 1),
            Math.min(bisector.right(data, data.dateDomain[1]) + 1, data.length)
        );
        visibleData.dateDomain = data.dateDomain;
        visibleData.crosshairs = data.crosshairs;

        //update viewBox values on the svg elements now that they've been sized properly
        function generateViewBox($el) {
            return '0 0 ' + $el.width() + ' ' + $el.height();
        }

        container.select('svg.main')
            .datum(visibleData)
            .call(mainChart)
            .attr('viewBox', generateViewBox($('svg.main')));

        container.select('svg.volume')
            .datum(visibleData)
            .call(volumeChart)
            .attr('viewBox', generateViewBox($('svg.volume')));

        container.select('svg.navigator')
            .call(navigatorChart)
            .attr('viewBox', generateViewBox($('svg.navigator')));
    }

    render();

})(d3, fc);

</script>

