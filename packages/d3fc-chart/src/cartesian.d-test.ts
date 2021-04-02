import d3 from 'd3';
import { chartCartesian } from '../';
import { extentLinear, extentDate } from "../../d3fc-extent"

const yExtent: any = extentLinear().accessors([d => d.high, d => d.low]);
const xExtent: any = extentDate().accessors([d => d.date]);


const data = []

const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear())
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .svgPlotArea(multi);

d3.select('#chart')
    .datum(data)
    .call(chart);