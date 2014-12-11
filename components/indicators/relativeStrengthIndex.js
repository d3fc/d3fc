(function (d3, fc) {
    'use strict';

    /**
    * This component will generate an RSI data series on
    * a chart based on data generated in the format produced by the dataGenerator component.
    * 
    * @type {object}
    * @memberof fc.indicators
    * @namespace fc.indicators.rsi
    */
    fc.indicators.rsi = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            samplePeriods = 14,
            upperMarker = 70,
            lowerMarker = 30,
            lambda = 1.0,
            css = 'rsi',
            yValue = fc.utilities.valueAccessor("close");

        var upper = null,
            centre = null,
            lower = null;

        /**
        * Constructs a new instance of the RSI component.
        * 
        * @memberof fc.indicators.rsi
        * @param {selection} selection a D3 selection
        */
        var rsi = function (selection) {

            selection.selectAll('.marker').remove();

            upper = selection.append('line')
                .attr('class', 'marker upper')
                .attr('x1', xScale.range()[0])
                .attr('y1', yScale(upperMarker))
                .attr('x2', xScale.range()[1])
                .attr('y2', yScale(upperMarker));

            centre = selection.append('line')
                .attr('class', 'marker centre')
                .attr('x1', xScale.range()[0])
                .attr('y1', yScale(50))
                .attr('x2', xScale.range()[1])
                .attr('y2', yScale(50));

            lower = selection.append('line')
                .attr('class', 'marker lower')
                .attr('x1', xScale.range()[0])
                .attr('y1', yScale(lowerMarker))
                .attr('x2', xScale.range()[1])
                .attr('y2', yScale(lowerMarker));

            var line = d3.svg.line();
            line.x(function (d) { return xScale(d.date); });

            selection.each(function (data) {

                if (samplePeriods === 0) {
                    line.y(function (d) { return yScale(0); });
                } else {
                    line.y(function (d, i) {
                        var from = i - samplePeriods,
                        to = i,
                        up = [],
                        down = [];

                        if (from < 1) {
                            from = 1;
                        }

                        for (var offset = to; offset >= from; offset--) {
                            var dnow = data[offset],
                            dprev = data[offset - 1];

                            var weight = Math.pow(lambda, offset);
                            up.push(yValue(dnow) > yValue(dprev) ? (yValue(dnow) - yValue(dprev)) * weight : 0);
                            down.push(yValue(dnow) < yValue(dprev) ? (yValue(dprev) - yValue(dnow)) * weight : 0);
                        }

                        if (up.length <= 0 || down.length <= 0) {
                            return yScale(0);
                        }

                        var rsi = 100 - (100 / (1 + (d3.mean(up) / d3.mean(down))));
                        return yScale(rsi);
                    });
                }

                var path = d3.select(this).selectAll('.' + css)
                    .data([data]);

                path.enter().append('path');

                path.attr('d', line)
                    .classed(css, true);

                path.exit().remove();
            });
        };

        /**
        * Specifies the X scale which the tracker uses to locate its SVG elements. If not specified, returns
        * the current X scale, which defaults to an unmodified d3.time.scale
        * 
        * @memberof fc.indicators.rsi
        * @method xScale
        * @param {scale} scale a D3 scale
        */
        rsi.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return rsi;
        };

        /**
        * Specifies the Y scale which the tracker uses to locate its SVG elements. If not specified, returns
        * the current Y scale, which defaults to an unmodified d3.scale.linear.
        * 
        * @memberof fc.indicators.rsi
        * @method yScale
        * @param {scale} scale a D3 scale
        */
        rsi.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return rsi;
        };

        /**
        * Specifies the number of data samples used to calculate the RSI over, much like the number of
        * points for the moving average indicator. If not set the default value is 14, which is the
        * accepted value given by Wilder
        * 
        * @memberof fc.indicators.rsi
        * @method samplePeriods
        * @param {integer} value the number of periods
        */
        rsi.samplePeriods = function (value) {
            if (!arguments.length) {
                return samplePeriods;
            }
            samplePeriods = value < 0 ? 0 : value;
            return rsi;
        };

        /**
        * Specifies the location of the upper marker used to mark the level at which the market/instrument is
        * considered over bought. The default value of this 70%. The value is specified as a percentage so
        * 70 as opposed to 0.7.
        * 
        * @memberof fc.indicators.rsi
        * @method upperMarker
        * @param {number} value the value of the upper marker
        */
        rsi.upperMarker = function (value) {
            if (!arguments.length) {
                return upperMarker;
            }
            upperMarker = value > 100 ? 100 : (value < 0 ? 0 : value);
            return rsi;
        };

        /**
        * Specifies the location of the lower marker used to mark the level at which the market/instrument is
        * considered over sold. The default value of this 30%. The value is specified as a percentage so 30
        * as opposed to 0.3.
        * 
        * @memberof fc.indicators.rsi
        * @method lowerMarker
        * @param {number} value the value of the lower marker
        */
        rsi.lowerMarker = function (value) {
            if (!arguments.length) {
                return lowerMarker;
            }
            lowerMarker = value > 100 ? 100 : (value < 0 ? 0 : value);
            return rsi;
        };


        /**
        * Specifies the relative influence that the samples have on the Exponential Moving average
        * calculation. A value of 1 (Default value) will mean that every data sample will have equal
        * weight in the calculation. The most widely used values are in the region 0.92 to 0.98.
        * 
        * @memberof fc.indicators.rsi
        * @method lambda
        * @param {number} value the value of the lower marker
        */
        rsi.lambda = function (value) {
            if (!arguments.length) {
                return lambda;
            }
            lambda = value > 1.0 ? 1.0 : (value < 0.0 ? 0.0 : value);
            return rsi;
        };

        /**
        * Specifies the name of the data field which the component will follow. If not specified,
        * returns the 'close' property of each datapoint
        * 
        * @memberof fc.indicators.bollingerBands
        * @method yValue
        * @param {accessor} value a D3 accessor function which returns the Y value for a given point
        */
        rsi.yValue = function (value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return rsi;
        };

        return rsi;
    };
}(d3, fc));