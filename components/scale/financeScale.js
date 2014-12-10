(function (d3, fc) {
    'use strict';

    /**
    * This component provides a scale primarily used on the X axis of financial charts which is based on a time scale. 
    * It allows for the removal of time periods where the market may be closed, namely weekends. 
    * This scale also contains an option to pixel align when calculating the screen pixel from the real value. 
    * This generally produces crisper graphics.
    * 
    * @type {object}
    * @memberof fc.scale
    * @namespace fc.scale.finance
    */
    fc.scale.finance = function () {
        return financialScale();
    };

    /**
    * Constructs a new instance of the finance scale component.
    * 
    * @memberof fc.scale.finance
    * @param {linear} used in the copy constructor to copy the base linear scale between the original and the copy.
    * @param {baseDomain} used in the copy constructor to copy the base domain (Max and Min) between the original and the copy.
    * @param {alignPixels} used in the copy constructor to copy the pixel alignment option between the original and the copy.
    * @param {hideWeekends} used in the copy constructor to copy the hide weekends option between the original and the copy.
    */
    function financialScale(linear, baseDomain, alignPixels, hideWeekends) {

        if (!arguments.length) {
            linear = d3.scale.linear();
            baseDomain = [new Date(0), new Date(0)];
            alignPixels = true;
            hideWeekends = false;
        }

        /**
        * Used to scale a value from domain space to pixel space. This function is used primarily to position elements on the X axis.
        * 
        * @memberof fc.scale.finance
        * @param {x} the real world domain value to be scaled.
        * @returns the converted value in pixel space. This value is also pixel aligned if the relevant options are set.
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
        * Used to set or get the domain for this scale. The domain is the range of real world values denoted by this scale (Max. and Min.).
        * 
        * @memberof fc.scale.finance
        * @param {domain} the real world domain value as an array of 2 decimal numbers, Min and Max respectively.
        * @returns the current domain is no arguments are passed.
        */
        scale.domain = function (domain) {

            if (!arguments.length) {
                return [linearTime(baseDomain[0]), linearTime(baseDomain[1])];
            }
            if (typeof domain[0] === 'number') {
                linear.domain(domain);
            } else {
                baseDomain = createbaseDomain(domain);
                linear.domain([linearTime(baseDomain[0]), linearTime(baseDomain[1])]);
            }
            return scale;
        };

        /**
        * Used to scale a value from pixel space to domain space. This function is the inverse of the `scale` function.
        * 
        * @memberof fc.scale.finance
        * @param {pixel} the pixel value to be scaled.
        * @returns the converted value in real world space. In most cases this value will only be acurate to the precision of the pixel width of the scale.
        */
       scale.invert = function (pixel) {
            return linearTimeInvert(linear.invert(pixel));
        };

        /**
        * Used to create a copy of the current scale.
        * 
        * @memberof fc.scale.finance
        * @returns the copy.
        */
        scale.copy = function () {
            return financialScale(linear.copy(), baseDomain, alignPixels, hideWeekends);
        };

        /**
        * Used to get an array of tick mark locations which can be used to display labels and tick marks on the associated axis.
        * Ticks will be aligned to the nearest financial time boundary. Boundarie are listed below:
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
        * @memberof fc.scale.finance
        * @param {n} the number of ticks to try and display within the scale domain. (This value is used as  a guide for a best fit approach)
        * @returns an array of values denoting real world positions within the scale. These can be converted to pixel locations using the `scale` function.
        */
        scale.ticks = function (n) {
            return arguments.length ? function() {

                var test = [],
                    ticks = [],
                    offsetMilli = (baseDomain[1].getTime() - baseDomain[0].getTime()) / n,
                    offset = new Date(offsetMilli),
                    start = new Date(baseDomain[0].getTime()),
                    stepFunction = function(d) {
                        d.setSeconds(d.getSeconds() + 1);
                        return d;
                    };

                // Determine sensible date division starting from the largest time period down
                if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 8) {
                    start = findYearStart(start);
                    stepFunction = function(d) {
                        d.setFullYear(d.getFullYear() + 1);
                        return d;
                    };
                } else if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 4) { // 8 Months
                    start = findMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 8);
                        return d;
                    };
                } else if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 2) { // 4 Months
                    start = findMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 4);
                        return d;
                    };
                } else if (((offset.getFullYear() - 1970) * 12) + offset.getMonth() >= 1) { // 2 Months
                    start = findMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 2);
                        return d;
                    };
                } else if (offsetMilli >= 604800000) { // Months
                    start = findMonthStart(start);
                    stepFunction = function(d) {
                        d.setMonth(d.getMonth() + 1);
                        return d;
                    };
                } else if (offsetMilli >= 86400000) { // 7 Days
                    start = findWeekStart(start);
                    stepFunction = function(d) {
                        d.setDate(d.getDate() + 7);
                        return d;
                    };
                } else if (offsetMilli >= 43200000) { // Days
                    start = findDayStart(start);
                    stepFunction = function(d) {
                        d.setDate(d.getDate() + 1);
                        return d;
                    };
                } else if (offsetMilli >= 28800000) { // 12 Hours
                    start = findHourStart(start, 12);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 12);
                        return d;
                    };
                } else if (offsetMilli >= 14400000) { // 8 Hours
                    start = findHourStart(start, 8);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 8);
                        return d;
                    };
                } else if (offsetMilli >= 7200000) { // 4 Hours
                    start = findHourStart(start, 4);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 4);
                        return d;
                    };
                } else if (offsetMilli >= 3600000) { // 2 Hours
                    start = findHourStart(start, 4);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 2);
                        return d;
                    };
                } else if (offsetMilli >= 900000) { // Hours
                    start = findHourStart(start, 0);
                    stepFunction = function(d) {
                        d.setHours(d.getHours() + 1);
                        return d;
                    };
                } else if (offsetMilli >= 60000) { // 15 Minutes
                    start = findMinuteStart(start, 15);
                    stepFunction = function(d) {
                        d.setMinutes(d.getMinutes() + 15);
                        return d;
                    };
                } else if (offsetMilli >= 1000) { // Minutes
                    start = findMinuteStart(start, 0);
                    stepFunction = function(d) {
                        d.setMinutes(d.getMinutes() + 1);
                        return d;
                    };
                }

                var tickDate = start;
                while (tickDate.getTime() <= baseDomain[1].getTime()) {
                    ticks.push(linearTime(tickDate));
                    test.push(new Date(tickDate.getTime()));
                    tickDate = stepFunction(tickDate);
                }

                return ticks;

            } : linear.ticks();
        };

        /**
        * Used to get or set the callback function used to format the data label for the associated axis tick label.
        * 
        * @memberof fc.scale.finance
        * @param {count} 
        * @param {f} 
        * @returns a function which returns the formatting function for the individual data item.
        */
        scale.tickFormat = function (count, f) {
            return function(n) {
                return d3.time.format('%a, %e %b')(linearTimeInvert(n));
            };
        };

        /**
        * Used to get or set the option to hide weekends. Not showing weekends is common practice on financial charts.
        * 
        * @memberof fc.scale.finance
        * @param {value} if set to `true` weekends will not be shown. If no value argument is passed the current setting will be returned.
        */
        scale.hideWeekends = function (value) {
            if (!arguments.length) {
                return hideWeekends;
            }
            hideWeekends = value;
            return scale;
        };

        /**
        * Used to get or set the option to align ticks to pixel columns. Pixel aligning yields crisper chart graphics.
        * 
        * @memberof fc.scale.finance
        * @param {value} if set to `true` values will be pixel aligned. If no value argument is passed the current setting will be returned.
        */
        scale.alignPixels = function (value) {
            if (!arguments.length) {
                return alignPixels;
            }
            alignPixels = value;
            return scale;
        };

        function createbaseDomain(domain) {
            var d0 = new Date(domain[0].getFullYear(), domain[0].getMonth(), domain[0].getDate(), 0, 0, 0);
            var d1 = new Date(domain[1].getFullYear(), domain[1].getMonth(), domain[1].getDate()+2, 0, 0, 0);
            while (d0.getDay() !== 1) {
                d0.setDate(d0.getDate() - 1);
            }
            return [d0, d1];
        }

        function linearTime(date) {

            var l = 0,
                milliSecondsInWeek = 592200000,
                milliSecondsInWeekend = 172800000;

            if (hideWeekends) {
                if (date.getDay() === 0) {
                    date.setDate(date.getDate() + 1);
                }
                if (date.getDay() === 6) {
                    date.setDate(date.getDate() - 1);
                }
                var weeksFromBase = Math.floor((date.getTime() - baseDomain[0].getTime()) / milliSecondsInWeek);
                l = (date.getTime() - baseDomain[0].getTime()) - (milliSecondsInWeekend * weeksFromBase);
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
                date = new Date(baseDomain[0].getTime() + l + (milliSecondsInWeekend * weeksFromBase));
            } else {
                date = new Date(baseDomain[0].getTime() + l);
            }

            return date;
        }

        function findMinuteStart(d, offset) {
            d = offset > 0 ?
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), offset, 0) :
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0);
            return d;
        }

        function findHourStart(d, offset) {
            d = offset > 0 ?
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), offset, 0, 0) :
                new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0, 0);
            return d;
        }

        function findDayStart(d) {
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
            return d;
        }

        function findWeekStart(d) {
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
            while (d.getDay() > 0) {
                d.setDate(d.getDate() - 1);
            }
            return d;
        }

        function findMonthStart(d) {
            d = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
            return d;
        }

        function findYearStart(d) {
            d = new Date(d.getFullYear(), 0, 1, 0, 0, 0);
            return d;
        }

        return d3.rebind(scale, linear, 'range', 'rangeRound', 'interpolate', 'clamp', 'nice');
    }
}(d3, fc));