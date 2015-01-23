(function(d3, fc) {
    'use strict';

    fc.scale.discontinuity.skipWeekends = function() {
        var millisPerDay = 24 * 3600 * 1000;
        var millisPerWorkWeek = millisPerDay * 5;

        function isWeekend(date) {
            return date.getDay() === 0 || date.getDay() === 6;
        }

        function clampDown(date) {
            if (isWeekend(date)) {
                var daysToSubtract = date.getDay() === 0 ? 2 : 1;
                // round the date up to midnight
                var newDate = d3.time.day.ceil(date);
                // then subtract the required number of days
                return d3.time.day.offset(newDate, -daysToSubtract);
            } else {
                return date;
            }
        }

        function clampUp(date) {
            if (isWeekend(date)) {
                var daysToAdd = date.getDay() === 0 ? 1 : 2;
                // round the date down to midnight
                var newDate = d3.time.day.floor(date);
                // then add the required number of days
                return d3.time.day.offset(newDate, daysToAdd);
            } else {
                return date;
            }
        }

        // counts the number of days that are weekends (sat / sun) within
        // the give period
        function countWeekendDays(start, end) {
            var weekends = 0;
            var d = d3.time.day.floor(start);
            // TODO: replace with a non-iterative approach!
            while (d < end) {
                if (isWeekend(d)) { weekends ++; }
                d = d3.time.day.offset(d, 1);
            }
            return weekends;
        }

        // returns the number of included milliseconds (i.e. those which do not fall)
        // within discontinuities, along this scale
        function getDistance(startDate, endDate) {
            if (arguments.length === 1) {
                var domain = startDate;
                startDate = domain[0];
                endDate = domain[1];
            }

            startDate = clampUp(startDate);
            endDate = clampDown(endDate);
            if (startDate > endDate) {
                return 0;
            }
            var weekends = countWeekendDays(startDate, endDate);
            return endDate.getTime() - startDate.getTime() - weekends * millisPerDay;
        }

        function applyOffset(startDate, ticks) {
            var date = isWeekend(startDate) ? clampUp(startDate) : startDate;
            var remainingTicks = ticks;

            // move to the end of week boundary
            var endOfWeek = d3.time.saturday.ceil(date);
            remainingTicks -= (endOfWeek.getTime() - date.getTime());

            // if the distance to the boundary is greater than the number of ticks
            // simply add the ticks to the current date
            if (remainingTicks < 0) {
                return new Date(date.getTime() + ticks);
            }

            // skip the weekend
            date = d3.time.day.offset(endOfWeek, 2);

            // add all of the complete weeks to the date
            var completeWeeks = Math.floor(remainingTicks / millisPerWorkWeek);
            date = d3.time.day.offset(date, completeWeeks * 7);
            remainingTicks -= completeWeeks * millisPerWorkWeek;

            // add the remaining time
            date = new Date(date.getTime() + remainingTicks);
            return date;
        }

        return {
            applyOffset: applyOffset,
            getDistance: getDistance,
            clampUp: clampUp,
            clampDown: clampDown
        };
    };
}(d3, fc));