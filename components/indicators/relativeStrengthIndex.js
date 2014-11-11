(function (d3, sl) {
    'use strict';

    sl.indicators.rsi = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            samplePeriods = 0,
            css = '';

        var upper = null,
            centre = null,
            lower = null;

        var rsi = function (selection) {

            upper = selection.append("line")
                .attr('class', 'marker upper')
                .attr('x1', xScale.range()[0]) 
                .attr('y1', yScale(70))
                .attr('x2', xScale.range()[1]) 
                .attr('y2', yScale(70));

            centre = selection.append("line")
                .attr('class', 'marker centre')
                .attr('x1', xScale.range()[0]) 
                .attr('y1', yScale(50))
                .attr('x2', xScale.range()[1]) 
                .attr('y2', yScale(50));

            lower = selection.append("line")
                .attr('class', 'marker lower')
                .attr('x1', xScale.range()[0]) 
                .attr('y1', yScale(30))
                .attr('x2', xScale.range()[1]) 
                .attr('y2', yScale(30));

            var line = d3.svg.line();
            line.x(function (d) { return xScale(d.date); });

            selection.each(function (data) {

                if (samplePeriods === 0) {
                    line.y(function (d) { return yScale(0); });
                }
                else {
                    line.y(function (d, i) {

                        var current = i,
                            up = [],
                            down = [];

                        while((up.length < samplePeriods || down.length < samplePeriods) && current >= 0) {
                            if( data[current].close > data[current].open && up.length < samplePeriods) 
                                up.push(data[current].close - data[current].open);
                            else if(down.length < samplePeriods) 
                                down.push(data[current].open - data[current].close);
                            current--;
                        }
                        
                        var rsi = (up.length > 0 && down.length > 0 ) ?
                            100 - (100/(1+(d3.mean(up)/d3.mean(down)))) :
                            0;

                        return yScale(rsi);
                    });
                }

                var path = d3.select(this).selectAll('.rsi')
                    .data([data]);

                path.enter().append('path');

                path.attr('d', line)
                    .classed('rsi', true)
                    .classed(css, true);

                path.exit().remove();
            });
        };

        rsi.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return rsi;
        };

        rsi.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return rsi;
        };

        rsi.samplePeriods = function (value) {
            if (!arguments.length) {
                return samplePeriods;
            }
            samplePeriods = value;
            return rsi;
        };

        rsi.css = function (value) {
            if (!arguments.length) {
                return css;
            }
            css = value;
            return rsi;
        };

        return rsi;
    };
}(d3, sl));