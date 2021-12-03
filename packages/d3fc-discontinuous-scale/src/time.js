import { DateTime } from "../lib/luxon.min.js";

import "./node_modules/d3/dist/d3.min.js";

export class TimeUtils {

    constructor(tz) {
        this.Timezone = tz;

        this.Timezones = {
            UTC: "utc",
            ET: "America/New_York",
            CT: "America/Chicago"
        };

        this.totalMillisPerDay = 24 * 3600 * 1000;
        this.totalMillisPerWeek = this.totalMillisPerDay * 7;

        //SOD,EOD
        this.SOD = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)); //interpreted as tz-local time, at the start of day: 00:00:00.000 (use a constant date (e.g. 2000-01-01) and the desired time to initialize date)
        this.EOD = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)); //interpreted as tz-loacal time at the end of day: 00:00:00.000 (use a constant date (e.g. 2000-01-01) and the desired time to initialize date)
    }

    //combine
    combine(day, time) { //returns a new Date(day, time)
        return new Date(Date.UTC(
            day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(),
            time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(), time.getUTCMilliseconds())
        );
    }

    //Test date validity
    isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    //Add Functions
    addDays = function (date, days) {
        var newDate = new Date(date.valueOf());
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }
    addMilliseconds = function (date, ms) {
        return new Date(date.valueOf() + ms);
    }
    
    //Detect StartOfDay (SOD), EndOfDay(EOD), StartOfWeek(SOW) , EndOfWeek(EOW)
    isSOD(date) {
        return date.getUTCHours() == this.SOD.getUTCHours() && date.getUTCMinutes() == this.SOD.getUTCMinutes() && date.getUTCSeconds() == this.SOD.getUTCSeconds() && date.getUTCMilliseconds() == this.SOD.getUTCMilliseconds();
    }
    isEOD(date) {
        return date.getUTCHours() == this.EOD.getUTCHours() && date.getUTCMinutes() == this.EOD.getUTCMinutes() && date.getUTCSeconds() == this.EOD.getUTCSeconds() && date.getUTCMilliseconds() == this.EOD.getUTCMilliseconds();
    }
    isSOW(date) {
        return date.getUTCDay() == 1 && /*Monday*/ date.getUTCHours() == this.SOD.getUTCHours() && date.getUTCMinutes() == this.SOD.getUTCMinutes() && date.getUTCSeconds() == this.SOD.getUTCSeconds() && date.getUTCMilliseconds() == this.SOD.getUTCMilliseconds();
    }
    isEOW(date) {
        return date.getUTCDay() == 0 && /*Sunday*/ date.getUTCHours() == this.EOD.getUTCHours() && date.getUTCMinutes() == this.EOD.getUTCMinutes() && date.getUTCSeconds() == this.EOD.getUTCSeconds() && date.getUTCMilliseconds() == this.EOD.getUTCMilliseconds();
    }

    //From date to SOW, EOD, SOW, EOW
    toSOD(date) {
        return d3.utcDay.floor(date);
    }
    toEOD(date) {
        let newDate;
        if (this.isSOD(date)) //in this case, date is already rounded as a day, therefore d3.utcDay.ceil(date) will give: date. We want instead the end of the day
            newDate = d3.utcDay.ceil(this.addMilliseconds(date, 1)); //round up
        else
            newDate = d3.utcDay.ceil(date); //round up
        return newDate;
    }
    toSOW(date) {
        return d3.utcMonday.floor(date);
    }
    toEOW(date) {
        let newDate;
        if (this.isSOW(date)) //in this case, date is already rounded as a week, therefore d3.utcMonday.ceil(date) will give: date. We want instead the end of the week
            newDate = d3.utcMonday.ceil(this.addMilliseconds(date, 1)); //round up
        else
            newDate = d3.utcMonday.ceil(date); //round up
        return newDate;
    }
    

    //DayOfWeek Functions
    getDayOfWeek(date) { //"Sunday", "Monday", ...
        let dow;
        if (date) {
            switch (date.getUTCDay()) { //Sunday = 0, Monday = 1, ... Saturdat = 6
                case 0:
                    dow = "Sunday";
                    break;
                case 1:
                    dow = "Monday";
                    break;
                case 2:
                    dow = "Tuesday";
                    break;
                case 3:
                    dow = "Wednesday";
                    break;
                case 4:
                    dow = "Thursday";
                    break;
                case 5:
                    dow = "Friday";
                    break;
                case 6:
                    dow = "Saturday";
                    break;
            }
        }
        else {
            dow = undefined;
        }
        return dow;
    }
    getPrevDayOfWeek(dow) {
        let prev;
        switch (dow) {
            case "Monday":
                prev = "Sunday";
                break;
            case "Tuesday":
                prev = "Monday";
                break;
            case "Wednesday":
                prev = "Tuesday";
                break;
            case "Thursday":
                prev = "Wednesday";
                break;
            case "Friday":
                prev = "Thursday";
                break;
            case "Saturday":
                prev = "Friday";
                break;
            case "Sunday":
                prev = "Saturday";
                break;
        }
        return prev;
    }
    getNextDayOfWeek(dow) {
        let prev;
        switch (dow) {
            case "Monday":
                prev = "Tuesday";
                break;
            case "Tuesday":
                prev = "Wednesday";
                break;
            case "Wednesday":
                prev = "Thursday";
                break;
            case "Thursday":
                prev = "Friday";
                break;
            case "Friday":
                prev = "Saturday";
                break;
            case "Saturday":
                prev = "Sunday";
                break;
            case "Sunday":
                prev = "Monday";
                break;
        }
        return prev;
    }
    getDaysOfWeek() {
        return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    }
    getDaysOfWeekBetween(start_dow, end_dow) {
        let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        let start_index = days.findIndex((x) => x == start_dow);
        let end_index = days.findIndex((x) => x == end_dow);
        days = days.slice(start_index, end_index + 1);
        return days;
    }
    getDaysOfWeekAfter(dow) {
        let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        let i = days.findIndex((x) => x == dow);
        days = days.slice(i);
        return days;
    }
    getDaysOfWeekBefore(dow) {
        let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        let i = days.findIndex((x) => x == dow);
        days = days.slice(0, i + 1); //we keep the initial days of the week.e.g.: if day=wed result=[mon,tue,wed]
        return days;
    }

    //we use luxon lib to convert timezones
    utcToZonedTime(utcDate, tz) {
        //luxon date
        const tzDate = DateTime.utc(
            utcDate.getUTCFullYear(), 1 + utcDate.getUTCMonth(), utcDate.getUTCDate(), //day
            utcDate.getUTCHours(), utcDate.getUTCMinutes(), utcDate.getUTCSeconds(), utcDate.getUTCMilliseconds() //time
        ).setZone(this.Timezones[tz]);
        //js date
        return new Date(Date.UTC(
            tzDate.year, tzDate.month - 1, tzDate.day, //day
            tzDate.hour, tzDate.minute, tzDate.second, tzDate.millisecond //time
        ));
    }
    zonedTimeToUtc(tzDate, tz) {
        //luxon
        const utcDate = DateTime.fromObject({
            year: tzDate.getFullYear(), month: 1 + tzDate.getMonth(), day: tzDate.getDate(),
            hour: tzDate.getHours(), minute: tzDate.getMinutes(), second: tzDate.getSeconds(), millisecond: tzDate.getMilliseconds()
            },
            { zone: this.Timezones[tz] }
        ).setZone(this.Timezones.UTC);
        //js date
        return new Date(
            utcDate.year, utcDate.month - 1, utcDate.day, //day
            utcDate.hour, utcDate.minute, utcDate.second, utcDate.millisecond //time
        );
    }
}


