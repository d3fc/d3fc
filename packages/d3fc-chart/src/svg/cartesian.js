import cartesianBase from '../cartesianBase';
import { seriesSvgLine } from '@d3fc/d3fc-series';

export default cartesianBase(
    (cartesian, plotArea) => cartesian.svgPlotArea(plotArea),
    seriesSvgLine
);
