import * as d3 from 'd3';
import { expectType, expectAssignable } from 'tsd';
import chartCartesian, { CartesianChart } from '../src/cartesian';
import { extentLinear, extentDate } from "../../d3fc-extent"
import { randomFinancial } from '../../d3fc-random-data'
import { annotationSvgGridline } from '../../d3fc-annotation';
import { seriesSvgCandlestick, seriesSvgMulti } from '../../d3fc-series'

describe('cartesian', () => {

    beforeEach(() => {
        const data = randomFinancial()(50);
        const yExtent = extentLinear().accessors([(d: any) => d.high, (d: any) => d.low]) as any;
        const xExtent = extentDate().accessors([(d: any) => d.date]) as any;

        const gridlines = annotationSvgGridline();
        const candlestick = seriesSvgCandlestick();
        const multi = (seriesSvgMulti() as any).series([gridlines, candlestick]);

        type TChart = typeof chart;

        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear())
        expectAssignable<CartesianChart<any, any>>(chart)
        expectType<TChart>(chart);

        const chainedChart = chart.yDomain(yExtent(data))
            .xDomain(xExtent(data))
            .svgPlotArea(multi);
        expectType<TChart>(chainedChart);
    })

    it('expect true to be true', () => {
        expect(true).toBe(true)
    });
});
