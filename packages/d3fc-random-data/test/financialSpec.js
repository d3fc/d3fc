import { default as financial } from '../src/financial';
import { default as skipWeekends } from '../src/filter/skipWeekends';
import { timeDay } from 'd3-time';

describe('financial', () => {

    let generator;
    beforeEach(() => {
        generator = financial()
            .startDate(new Date(2015, 0, 1))
            .interval(timeDay)
            .intervalStep(1);
    });

    it('should return the correct number of data points', () => {
        const result = generator(10);
        expect(result).toHaveLength(10);
    });

    it('should always return an initial date equal to the set startDate', () => {
        const result0 = generator(10);
        const result1 = generator(10);
        expect(result0[0].date).toEqual(new Date(2015, 0, 1));
        expect(result1[0].date).toEqual(new Date(2015, 0, 1));
    });

    it('should always return an initial open value equal to the set startPrice', () => {
        generator.startPrice(50);
        const result0 = generator(10);
        const result1 = generator(10);
        expect(result0[0].open).toEqual(50);
        expect(result1[0].open).toEqual(50);
    });

    it('should exclude points with filtered date from result', () =>  {
        generator.filter(d => d.date > new Date(2015, 0, 5));
        const stream = generator.stream();
        const result = stream.until(datum => datum.date > new Date(2015, 0, 10));
        expect(result).toHaveLength(5);
    });

    it('with fc.data.random.filter.skipWeekends filter, should not include weekends', () => {
        generator.filter(skipWeekends);
        const data = generator(10);
        for (let i = 0, max = data.length; i < max; i += 1) {
            const day = data[i].date.getDay();
            expect(day).not.toBe(0);
            expect(day).not.toBe(6);
        }
    });

    it('should allow setting volume using number', () => {
        generator.volume(1000);
        const result = generator(2);
        expect(result[0].volume).toBe(1000);
        expect(result[1].volume).toBe(1000);
    });

    it('should allow setting volume using function', () => {
        generator.volume(d => d.date <= new Date(2015, 0, 1) ? 50 : 100);
        const result = generator(2);
        expect(result[0].volume).toBe(50);
        expect(result[1].volume).toBe(100);
    });

    it('should allow setting random using function', () => {
        // create a random number generator that produces a predictable sequence
        // 0.2, 0.8, 0.2, 0.8 ...
        const normal = () => {
            let index = 0;
            return () => index++ % 2 ? 0.2 : 0.8;
        };
        generator.random(normal());
        const result = generator(3);

        // this test data was generated at the following point:
        // 56277c28ede1dacf79e1ea50ca8aac7341b34f74
        // and is assumed correct for the purposes of further refactor.
        expect(result[0].open).toBe(100);
        expect(result[0].high).toBe(101.20362482900286);
        expect(result[0].low).toBe(100);
        expect(result[0].close).toBe(101.20362482900286);

        expect(result[1].open).toBe(101.20362482900286);
        expect(result[1].high).toBe(102.42173678529561);
        expect(result[1].low).toBe(101.20362482900286);
        expect(result[1].close).toBe(102.42173678529561);

        expect(result[2].open).toBe(102.42173678529561);
        expect(result[2].high).toBe(103.65451023953936);
        expect(result[2].low).toBe(102.42173678529561);
        expect(result[2].close).toBe(103.65451023953936);
    });

    it('stream.next should initially return datum at start date', () => {
        const stream = generator.stream();
        const datum = stream.next();
        expect(datum.date).toEqual(new Date(2015, 0, 1));
    });

    it('stream.next should subsequently return datum with date incremented by set granularity', () => {
        const stream = generator.stream();
        stream.next();
        const datum = stream.next();
        expect(datum.date).toEqual(new Date(2015, 0, 2));
    });

    it('stream.next with filter should skip filtered dates', () => {
        generator.filter(d => d.date > new Date(2015, 0, 4) && d.date.getTime() !== new Date(2015, 0, 6).getTime());
        const stream = generator.stream();
        const first = stream.next();
        const second = stream.next();
        expect(first.date).toEqual(new Date(2015, 0, 5));
        expect(second.date).toEqual(new Date(2015, 0, 7));
    });

    it('stream.take should return the requested number of points', () => {
        generator.filter(d => d.date > new Date(2015, 0, 5));
        const stream = generator.stream();
        const data = stream.take(10);
        expect(data).toHaveLength(10);
    });

    it('stream.take with non-positive numeric argument should return empty array', () => {
        const stream = generator.stream();
        const data0 = stream.take(0);
        expect(data0).toHaveLength(0);
        const data1 = stream.take(-1);
        expect(data1).toHaveLength(0);
    });

    it('stream.take with undefined argument should return empty array', () => {
        const stream = generator.stream();
        const data = stream.take();
        expect(data).toHaveLength(0);
    });

    it('stream.until should generate data up to the datum that satisfies the specified condition', () => {
        const stream = generator.stream();
        const data = stream.until(d => d.date > new Date(2015, 0, 10));
        expect(data).toHaveLength(10);
    });

    it('stream.until subsequent stream method call should have correctly incremented date', () => {
        const stream = generator.stream();
        stream.until(d => d.date > new Date(2015, 0, 10));
        const next = stream.next();
        expect(next.date).toEqual(new Date(2015, 0, 11));
    });

    it('stream.until without comparison should return empty array', () => {
        const stream = generator.stream();
        const data = stream.until();
        expect(data).toEqual([]);
    });

    it('should implement the iterable protocol', () => {
        const [first, second] = generator;
        expect(first.date).toEqual(new Date(2015, 0, 1));
        expect(second.date).toEqual(new Date(2015, 0, 2));
    });
});
