import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { createCanvas } from 'canvas';
import annotationSvgLine from '../src/svg/line';
import annotationCanvasLine from '../src/canvas/line';

describe('line', () => {

    let context;

    beforeEach(() => {
        context = createCanvas().getContext('2d');
    });

    it('should work with continuous scales for svg', () => {
        const xScale = scaleLinear()
            .range([0, 100]);

        const yScale = scaleLinear()
            .range([0, 100]);

        const svgLine = annotationSvgLine()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([30])
            .call(svgLine);
    });

    it('should work with continuous scales for canvas', () => {
        const xScale = scaleLinear()
            .range([0, 100]);

        const yScale = scaleLinear()
            .range([0, 100]);

        const canvasLine = annotationCanvasLine()
            .xScale(xScale)
            .yScale(yScale);

        canvasLine.context(context)([30]);
    });

    it('should work with ordinal scales for svg', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const svgLine = annotationSvgLine()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([30])
            .call(svgLine);
    });

    it('should work with ordinal scales for canvas', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const canvasLine = annotationCanvasLine()
            .xScale(xScale)
            .yScale(yScale);

        canvasLine.context(context)([30]);
    });
});
