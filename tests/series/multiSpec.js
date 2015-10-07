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

    describe('ordering of series containers', function() {

        var seriesA, seriesB, seriesC;

        function verifyContainers(element, series) {
            expect(element.childNodes.length).toBe(series.length);
            series.forEach(function(series, i) {
                var seriesContainer = series.calls.mostRecent().args[0].node();
                expect(element.childNodes[i]).toBe(seriesContainer);
            });
        }

        beforeEach(function() {
            seriesA = createSeriesSpy();
            seriesA.id = 'seriesA';

            seriesB = createSeriesSpy();
            seriesB.id = 'seriesB';

            seriesC = createSeriesSpy();
            seriesC.id = 'seriesC';

            multi.key(function(series) {
                return series.id;
            });
        });

        it('should not create series containers for no series', function() {

            var series = [];
            multi.series(series);
            container.call(multi);
            verifyContainers(element, series);
        });

        it('should create a single container for a single series', function() {

            var series = [seriesA];
            multi.series(series);
            container.call(multi);
            verifyContainers(element, series);
        });

        it('should order series containers in an order consistent with the series', function() {

            var series = [seriesA, seriesB];
            multi.series(series);
            container.call(multi);
            verifyContainers(element, series);
        });

        it('should insert new series containers in an order consistent with the series', function() {

            var series = [seriesA, seriesB];
            multi.series(series);
            container.call(multi);
            verifyContainers(element, series);

            series = [seriesA, seriesB, seriesC];
            multi.series(series);
            container.call(multi);
            verifyContainers(element, series);
        });

        it('should order series containers in an order consistent with the series when removing a series', function() {

            var series = [seriesA, seriesB, seriesC];
            multi.series(series);
            container.call(multi);
            verifyContainers(element, series);

            series = [seriesA, seriesC];
            multi.series(series);
            container.call(multi);
            verifyContainers(element, series);
        });

        it('should re-order series containers in an order consistent with the series array', function() {

            var series = [seriesA, seriesB, seriesC];
            multi.series(series);
            container.call(multi);
            verifyContainers(element, series);

            series = [seriesC, seriesA, seriesB];
            multi.series(series);
            container.call(multi);
            verifyContainers(element, series);
        });

    });
});
