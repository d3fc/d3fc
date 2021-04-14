import { randomFinancial } from '@d3fc/d3fc-random-data'
import { extentLinear, extentDate } from '@d3fc/d3fc-extent'
import { annotationSvgGridline } from '@d3fc/d3fc-annotation';
import { seriesSvgCandlestick, seriesSvgMulti } from '@d3fc/d3fc-series';
import { scaleLinear, scaleTime } from 'd3-scale';
import { chartCartesian } from '@d3fc/d3fc-chart';
import { select as d3Select } from 'd3-selection'
import SeedRandom from 'seedrandom'
import * as MockDate from 'mockdate'

SeedRandom('a22ebc7c488a3a47');
MockDate.set('2000-01-01', 0);

const data = randomFinancial()(50);

const yExtent = extentLinear().accessors([d => d.high, d => d.low]) as ((...args: any[]) => void)

const xExtent = extentDate().accessors([d => d.date]) as ((...args: any[]) => void)

const gridlines = annotationSvgGridline();
const candlestick = seriesSvgCandlestick();
const multi = (seriesSvgMulti() as any).series([gridlines, candlestick]);

const chart = chartCartesian(scaleTime(), scaleLinear())

chart
    .yDomain(yExtent(data))
chart
    .xDomain(xExtent(data))
chart
    .svgPlotArea(multi);

d3Select('#chart')
    .datum(data)
    .call(chart);
