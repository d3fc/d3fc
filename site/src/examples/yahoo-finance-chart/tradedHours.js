(function(d3, fc) {
    'use strict';

    fc.scale.discontinuity.tradedHours = function() {

        var tradedHours = {};
        var trades = [];
        var orderedExtents = [];
        var extentsMappedByDay = {};
        var millisPerDay = 1000 * 60 * 60 * 24;

        function last(array) {
            return array.length === 0 ? undefined : array[array.length - 1];
        }

        function first(array) {
            return array[0];
        }

        function sameDay(d1, d2) {
            var d11 = Math.floor(d1 / millisPerDay);
            var d22 = Math.floor(d2 / millisPerDay);
            return d11 === d22;
        }

        function isWithinTradingHours(date) {
            var extents = getTradingExtentsForDay(date);
            if (extents) {
                return extents.start <= date && date < extents.end;
            } else {
                return false;
            }
        }

        function getTradingExtentsForDay(date) {
            return extentsMappedByDay[Math.floor(date / millisPerDay)];
        }

        tradedHours.distance = function(startDate, endDate) {
            var millis = 0;

            if (sameDay(startDate, endDate)) {
                if (!isWithinTradingHours(startDate)) {
                    startDate = tradedHours.clampUp(startDate);
                }
                if (!isWithinTradingHours(endDate)) {
                    endDate = tradedHours.clampDown(endDate);
                }
                return endDate.getTime() - startDate.getTime();
            }

            // compute the number of trading ms in the start and end days
            var startDayExtents = getTradingExtentsForDay(startDate);
            if (startDayExtents) {
                if (startDate <= startDayExtents.start) {
                    millis += startDayExtents.duration;
                } else if (startDate < startDayExtents.end) {
                    millis += startDayExtents.end.getTime() - startDate.getTime();
                }
            }

            var endDayExtents = getTradingExtentsForDay(endDate);
            if (endDayExtents) {
                if (endDate > endDayExtents.end) {
                    millis += endDayExtents.duration;
                } else if (endDate >= endDayExtents.start) {
                    millis += endDate.getTime() - endDayExtents.start.getTime();
                }
            }

            // add the time for all the days inbetween
            var afterStart = d3.time.day.ceil(startDate);
            var beforeEnd = d3.time.day.floor(endDate);
            var daysInBetween = orderedExtents.filter(function(d) {
                return afterStart < d.start && beforeEnd > d.end;
            });
            millis += d3.sum(daysInBetween, function(d) { return d.duration; });

            return millis;
        };

        tradedHours.offset = function(startDate, ms) {
            return new Date(startDate.getTime() + ms);
        };

        tradedHours.clampUp = function(date) {
            var extents = getTradingExtentsForDay(date);

            function clampToNextTradingDay() {
                if (date > last(orderedExtents).end) {
                    // if the date is greater than the last trade date, return it unchanged
                    return date;
                } else {
                    // otherwise find the start of trading on the next active day
                    var futureDates = orderedExtents.filter(function(d) {
                        return d.start > date;
                    });
                    return first(futureDates).start;
                }
            }

            if (extents) {
                if (date <= extents.start) {
                    return extents.start;
                } else if (date < extents.end) {
                    return date;
                } else {
                    return clampToNextTradingDay();
                }
            } else {
                return clampToNextTradingDay();
            }
        };

        tradedHours.clampDown = function(date) {
            var extents = getTradingExtentsForDay(date);

            function clampToPreviousTradingDay() {
                if (date < first(orderedExtents).start) {
                    // if the date is less than the first trade date, return it unchanged
                    return date;
                } else {
                    // otherwise find the end of trading on the previous active day
                    var earlierDates = orderedExtents.filter(function(d) {
                        return d.end < date;
                    });
                    return last(earlierDates).end;
                }
            }

            if (extents) {
                if (date > extents.end) {
                    return extents.end;
                } else if (date >= extents.start) {
                    return date;
                } else {
                    return clampToPreviousTradingDay();
                }
            } else {
                return clampToPreviousTradingDay();
            }
        };

        tradedHours.copy = function() { return tradedHours; };

        tradedHours.orderedExtents = function() {
            return orderedExtents;
        };

        tradedHours.trades = function(x) {
            if (!arguments.length) {
                return trades;
            }
            trades = x;

            // sort the trades
            var sortedTrades = x.slice();
            sortedTrades.sort(function(a, b) { return a - b; });

            // compute the extents for each day
            orderedExtents = [];
            sortedTrades.forEach(function(date) {
                var lastExtents = last(orderedExtents);
                if (lastExtents  && sameDay(lastExtents.start, date)) {
                    lastExtents.end = date;
                    lastExtents.duration = lastExtents.end.getTime() - lastExtents.start.getTime();
                } else {
                    orderedExtents.push({
                        start: date,
                        end: date,
                        duration: 0
                    });
                }
            });

            orderedExtents.forEach(function (extent) {
                var key = Math.floor(extent.start / millisPerDay);
                extentsMappedByDay[key] = extent;
            });

            return tradedHours;
        };

        return tradedHours;
    };
}(d3, fc));
