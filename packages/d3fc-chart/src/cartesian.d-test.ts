import d3 from 'd3';
import chartCartesian from './cartesian';
import { extentLinear, extentDate } from "../../d3fc-extent"
import { randomFinancial } from '../../d3fc-random-data'
import { annotationSvgGridline } from '../../d3fc-annotation';
import { seriesSvgCandlestick, seriesSvgMulti } from '../../d3fc-series'

const data = randomFinancial()(50);

const yExtent = extentLinear().accessors([d => d.high, d => d.low]) as any;

const xExtent = extentDate().accessors([d => d.date]) as any;

const gridlines = annotationSvgGridline();
const candlestick = seriesSvgCandlestick();
const multi = (seriesSvgMulti() as any).series([gridlines, candlestick]);

const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear())
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .svgPlotArea(multi);

d3.select('#chart')
    .datum(data)
    .call(chart);