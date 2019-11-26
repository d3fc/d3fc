import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { createCanvas } from 'canvas';
import annotationSvgGridline from '../src/svg/gridline';
import annotationCanvasGridline from '../src/canvas/gridline';

describe('gridline', () => {

    let context;

    beforeEach(() => {
        context = createCanvas().getContext('2d');
    });

    it('should work with continuous scales for svg', () => {
        const xScale = scaleLinear()
            .range([0, 100]);

        const yScale = scaleLinear()
            .range([0, 100]);

        const svgGridline = annotationSvgGridline()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .call(svgGridline);
    });

    it('should work with continuous scales for canvas', () => {
        const xScale = scaleLinear()
            .range([0, 100]);

        const yScale = scaleLinear()
            .range([0, 100]);

        const canvasGridline = annotationCanvasGridline()
            .xScale(xScale)
            .yScale(yScale);

        canvasGridline.context(context)();
    });

    it('should work with ordinal scales for svg', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const svgGridline = annotationSvgGridline()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .call(svgGridline);
    });

    it('should work with ordinal scales for canvas', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const canvasGridline = annotationCanvasGridline()
            .xScale(xScale)
            .yScale(yScale);

        canvasGridline.context(context)();
    });
});
