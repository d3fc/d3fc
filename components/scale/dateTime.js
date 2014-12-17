(function(d3, fc) {
    'use strict';

    /**
    * This component provides a scale primarily used on the X axis of financial charts and
    * implements a time scale. It allows for the removal of time periods where the market may
    * be closed, namely weekends.
    * This scale also contains an option to pixel align when calculating the screen pixel from
    * the real value. This generally produces crisper graphics.
    *
    * @type {object}
    * @memberof fc.scale
    * @namespace fc.scale.dateTime
    */
    fc.scale.dateTime = function() {
        return dateTimeScale();
    };

    /**
    * Constructs a new instance of the dateTime scale component.
    *
    * @memberof fc.scale.dateTime
    * @param {d3.scale.linear} linear used in the copy constructor to copy the base linear
    * scale between the original and the copy.
    * @param {array} baseDomain used in the copy constructor to copy the base domain (Max
    * and Min) between the original and the copy.
    * @param {boolean} alignPixels used in the copy constructor to copy the pixel alignment
    * option between the original and the copy.
    * @param {boolean} hideWeekends used in the copy constructor to copy the hide weekends
    * option between the original and the copy.
    */
    function dateTimeScale(linear, baseDomain, alignPixels, hideWeekends, padEnds) {

        if (!arguments.length) {
            linear = d3.scale.linear();
            baseDomain = [new Date(0), new Date(0)];
            alignPixels = true;
            hideWeekends = false;
            padEnds = false;
        }

        /**
        * Used to scale a value from domain space to pixel space. This function is used primarily
        * to position elements on the X axis.
        *
        * @memberof fc.scale.dateTime
        * @method scale
        * @param {object} x the real world domain value to be scaled.
        * @returns the converted value in pixel space. This value is also pixel aligned if the
        * relevant options are set.
        */
        function scale(x) {
            var n = 0;
            if (typeof x === 'number') {
                // When scaling ticks.
                n = linear(x);
            } else {
                // When scaling dates.
                n = linear(linearTime(x));
            }
            var m = Math.round(n);
            return alignPixels ? (n > m ? m + 0.5 : m - 0.5) : n;
        }

        /**
        * Used to set or get the domain for this scale. The domain is the range of real world
        * values denoted by this scale (Max. and Min.).
        *
        * @memberof fc.scale.dateTime
        * @method domain
        * @param {array} domain the real world domain value as an array of 2 date objects,
        * Min and Max respectively.
        * @returns the current domain if no arguments are passed.
        */
        scale.domain = function(domain) {

            if (!arguments.length) {
                return [baseDomain[0], baseDomain[1]];
            }
            if (typeof domain[0] === 'number') {
                linear.domain(domain);
            } else {
                baseDomain = domain;
                linear.domain([linearTime(baseDomain[0]), linearTime(baseDomain[1])]);
            }
            return scale;
        };

        /**
        * Used to set or get the domain for this scale from a data set. The domain is the range of real world
        * values denoted by this scale (Max. and Min.).
        *
        * @memberof fc.scale.dateTime
        * @method domainFromValues
        * @param {array} data the data set used to evaluate Min and Max values.
        * @param {array} fields the fields within the data set used to evaluate Min and Max values.
        * @returns the current domain if no arguments are passed.
        */
        scale.domainFromValues = function(data, fields) {

            if (!arguments.length) {
                return scale.domain();
            } else {
                var mins = [],
                    maxs = [],
                    fieldIndex = 0,
                    getField = function(d) { return d[fields[fieldIndex]].getTime(); };

                for (fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
                    mins.push(d3.min(data, getField));
                    maxs.push(d3.max(data, getField));
                }

                scale.domain([
                    new Date(d3.min(mins, function(d) { return d; })),
                    new Date(d3.max(maxs, function(d) { return d; }))
                ]);
            }

            return scale;
        };

        /**
        * Used to scale a value from pixel space to domain space. This function is the inverse of
        * the `scale` function.
        *
        * @memberof fc.scale.dateTime
        * @method invert
        * @param {decimal} pixel the pixel value to be scaled.
        * @returns the converted value in real world space. In most cases this value will only be
        * accurate to the precision of the pixel width of the scale.
        */
        scale.invert = function(pixel) {
            return linearTimeInvert(linear.invert(pixel));
        };

        /**
        * Used to create a copy of the current scale. When scales are added to D3 axes the scales
        * are copied rather than a reference being stored.
        * This function facilities a deep copy.
        *
        * @memberof fc.scale.dateTime
        * @method copy
        * @returns the copy.
        */
        scale.copy = function() {
            return dateTimeScale(linear.copy(), baseDomain, alignPixels, hideWeekends, padEnds);
        };

        /**
        * Used to get an array of tick mark locations which can be used to display labels and
        * tick marks on the associated axis.
        * Ticks will be aligned to the nearest date time boundary. Boundaries are listed below:
        * + Year
        * + 8 Month
        * + 4 Month
        * + 2 Month
        * + Month
        * + Week
        * + Day
        * + 12 Hour
        * + 8 Hour
        * + 4 Hour
        * + 2 Hour
        * + Hour
        * + 15 Minute
        * + Minute
        * + Second
        *
        * @memberof fc.scale.dateTime
        * @method ticks
        * @param {integer} n the number of ticks to try and display within the scale domain.
        * (This value is used as  a guide for a best fit approach)
        * @returns an array of values denoting real world positions within the scale.
        * These can be converted to pixel locations using the `scale` function.
        */
        scale.ticks = function(n) {
            return arguments.length ? function() {

                var ticks = [],
                    offsetMilli = (baseDomain[1].getTime() - baseDomain[0].getTime()) / n,
                    offset = new Date(offsetMilli),
                    start = new Date(baseDomain[0].getTime()),
                    stepFunction = function(d) {
                        d.setSeconds(d.getSeconds() + 1);
                        return d;
                    };

                // Determine sensible date division starting from the largest time period down
                if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 8) {
                    start = getYearStart(start);
                    stepFunction = function(d) {
                        d.setFullYear(d.getFullYear() + 1);
                        return d;
                    };
                } else if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 4) { // 8 Months
                    start = getMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 8);
                        return d;
                    };
                } else if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 2) { // 4 Months
                    start = getMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 4);
                        return d;
                    };
                } else if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 1) { // 2 Months
                    start = getMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 2);
                        return d;
                    };
                } else if (offsetMilli >= 604800000) { // Months
                    start = getMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 1);
                        return d;
                    };
                } else if (offsetMilli >= 86400000) { // 7 Days
                    start = getWeekStart(start);
                    stepFunction = function(d) {
                        d.setDate(d.getDate() + 7);
                        return d;
                    };
                } else if (offsetMilli >= 43200000) { // Days
                    start = getDayStart(start);
                    stepFunction = function(d) {
                        d.setDate(d.getDate() + 1);
                        return d;
                    };
                } else if (offsetMilli >= 28800000) { // 12 Hours
                    start = getHourStart(start, 12);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 12);
                        return d;
                    };
                } else if (offsetMilli >= 14400000) { // 8 Hours
                    start = getHourStart(start, 8);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 8);
                        return d;
                    };
                } else if (offsetMilli >= 7200000) { // 4 Hours
                    start = getHourStart(start, 4);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 4);
                        return d;
                    };
                } else if (offsetMilli >= 3600000) { // 2 Hours
                    start = getHourStart(start, 4);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 2);
                        return d;
                    };
                } else if (offsetMilli >= 900000) { // Hours
                    start = getHourStart(start, 0);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 1);
                        return d;
                    };
                } else if (offsetMilli >= 60000) { // 15 Minutes
                    start = getMinuteStart(start, 15);
                    stepFunction = function(d) {
                        d.setMinutes(d.getMinutes() + 15);
                        return d;
                    };
                } else if (offsetMilli >= 1000) { // Minutes
                    start = getMinuteStart(start, 0);
                    stepFunction = function(d) {
                        d.setMinutes(d.getMinutes() + 1);
                        return d;
                    };
                }

                var tickDate = start;
                while (tickDate.getTime() <= baseDomain[1].getTime()) {
                    if (tickDate.getTime() >= baseDomain[0].getTime()) {
                        ticks.push(linearTime(tickDate));
                    }
                    tickDate = stepFunction(tickDate);
                }

                return ticks;

            } : linear.ticks();
        };

        /**
        * Used to set the callback function used to format the data label for the associated axis tick label.
        *
        * @memberof fc.scale.dateTime
        * @method tickFormat
        * @param {integer} count
        * @param {decimal} f
        * @returns a function which returns the formatting function for the individual data item.
        */
        scale.tickFormat = function(count, f) {
            return function(n) {
                return d3.time.format('%a, %e %b')(linearTimeInvert(n));
            };
        };

        /**
        * Used to get or set the option to hide weekends. Not showing weekends is common practice on financial charts.
        *
        * @memberof fc.scale.dateTime
        * @method hideWeekends
        * @param {boolean} value if set to `true` weekends will not be shown.
        * If no value argument is passed the current setting will be returned.
        */
        scale.hideWeekends = function(value) {
            if (!arguments.length) {
                return hideWeekends;
            }
            hideWeekends = value;
            return scale;
        };

        /**
        * Used to get or set the option to align ticks to pixel columns. Pixel aligning yields crisper chart graphics.
        *
        * @memberof fc.scale.dateTime
        * @method alignPixels
        * @param {boolean} value if set to `true` values will be pixel aligned.
        * If no value argument is passed the current setting will be returned.
        */
        scale.alignPixels = function(value) {
            if (!arguments.length) {
                return alignPixels;
            }
            alignPixels = value;
            return scale;
        };

        /**
        * Used to get or set the option to apply time period padding at the start and end of the data in the scale.
        *
        * @memberof fc.scale.dateTime
        * @method padEnds
        * @param {boolean} value if set to `true` the ends of the scale will be padded with one time period.
        * If no value argument is passed the current setting will be returned.
        */
        scale.padEnds = function(value) {
            if (!arguments.length) {
                return padEnds;
            }
            padEnds = value;
            return scale;
        };

        function linearTime(date) {

            var l = 0;
            if (hideWeekends) {

                var dayMs = 86400000,
                    weekMs = dayMs * 7,
                    weekendMs = dayMs * 2;

                var wsMonday = getWeekStart(baseDomain[0]).getTime() + dayMs, // Make Monday (Sunday=0)
                    weekOffset = Math.floor((date.getTime() - wsMonday) / weekMs),
                    weekOffsetMs = weekOffset * weekendMs,
                    weekendAdjustment = weekOffsetMs - (baseDomain[0] - wsMonday);

                l = (date.getTime() - baseDomain[0].getTime()) - weekendAdjustment;

            } else {
                l = date.getTime() - baseDomain[0].getTime();
            }

            return l;
        }

        function linearTimeInvert(l) {

            var date = new Date(0),
                milliSecondsInShortWeek = 432000000,
                milliSecondsInWeekend = 172800000;

            if (hideWeekends) {
                var weeksFromBase = Math.floor(l / milliSecondsInShortWeek);
                date = new Date(baseDomain[0].getTime() + l +
                    (milliSecondsInWeekend * weeksFromBase));
            } else {
                date = new Date(baseDomain[0].getTime() + l);
            }

            return date;
        }

        function getMinuteStart(d, offset) {
            d = offset > 0 ?
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), offset, 0) :
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0);
            return d;
        }

        function getHourStart(d, offset) {
            d = offset > 0 ?
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), offset, 0, 0) :
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0, 0);
            return d;
        }

        function getDayStart(d) {
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
            return d;
        }

        function getWeekStart(d) {
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
            while (d.getDay() > 0) {
                d.setDate(d.getDate() - 1);
            }
            return d;
        }

        function getMonthStart(d) {
            d = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
            return d;
        }

        function getYearStart(d) {
            d = new Date(d.getFullYear(), 0, 1, 0, 0, 0);
            return d;
        }

        return d3.rebind(scale, linear, 'range', 'rangeRound', 'interpolate', 'clamp', 'nice');
    }
}(d3, fc));