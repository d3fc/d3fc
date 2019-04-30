/* global d3 */
import * as fc from '../index';

describe('xScale', () => {

    let svgSeries;

    beforeEach(() => (svgSeries = getSvgSeries()));

    it('should default to scaleIdentity', () => {
        svgSeries.forEach(series => {
            expect(series.xScale()(1)).toBe(1);
            expect(series.xScale()(2)).toBe(2);
        });
    });

    it('can be overridden', () => {
        const xScale = x => x === 1 ? -1 : x;
        svgSeries.forEach(series => {
            series.xScale(xScale);
            expect(series.xScale()(1)).toBe(-1);
            expect(series.xScale()(2)).toBe(2);
        });
    });

});

describe('SVG error reporting', () => {

    let svgSeries;

    beforeEach(() => (svgSeries = getSvgSeries()));

    it('should not throw if supplied with a data-joined selection', () => {
        svgSeries.forEach(series => {
            const selection = d3.select('body').datum([]);
            selection.call(series);
        });
    });

    it('should throw if invoked with a non-selection', () => {
        const notASelection = () => {};
        svgSeries.forEach(series => {
            expect(() => {
                series(notASelection);
            }).toThrow(new Error('Series components must be invoked with a D3 selection. If you are using in conjunction with d3fc chart, check you are adding the series to an svgPlotArea'));
        });
    });
});

describe('yScale', () => {

    let svgSeries;

    beforeEach(() => (svgSeries = getSvgSeries()));

    it('should default to scaleIdentity', () => {
        svgSeries.forEach(series => {
            expect(series.yScale()(1)).toBe(1);
            expect(series.yScale()(2)).toBe(2);
        });
    });

    it('can be overridden', () => {
        const yScale = x => x === 1 ? -1 : x;
        svgSeries.forEach(series => {
            series.yScale(yScale);
            expect(series.yScale()(1)).toBe(-1);
            expect(series.yScale()(2)).toBe(2);
        });
    });

});

function getSvgSeries() {
    return [
        fc.seriesSvgArea(),
        fc.seriesSvgBar(),
        fc.seriesSvgBoxPlot(),
        fc.seriesSvgCandlestick(),
        fc.seriesSvgErrorBar(),
        fc.seriesSvgLine(),
        fc.seriesSvgMulti(),
        fc.seriesSvgOhlc(),
        fc.seriesSvgPoint()
    ];
}
