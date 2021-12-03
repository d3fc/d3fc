import "./node_modules/d3-time/dist/d3-time.min.js";
import { TimeUtils } from "./time.js";

class WeeklyPatternsDiscontinuityProvider {

    //this class implements the DiscontinuityProvider interface to identify
    //all dates processed in this class are expressed in UTC (see below, at the end of this file, how specific timezones are managed)

    //we define:
    //  calendarDistance:= (endDate-startDate)
    //  continuousDistance := the calendarDistance minus the discontinuity ranges
    //  gap:= a specific discontinuos range [startDate, endDate], startDate < endDate

    constructor(TZ, NTH)
    {
        this.Time = new TimeUtils(TZ);
        this.parse(NTH);

        this.includedMillisPerWeek = this.getIncludedMillisInFullWeek();
    }

    //discontinuity range functions
    parse(NTH) { //from json to proper data structure
        //NTH = Non Trading Hours = {MO: [{StartTime:"08:00", EndTime:"16:00"}], TU: [{StartTime:"08:00", EndTime:"EOD"}], ...}
        //NTH describes the weekly pattern of discontinuities (gaps)
        //There may be multiple gaps in a day (e.g.: Corn futures)

        let time;
        this.NTH = {};
        for (const [dow, ranges] of Object.entries(NTH)) { //Monday, Tuesday, ...
            this.NTH[dow] = [];
            this.NTH[dow].Elapsed = 0;
            for (let i = 0; i < ranges.length; i++) { //for each gap a day
                this.NTH[dow].push({});
                //StartTime, EndTime
                for (const [side, time] of Object.entries(NTH[dow][i])) { //StartTime, EndTime of i-th range
                    if (time == "EOD") {
                        this.NTH[dow][i][side] = this.Time.EOD; //to reduce memory we use the same instance of Date class
                    }
                    else if (time == "SOD") {
                        this.NTH[dow][i][side] = this.Time.SOD; //to reduce memory we use the same instance of Date class
                    }
                    else {
                        let time_components = time.split(":");
                        let hh = time_components[0];
                        let mm = time_components[1];
                        //ss, ms are optional
                        let ss = 0, ms = 0;
                        if (time_components[2] != undefined) {
                            let ms_components = time_components[2].split(".");
                            if (ms_components[0] != undefined) { ss = ms_components[0]; ms = ms_components[1]; } else ss = time_components[2];
                        }
                        this.NTH[dow][i][side] = new Date(Date.UTC(2000, 0, 1, hh, mm, ss, ms)); //use a constant date (e.g. 2000-01-01) and the desired time to initialize date
                    }
                }

                //Extended Properties
                //Elapsed of a discontinuity range = EndTime - StartTime
                let startTime = this.NTH[dow][i].StartTime;
                let endTime = this.NTH[dow][i].EndTime;
                if (this.Time.isEOD(endTime)) endTime = this.Time.addDays(endTime, 1); //takes care of midnight = 00:00:00.000 of the following day
                this.NTH[dow][i].Elapsed = (endTime - startTime);
                //Sum ofthe Elapsed within a day
                this.NTH[dow].Elapsed += this.NTH[dow][i].Elapsed;
            } 
        }
    }
    nextActualRangeTime(date, startTime) { //returns startTime with the correct day component, e.g: 16:00 --> 3/11/2021 16:00
        //   Day = [___date____[startTime, endTime]___]
        //or Day = [date____[startTime, endTime]______], i.e.: the date can be at the start of the day
        return this.Time.combine(
            date,
            startTime
        );
    }
    prevActualRangeTime(date, endTime) { //returns endTime with the correct day component, e.g: 17:00 --> 3/11/2021 17:00
        //Day = [___[startTime, endTime]____date___]
        //Day = [______[startTime, endTime]____date + 1], i.e.: the date can be at the end of the day (midnight), which is a problem, because it is represented as date+1 at 00:00:00.000)

        //Examples
        //date			endTime             result
        ////*           24:00 = 00:00		date + endTime
        //dd+1/mm       00:00	08:00       (dd+1)-1/mm + endTime
        //*			    *                   date + endTime
        return this.Time.combine(
            //this.Time.isEOD(endTime) ?
            //    date :
                (this.Time.isSOD(date) ? this.Time.addDays(date, -1) : date),
            endTime
        );
    }




    //date of week
    actualDateOfWeek(date, type) { //type: "StartDate" --> 00:00:00.000 interpreted as start of the day | "EndDate" --> 00:00:00.000 interpreted as midnight
        //since Sunday Midnight is encoded as Monday 00:00:00.000 we must return Sunday instead of Monday

        if (type == "EndDate") {
            //Monday 00:00:00.000 --> Sunday
            return this.Time.isEOD(date) ? this.Time.getPrevDayOfWeek(this.Time.getDayOfWeek(date)) : this.Time.getDayOfWeek(date);
        }
        else { //if (type == "StartDate")
            return this.Time.getDayOfWeek(date);
        }
    }

    //Included Milliseconds functions
    getIncludedMillisInFullDay(dow) {
        return this.Time.totalMillisPerDay - this.NTH[dow].Elapsed;
    }
    getIncludedMillisInFullWeek() { //cached in this.includedMillisPerWeek
        let days = this.Time.getDaysOfWeek();
        let ms = 0;
        for (const dow of days) {
            ms += this.getIncludedMillisInFullDay(dow);
        }
        return ms;
    }


    //Distance functions
    intradayDistance(startDate, endDate) { //returns the number of included milliseconds (i.e. those which do not fall) within discontinuities within a day, from startDate to endDate
        //startDate is any clamped date: yyyy-MM-dd hh:mm:ss.mi
        //endDate is any clamped date: yyyy-MM-dd hh:mm:ss.mi and can be anywhere
        //startDate <= EndDate

        let ms = 0;
        let last; //indicates that the calculated distance reached the endDate

        if (startDate < endDate) {
            //day of week
            let dow = this.actualDateOfWeek(startDate, "StartDate");

            //max boundary
            let eod = this.Time.toEOD(startDate);

            //we move forward from startDate to endDate (or OED, whichever is first)
            for (let i = 0; startDate < endDate && startDate < eod && i < this.NTH[dow].length; i++) {
                let nextActualRangeTime = this.nextActualRangeTime(startDate, this.NTH[dow][i].StartTime);
                let diffToGap = (nextActualRangeTime - startDate); //cannot be <0
                if (diffToGap < 0) {
                    continue; //this gap is before startDate: discard
                }
                let diffToEndDate = (endDate - startDate); //difference across days
                if (diffToEndDate <= diffToGap) { //endDate is before or at the next discontinued range
                    //we advance startDate until EndDate
                    ms += diffToEndDate;
                    startDate = endDate;
                    last = true;
                }
                else { //endDate is after this discontinued range
                    ms += diffToGap;
                    //we advance startDate until the end of the (intraday) gap
                    //startDate = this.cappedAddCalendarMinutes(startDate, diffToGap + this.NTH[dow][i].Elapsed, Number.MAX_VALUE).date;
                    startDate = this.Time.addMilliseconds(startDate, diffToGap + this.NTH[dow][i].Elapsed);
                    last = false;
                }
            }
            //move to the end of day
            if (!last) {
                let diffToEOD = (eod - startDate); //can be >= 0
                let diffToEndDate = (endDate - startDate); //difference across days
                if (diffToEndDate < diffToEOD) { //endDate is before the next discontinued range
                    //we advance startDate until EndDate
                    ms += diffToEndDate;
                    startDate = endDate;
                    last = true;
                }
                else { //endDate is after this discontinued range
                    //we advance startDate until the EOD
                    ms += diffToEOD;
                    startDate = eod;
                    last = false;
                }
            }

            return {
                "ms": ms,
                "last": last
            };
        }
        else if (startDate > endDate) {
            console.warn("cannot happen");
        }
        else { //if (startDate == endDate)
            return {
                "ms": 0,
                "last": true
            };
        }
    }
    intraweekDistance(startDay, endDay) { //returns the number of day-included-milliseconds within a week, from startDay to endDay
        //startDay is any start of day (sod): yyyy-MM-dd 00:00:00.000
        //endDay any end of day (eod): yyyy-MM-dd 00:00:00.000
        //startDay <= EndDay

        let ms;
        let last; //indicates that the calculated distance reached the endDate

        if (startDay < endDay) {
            let eow = this.Time.toEOW(startDay);
            if (endDay > eow) {
                endDay = eow; //if the endDay is after the end of the week (eow), we move it to eow, because the diff is "within the week"
                last = false; //there is more distance after eod to process
            }
            else {
                last = true; //this distance includes the endDate
            }
            let dow_start = this.actualDateOfWeek(startDay, "StartDate");
            let dow_end = this.actualDateOfWeek(endDay, "EndDate");

            let days = this.Time.getDaysOfWeekBetween(dow_start, dow_end); //day of the week that are in the range

            ms = 0;
            for (const dow of days) {
                ms += this.getIncludedMillisInFullDay(dow);
            }

            return {
                "ms": ms,
                "last": last
            };
        }
        else if (startDay > endDay) {
            console.warn("cannot happen");
        }
        else { //if (startDay == endDay)
            return {
                "ms": 0,
                "last": true
            }
        } 
    }
    extraweekDistance(startWeek, endWeek) { //returns the number of week-included-milliseconds within a period, from startWeek to endWeek
        //startWeek is any start of week (sow): Monday at 00:00:00.000
        //endWeek is any end of week (eow): Sunday at 00:00:00.000
        //startWeek <= EndWeek

        let ms;
        let last; //indicates that the calculated distance reached the endDate

        if (startWeek < endWeek) {
            let numberOfWeeks = (endWeek - startWeek) / this.Time.totalMillisPerWeek;
            ms = numberOfWeeks * this.includedMillisPerWeek;
            last = false; //there is more distance after eod to process

            return {
                "ms": ms,
                "last": last
            };
        }
        else if (startWeek > endWeek) {
            console.warn("cannot happen");
        }
        else { //if (startWeek == endWeek)
            return {
                "ms": 0,
                "last": true
            }
        }
    }

    //Add minutes with a maximum cap
    cappedAddCalendarMinutes(date, offset, limit) { //date = date + min(offset, limit), limit = limit - min(offset, limit)
        //offset can be positive or negative
        let step = Math.sign(offset) * Math.min(Math.abs(offset), Math.abs(limit)); //limit = limit + offset, if within the limit, else date = date + limit
        return {
            "date": this.Time.addMilliseconds(date, step),
            "ms": (limit - step)
        };
    }

    //Offsetting functions
    intradayOffset(date, ms) { //returns (end)date = (start)date + ms (considering only the included intervals)
        //date is any: yyyy-MM-dd hh:mm:ss.mi
        //ms can be positive or negative

        if (ms == 0) {
            //nothing to do. date and ms are final
        } else {
            let newval;

            if (ms > 0) {
                let dow = this.actualDateOfWeek(date, "StartDate");
                let eod = this.Time.toEOD(date);
                //process the gaps (forward)
                for (let i = 0; ms > 0 && i < this.NTH[dow].length; i++) {
                    let nextActualRangeTime = this.nextActualRangeTime(date, this.NTH[dow][i].StartTime);
                    let diffToGap = (nextActualRangeTime - date); //cannot be <0
                    if (diffToGap < 0) {
                        continue; //this gap is before date: discard
                    }

                    newval = this.cappedAddCalendarMinutes(date, diffToGap, ms); date = newval.date; ms = newval.ms;
                    nextActualRangeTime = this.Time.combine(date, this.NTH[dow][i].StartTime);
                    if (ms > 0 || (nextActualRangeTime - date) == 0) date = this.Time.addMilliseconds(date, this.NTH[dow][i].Elapsed); //add the (intraday) gap
                }
                //process the end of day segment
                if (ms > 0) { newval = this.cappedAddCalendarMinutes(date, (eod - date), ms); date = newval.date; ms = newval.ms; }
            }
            else { //ms < 0
                let dow = this.actualDateOfWeek(date, "EndDate");
                //process the gaps (backwards)
                for (let i = this.NTH[dow].length - 1; ms < 0 && i >= 0; i--) {
                    let prevActualRangeTime = this.prevActualRangeTime(date, this.NTH[dow][i].EndTime);
                    let diffToGap = date - prevActualRangeTime;
                    if (diffToGap < 0) {
                        continue; //this gap is after date: discard
                    }

                    newval = this.cappedAddCalendarMinutes(date, -diffToGap, ms); date = newval.date; ms = newval.ms;
                    prevActualRangeTime = this.prevActualRangeTime(date, this.NTH[dow][i].EndTime);
                    if (ms < 0 || date - prevActualRangeTime == 0) date = this.Time.addMilliseconds(date, -this.NTH[dow][i].Elapsed); //add the (intraday) gap
                }
                //process the start of day segment
                if (ms < 0) {
                    let sod = this.Time.toSOD(date);
                    newval = this.cappedAddCalendarMinutes(date, -(date - sod), ms); date = newval.date; ms = newval.ms;
                }
            }
        }

        return {
            "date": date,
            "ms": ms
        };
    }
    intraweekOffset(day, ms) { //returns (end)date = (start)date + ms (considering only the included intervals)
        //day (start/end of a day) is any yyyy-MM-dd at 00:00:00
        //ms can be positive or negative

        if (ms == 0) {
            //nothing to do. date and ms are final
        } else {
            //initialise the day-step (actual *included time* been processed) and full-day distance (actual *total* distance travelled = step + this.NTH[dow].Elapsed)
            let sow = this.Time.toSOW(day);
            let eow = this.Time.toEOW(day);
            let dist = Math.sign(ms) * this.Time.totalMillisPerDay;
            let dow = ms > 0 ? this.actualDateOfWeek(day, "StartDate") : this.actualDateOfWeek(day, "EndDate");
            let step = Math.sign(ms) * this.getIncludedMillisInFullDay(dow);
            while (Math.abs(step) < Math.abs(ms) && Math.abs(ms) > 0) {
                day = this.Time.addMilliseconds(day, dist);
                ms -= step;
                if ((ms < 0 && day.getTime() == sow.getTime()) || (ms > 0 && day.getTime() == eow.getTime())) {
                    break; //we reached the week boundary
                }
                else {
                    //update the step for the new day, for the next loop
                    let dow = ms > 0 ? this.actualDateOfWeek(day, "StartDate") : this.actualDateOfWeek(day, "EndDate");
                    step = Math.sign(ms) * this.getIncludedMillisInFullDay(dow);
                }
            }

            return {
                "date": day,
                "ms": ms
            };
        }

        return {
            "date": day,
            "ms": ms
        };
    }
    extraweekOffset(week, ms) { //returns (end)date = (start)date + ms (considering only the included intervals)
        //week (start/end of week) is any Monday at 00:00:00
        //ms can be positive or negative

        if (ms == 0) {
            //nothing to do. date and ms are final
        } else {

            let numberOfFullWeeks = Math.floor(Math.abs(ms) / this.includedMillisPerWeek);
            let distance = numberOfFullWeeks * Math.sign(ms) * this.Time.totalMillisPerWeek;
            let step = numberOfFullWeeks * Math.sign(ms) * this.includedMillisPerWeek;
            week = this.Time.addMilliseconds(week, distance);
            ms -= step;
        }

        return {
            "date": week,
            "ms": ms
        };
    }
    
    ///////////////////////////
    //Interface implementation
    ///////////////////////////

    clampDown(date) { //move the date backwards *within a day* or *overarching the day if required*
        let newDate = date; //we assume that date is not in a discontinued range

        let dow = this.actualDateOfWeek(date, "EndDate");

        //let refStartDay = this.Time.isSOD(date) ? this.Time.addDays(date, -1) : date; //if 00:00:00.000 date is considered midnight
        //process the gaps (backwards)
        //check if date is in a discontinued day range
        for (let i = this.NTH[dow].length - 1; i >= 0; i--) {
            //check if date is in the i-th discontinued range
            //let nextActualRangeTime = this.Time.combine(refStartDay, this.NTH[dow][i].StartTime);
            //let prevActualRangeTime = this.Time.combine(this.Time.isEOD(this.NTH[dow][i].EndTime) ? date : refStartDay, this.NTH[dow][i].EndTime);
            let nextActualRangeTime = this.prevActualRangeTime(date, this.NTH[dow][i].StartTime);
            let prevActualRangeTime = this.prevActualRangeTime(date, this.NTH[dow][i].EndTime);
            if (nextActualRangeTime <= date && date <= prevActualRangeTime) {
                //in the i-th range
                newDate = nextActualRangeTime;
                break;
            }
        }
        //check if we need to recursively clampDown the previous day
        if (newDate != date) {
            //if time is SOD and NTH[PrevDay].EndTime = EOD, we might need to clampDown further to the previous day
            let dow_prev = this.Time.getPrevDayOfWeek(dow);
            if (this.Time.isSOD(newDate) && this.Time.isEOD(this.NTH[dow_prev][this.NTH[dow_prev].length - 1].EndTime)) {
                newDate = this.clampDown(newDate);
            }
        }

        return newDate;
    }
    clampUp(date) { //moves the date forward *within a day* or *overarching the day if required*
        let newDate = date; //we assume that date is not in a discontinued range

        let dow = this.actualDateOfWeek(date, "StartDate");
        //process the gaps (forward)
        //check if date is in a discontinued day range
        for (let i = 0; i < this.NTH[dow].length; i++) {
            //check is date is in the i-th discontinued range
            let nextActualRangeTime = this.Time.combine(date, this.NTH[dow][i].StartTime);
            let prevActualRangeTime = this.Time.combine(date, this.NTH[dow][i].EndTime);
            if (nextActualRangeTime <= date && date <= prevActualRangeTime) {
                //in the i-th range
                //add 1 day to account for midnight: 24:00:00.000 = 00:00:00.000 + 1d
                let nextDay = this.Time.isEOD(this.NTH[dow][i].EndTime) ? -1 : 0
                newDate = this.Time.combine(this.Time.addDays(date, nextDay), this.NTH[dow][i].EndTime);
                
                break;
            }
        }
        //check if we need to recursively clampUp the next day
        if (newDate != date) {
            //if time is EOD and NTH[NextDay].StartTime = SOD, we might need to clampUp further to the next day
            let dow_next = this.Time.getNextDayOfWeek(dow);
            if (this.Time.isEOD(newDate) && this.Time.isSOD(this.NTH[dow_next][0].StartTime)) {
                newDate = this.clampUp(newDate);
            }
        }

        return newDate;
    }
    distance(startDate, endDate) {// returns the number of included milliseconds (i.e. those which do not fall) within discontinuities
        //startDate is any clamped date: yyyy-MM-dd hh:mm:ss.mi
        //endDate is any clamped date: yyyy-MM-dd hh:mm:ss.mi and can be anywhere
        
        let a, b = { "ms": 0, "last": true }, c = { "ms": 0, "last": true }, d = { "ms": 0, "last": true }, e = { "ms": 0, "last": true };

        if (startDate < endDate) {
            //initial clamping
            startDate = this.clampUp(startDate); //if startDate is in the discontinued range, we move to its end
            endDate = this.clampDown(endDate); //if endDate is in the discontinued range, we move to its start

            //after clamping startDate may be > endDate
            if (startDate < endDate) {
                //intra*day* distance at the startDate (or endDate, whichever is first)
                a = this.intradayDistance(startDate, endDate);
                if (!a.last) {  //endDate exceed the eod
                    //...at this point the start-intraday is resolved
                    let startDay = this.Time.toEOD(startDate);
                    let endDay = this.Time.toSOD(endDate); //this is the *SOD* of the endDate, which we call endDay

                    //intra*day* distance at the endDate
                    e = this.intradayDistance(endDay, endDate);

                    //...at this point the start-intraday and end-intraday is resolved

                    //intra*week* distance at the startDay (or endDay, whichever is first)
                    b = this.intraweekDistance(startDay, endDay);
                    if (!b.last) {  //endDay exceed the eow
                        //...at this point the start-intraweek is resolved
                        let startWeek = this.Time.toEOW(startDay);
                        let endWeek = this.Time.toSOW(endDay); //this is the *SOW* of the endDate, which we call endWeek

                        //intra*week* distance at the endDay
                        d = this.intraweekDistance(endWeek, endDay);

                        //*extraweek* distance between startWeek and endWeek
                        c = this.extraweekDistance(startWeek, endWeek);
                    }
                }

                return a.ms + b.ms + c.ms + d.ms + e.ms;
            }
            else { //(clamped startDate > clamped endDate) --> startDate and EndDate both follow in the same discontinuous range
                return 0;
            }
        } else if (startDate > endDate) {
            return -this.distance(endDate, startDate);
        } else { //(startDate == endDate)
            return 0;
        }
    }
    offset(date, ms) {
        if (ms == 0)
            return date;

        //the total offset (endDate = startDate+offset) is the consecutive result of the following partial offsets:
        //IntradayOffset, wich takes the startDate to eod
        //  IntraweekOffset, which takes eod to eow
        //      extraweekOffset, wich takes the eow (=sow) to the last full week
        //  IntraweekOffset, which takes sow to sod
        //IntradayOffset, wich thatkes the sow to endDate

        let newval;

        newval = this.intradayOffset(date, ms); date = newval.date; ms = newval.ms;
        if (ms != 0) { newval = this.intraweekOffset(date, ms); date = newval.date; ms = newval.ms };
        if (ms != 0) { newval = this.extraweekOffset(date, ms); date = newval.date; ms = newval.ms };
        if (ms != 0) { newval = this.intraweekOffset(date, ms); date = newval.date; ms = newval.ms };
        if (ms != 0) { newval = this.intradayOffset(date, ms); date = newval.date; ms = newval.ms };


        if (!this.Time.isValidDate(date))
            console.log("aaa");

        return date;
    }
    copy() {
        return new DiscontinuityDayTimeProvider(this.NTH);
    }

}

//export closure
export const skipWeeklyPatterns = (TZ, NTH) => { //TimeZone, Non trading Hours expressed in the TimeZone
    const Time = new TimeUtils(TZ);
    const dp = new WeeklyPatternsDiscontinuityProvider(TZ, NTH);

    //return a wrapped of the class methods, so that all of these methods will be executed with the correct this scope, even if called from another object, e.g. array.apply(clampUp)
    //all charts utc dates are translated to utc+/- the requested timezone, processed, and then reverted back to the original utc timezone
    //for example:
    //utcDate.getUtcSting() = 'Thu, 30 Sep 2021 16:00:00 GMT'  <-- this date comes from the data provider. it is the original utc date of the event.
    //  --> tzDate.getUtcSting() = 'Thu, 30 Sep 2021 11:00:00 GMT' <-- this date is the translated utcDate in CT timezone (note that the translated values is the valueOf the Date, not its local representation)
    //      --> the DiscontinuityDayTimeProvider class works against the tzDate, which is a utc time, representing the time in the requested timezone
    //          --> the result is translated back to the original utc

    const provider = {};
    provider.clampDown = (utcDate) => { return Time.zonedTimeToUtc(dp.clampDown(Time.utcToZonedTime(utcDate, TZ)), TZ); };
    provider.clampUp = (utcDate) => { return Time.zonedTimeToUtc(dp.clampUp(Time.utcToZonedTime(utcDate, TZ)), TZ); };
    provider.distance = (utcStartDate, utcEndDate) => { return dp.distance(Time.utcToZonedTime(utcStartDate, TZ), Time.utcToZonedTime(utcEndDate, TZ)); };
    provider.offset = (utcStartDate, ms) => { return Time.zonedTimeToUtc(dp.offset(Time.utcToZonedTime(utcStartDate, TZ), ms), TZ); };
    provider.copy = () => { return skipWeeklyPatterns(TZ, NTH); };

    return provider;
}