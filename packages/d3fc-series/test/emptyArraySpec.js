import { select } from 'd3-selection';
import * as fc from '../index';
import { createCanvas } from 'canvas';

const svgSeriesTypes = [
    fc.seriesSvgArea(),
    fc.seriesSvgBar(),
    fc.seriesSvgBoxPlot(),
    fc.seriesSvgCandlestick(),
    fc.seriesSvgErrorBar(),
    fc.seriesSvgGrouped(fc.seriesSvgBar()),
    fc.seriesSvgLine(),
    fc.seriesSvgMulti(),
    fc.seriesSvgOhlc(),
    fc.seriesSvgPoint()
];

const canvasSeriesTypes = [
    fc.seriesCanvasArea(),
    fc.seriesCanvasBar(),
    fc.seriesCanvasBoxPlot(),
    fc.seriesCanvasCandlestick(),
    fc.seriesCanvasErrorBar(),
    fc.seriesCanvasGrouped(fc.seriesCanvasBar()),
    fc.seriesCanvasLine(),
    fc.seriesCanvasMulti(),
    fc.seriesCanvasOhlc(),
    fc.seriesCanvasPoint()
];

describe('With an empty array', () => {
    it('series should render withour error', () => {
        const svg = document.createElement('svg');
        const container = select(svg);

        svgSeriesTypes.forEach(series =>
            container.datum([]).call(series)
        );

        const canvas = createCanvas();
        const context = canvas.getContext('2d');

        canvasSeriesTypes.forEach(series =>
            series.context(context)([])
        );
    });
});
