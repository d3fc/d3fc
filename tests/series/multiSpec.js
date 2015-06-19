(function(d3, fc) {
    'use strict';

    function createSeriesSpy() {
        var series = jasmine.createSpy('series');
        series.xScale = jasmine.createSpy('xScale').and.returnValue(series);
        series.yScale = jasmine.createSpy('yScale').and.returnValue(series);
        return series;
    }

    describe('multi', function() {

        var multi, element, container, data;

        beforeEach(function() {
            multi = fc.series.multi();
            element = document.createElement('svg');
            container = d3.select(element);
            data = [0, 2, 4, 8, 16];

            container.datum(data);
        });

        it('should support n series', function() {

            var series = createSeriesSpy();

            multi.series([series, series]);

            container.call(multi);

            expect(series.calls.count()).toBe(2);
            expect(element.childNodes.length).toBe(2);
        });

        it('should support adding a series', function() {

            var series = createSeriesSpy();

            multi.series([series, series]);

            container.call(multi);

            expect(series.calls.count()).toBe(2);
            expect(element.childNodes.length).toBe(2);

            series.calls.reset();

            multi.series([series, series, series]);

            container.call(multi);

            expect(series.calls.count()).toBe(3);
            expect(element.childNodes.length).toBe(3);
        });

        it('should support removing a series', function() {

            var series = createSeriesSpy();

            multi.series([series, series]);

            container.call(multi);

            expect(series.calls.count()).toBe(2);
            expect(element.childNodes.length).toBe(2);

            series.calls.reset();

            multi.series([series]);

            container.call(multi);

            expect(series.calls.count()).toBe(1);
            expect(element.childNodes.length).toBe(1);
        });

        it('should support re-ordering with key', function() {

            var seriesA = createSeriesSpy();
            seriesA.id = 'seriesA';

            var seriesB = createSeriesSpy();
            seriesB.id = 'seriesB';

            multi.key(function(series) {
                return series.id;
            });

            multi.series([seriesA, seriesB]);

            container.call(multi);

            expect(seriesA.calls.count()).toBe(1);
            expect(seriesB.calls.count()).toBe(1);
            expect(element.childNodes.length).toBe(2);

            var seriesAContainer = seriesA.calls.mostRecent().args[0].node(),
                seriesBContainer = seriesB.calls.mostRecent().args[0].node();

            seriesA.calls.reset();
            seriesB.calls.reset();

            multi.series([seriesB, seriesA]);

            container.call(multi);

            expect(seriesA.calls.count()).toBe(1);
            expect(seriesB.calls.count()).toBe(1);
            expect(element.childNodes.length).toBe(2);

            expect(seriesA.calls.mostRecent().args[0].node()).toBe(seriesAContainer);
            expect(seriesB.calls.mostRecent().args[0].node()).toBe(seriesBContainer);
        });
    });

}(d3, fc));
