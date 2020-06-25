import timeExtent from '../src/time';
import ms from 'ms';

describe('time', () => {
    it('should pad dates with domain padding', function() {
        var date1 = new Date(2014, 0, 10);
        var date2 = new Date(2014, 0, 20);
        var data = [{ date: date1 }, { date: date2 }];

        var extents = timeExtent()
            .accessors([d => d.date])
            .padUnit('domain')
            .pad([ms('1d'), ms('2d')])(data);
        expect(extents).toEqual([new Date(2014, 0, 9), new Date(2014, 0, 22)]);
    });

    it('should pad dates with percentage padding', function() {
        var date1 = new Date(2014, 0, 10);
        var date2 = new Date(2014, 0, 20);
        var data = [{ date: date1 }, { date: date2 }];

        var extents = timeExtent()
            .accessors([d => d.date])
            .padUnit('percent')
            .pad([0.6, 0.5])(data);
        expect(extents).toEqual([new Date(2014, 0, 4), new Date(2014, 0, 25)]);
    });

    it('should calculate symmetry about dates', function() {
        var date1 = new Date(2014, 0, 10);
        var date2 = new Date(2014, 0, 20);

        var data = [{ date: date1 }, { date: date2 }];

        var extents = timeExtent()
            .accessors([d => d.date])
            .symmetricalAbout(new Date(2014, 0, 14))(data);
        expect(extents).toEqual([new Date(2014, 0, 8), new Date(2014, 0, 20)]);
    });

    it('should include dates', function() {
        var date1 = new Date(2014, 0, 10);
        var date2 = new Date(2014, 0, 20);

        var data = [{ date: date1 }, { date: date2 }];

        var extents = timeExtent()
            .accessors([d => d.date])
            .include([new Date(2014, 0, 30)])(data);
        expect(extents).toEqual([new Date(2014, 0, 10), new Date(2014, 0, 30)]);

        extents = timeExtent()
            .accessors([d => d.date])
            .include([new Date(2014, 0, 15)])(data);
        expect(extents).toEqual([new Date(2014, 0, 10), new Date(2014, 0, 20)]);

        extents = timeExtent()
            .accessors([d => d.date])
            .include([new Date(2014, 0, 1)])(data);
        expect(extents).toEqual([new Date(2014, 0, 1), new Date(2014, 0, 20)]);
    });

    it('should always invoke valueOf on a scalar accessor result', function() {
        const date = new Date(2014, 0, 1);
        jest.spyOn(date, 'valueOf');
        timeExtent().accessors([d => d])([date]);
        expect(date.valueOf).toHaveBeenCalled();
    });

    it('should always invoke valueOf on a scalar array accessor result', function() {
        const date = new Date(2014, 0, 1);
        jest.spyOn(date, 'valueOf');
        timeExtent().accessors([d => [d, d]])([date]);
        expect(date.valueOf).toHaveBeenCalled();
    });

    it('should handle null dates', function() {
        const date1 = new Date(2014, 0, 10);
        const date2 = null;
        const date3 = new Date(2014, 0, 20);
        var extent = timeExtent().accessors([d => d])([date1, date2, date3]);
        expect(extent).toEqual([date1, date3]);
    });
});
