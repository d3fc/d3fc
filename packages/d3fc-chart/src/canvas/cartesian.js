import cartesianBase from '../cartesianBase';
import { seriesCanvasLine } from '@d3fc/d3fc-series';

export default cartesianBase(
    (cartesian, plotArea) => cartesian.canvasPlotArea(plotArea),
    seriesCanvasLine
);
