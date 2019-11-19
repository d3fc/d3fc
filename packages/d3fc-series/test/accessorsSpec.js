import * as fc from '../index';

describe('accessors', () => {
    describe('mainValue/crossValue series', () => {
        const mainValue = () => 0;
        const crossValue = () => 1;

        const series = [
            fc.seriesSvgLine(),
            fc.seriesSvgPoint(),
            fc.seriesCanvasLine(),
            fc.seriesCanvasPoint()
        ];
        it('should be correct in vertical orientation', () => {
            series.forEach(series => {
                series.mainValue(mainValue)
                    .crossValue(crossValue);

                expect(series.xValues()).toContain(crossValue);
                expect(series.yValues()).toContain(mainValue);
            });
        });
        it('should be correct in horizontal orientation', () => {
            series.forEach(series => {
                series.mainValue(mainValue)
                    .crossValue(crossValue)
                    .orient('horizontal');

                expect(series.xValues()).toContain(mainValue);
                expect(series.yValues()).toContain(crossValue);

            });
        });
    });
    describe('mainValue/crossValue/baseValue series', () => {
        const mainValue = () => 0;
        const baseValue = () => 1;
        const crossValue = () => 2;

        const series = [
            fc.seriesSvgArea(),
            fc.seriesSvgBar(),
            fc.seriesCanvasArea(),
            fc.seriesCanvasBar()
        ];
        it('should be correct in vertical orientation', () => {
            series.forEach(series => {
                series.mainValue(mainValue)
                    .baseValue(baseValue)
                    .crossValue(crossValue);

                expect(series.xValues()).toContain(crossValue);
                expect(series.yValues()).toContain(mainValue);
                expect(series.yValues()).toContain(baseValue);
            });
        });
        it('should be correct in horizontal orientation', () => {
            series.forEach(series => {
                series.mainValue(mainValue)
                    .baseValue(baseValue)
                    .crossValue(crossValue)
                    .orient('horizontal');

                expect(series.xValues()).toContain(mainValue);
                expect(series.xValues()).toContain(baseValue);
                expect(series.yValues()).toContain(crossValue);

            });
        });
    });
    describe('highValue/lowValue/crossValue series', () => {
        const highValue = () => 0;
        const lowValue = () => 1;
        const crossValue = () => 2;

        const series = [
            fc.seriesSvgErrorBar(),
            fc.seriesCanvasErrorBar()
        ];
        it('should be correct', () => {
            series.forEach(series => {
                series.highValue(highValue)
                    .lowValue(lowValue)
                    .crossValue(crossValue);

                expect(series.xValues()).toContain(crossValue);
                expect(series.yValues()).toContain(highValue);
                expect(series.yValues()).toContain(lowValue);
            });
        });
    });
    describe('openValue/highValue/lowValue/closeValue/crossValue series', () => {
        const openValue = () => 0;
        const highValue = () => 1;
        const lowValue = () => 2;
        const closeValue = () => 3;
        const crossValue = () => 4;

        const series = [
            fc.seriesSvgCandlestick(),
            fc.seriesSvgOhlc(),
            fc.seriesCanvasCandlestick(),
            fc.seriesCanvasOhlc()
        ];
        it('should be correct', () => {
            series.forEach(series => {
                series.openValue(openValue)
                    .highValue(highValue)
                    .lowValue(lowValue)
                    .closeValue(closeValue)
                    .crossValue(crossValue);

                expect(series.xValues()).toContain(crossValue);
                expect(series.yValues()).toContain(openValue);
                expect(series.yValues()).toContain(highValue);
                expect(series.yValues()).toContain(lowValue);
                expect(series.yValues()).toContain(closeValue);
            });
        });
    });
    describe('multi/grouped series', () => {
        const mainValue = () => 0;
        const crossValue = () => 1;

        const svgSubSeries = fc.seriesSvgLine()
            .mainValue(mainValue)
            .crossValue(crossValue);

        const canvasSubSeries = fc.seriesCanvasLine()
            .mainValue(mainValue)
            .crossValue(crossValue);

        const series = [
            fc.seriesSvgGrouped(svgSubSeries),
            fc.seriesSvgMulti().series([svgSubSeries]),
            fc.seriesCanvasGrouped(canvasSubSeries),
            fc.seriesCanvasMulti().series([canvasSubSeries])
        ];
        it('should be correct', () => {
            series.forEach(series => {
                expect(series.xValues()).toContain(crossValue);
                expect(series.yValues()).toContain(mainValue);
            });
        });
    });
    describe('heatmap series', () => {
        const xValue = () => 0;
        const yValue = () => 1;

        const series = [
            fc.seriesSvgHeatmap(),
            fc.seriesCanvasHeatmap()
        ];
        it('should be correct', () => {
            series.forEach(series => {
                series.xValue(xValue)
                    .yValue(yValue);

                expect(series.xValues()).toContain(xValue);
                expect(series.yValues()).toContain(yValue);
            });
        });
    });
});
