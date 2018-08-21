import geometricBrownianMotion from './geometricBrownianMotion';
import { randomNormal } from 'd3-random';
import { rebindAll } from '@d3fc/d3fc-rebind';
import { timeDay, timeYear } from 'd3-time';
import { functor } from './fn';

export default function() {
    let startDate = new Date();
    let startPrice = 100;
    let interval = timeDay;
    let intervalStep = 1;
    let unitInterval = timeYear;
    let unitIntervalStep = 1;
    let filter = null;
    let volume = () => {
        const normal = randomNormal(1, 0.1);
        return Math.ceil(normal() * 1000);
    };
    const gbm = geometricBrownianMotion();

    const getOffsetPeriod = date => {
        const unitMilliseconds = unitInterval.offset(date, unitIntervalStep) - date;
        return (interval.offset(date, intervalStep) - date) / unitMilliseconds;
    };

    const calculateOHLC = (start, price) => {
        const period = getOffsetPeriod(start);
        const prices = gbm.period(period)(price);
        const ohlc = {
            date: start,
            open: prices[0],
            high: Math.max.apply(Math, prices),
            low: Math.min.apply(Math, prices),
            close: prices[gbm.steps()]
        };
        ohlc.volume = volume(ohlc);
        return ohlc;
    };

    const getNextDatum = ohlc => {
        let date, price, filtered;
        do {
            date = ohlc ? interval.offset(ohlc.date, intervalStep) : new Date(startDate.getTime());
            price = ohlc ? ohlc.close : startPrice;
            ohlc = calculateOHLC(date, price);
            filtered = filter && !filter(ohlc);
        } while (filtered);
        return ohlc;
    };

    const makeStream = () => {
        let latest;
        const stream = {};
        stream.next = () => {
            const ohlc = getNextDatum(latest);
            latest = ohlc;
            return ohlc;
        };
        stream.take = numPoints => stream.until((d, i) => !numPoints || numPoints < 0 || i === numPoints);
        stream.until = comparison => {
            const data = [];
            let index = 0;
            let ohlc = getNextDatum(latest);
            let compared = comparison && !comparison(ohlc, index);
            while (compared) {
                data.push(ohlc);
                latest = ohlc;
                ohlc = getNextDatum(latest);
                index += 1;
                compared = comparison && !comparison(ohlc, index);
            }
            return data;
        };
        return stream;
    };

    const financial = numPoints => makeStream().take(numPoints);
    financial.stream = makeStream;

    if (typeof Symbol !== 'function' || typeof Symbol.iterator !== 'symbol') {
        throw new Error('d3fc-random-data depends on Symbol. Make sure that you load a polyfill in older browsers. See README.');
    }

    financial[Symbol.iterator] = () => {
        const stream = makeStream();
        return {
            next: () => ({
                value: stream.next(),
                done: false
            })
        };
    };

    financial.startDate = (...args) => {
        if (!args.length) {
            return startDate;
        }
        startDate = args[0];
        return financial;
    };
    financial.startPrice = (...args) => {
        if (!args.length) {
            return startPrice;
        }
        startPrice = args[0];
        return financial;
    };
    financial.interval = (...args) => {
        if (!args.length) {
            return interval;
        }
        interval = args[0];
        return financial;
    };
    financial.intervalStep = (...args) => {
        if (!args.length) {
            return intervalStep;
        }
        intervalStep = args[0];
        return financial;
    };
    financial.unitInterval = (...args) => {
        if (!args.length) {
            return unitInterval;
        }
        unitInterval = args[0];
        return financial;
    };
    financial.unitIntervalStep = (...args) => {
        if (!args.length) {
            return unitIntervalStep;
        }
        unitIntervalStep = args[0];
        return financial;
    };
    financial.filter = (...args) => {
        if (!args.length) {
            return filter;
        }
        filter = args[0];
        return financial;
    };
    financial.volume = (...args) => {
        if (!args.length) {
            return volume;
        }
        volume = functor(args[0]);
        return financial;
    };

    rebindAll(financial, gbm);

    return financial;
}
