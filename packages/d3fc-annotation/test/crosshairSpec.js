import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { createCanvas } from 'canvas';
import annotationSvgCrosshair from '../src/svg/crosshair';
import annotationCanvasCrosshair from '../src/canvas/crosshair';

describe('crosshair', () => {

    let context;

    beforeEach(() => {
        context = createCanvas().getContext('2d');
    });

    it('should work with continuous scales for svg', () => {
        const xScale = scaleLinear()
            .range([0, 100]);

        const yScale = scaleLinear()
            .range([0, 100]);

        const svgCrosshair = annotationSvgCrosshair()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([{ x: 50, y: 50 }])
            .call(svgCrosshair);
    });

    it('should work with continuous scales for canvas', () => {
        const xScale = scaleLinear()
            .range([0, 100]);

        const yScale = scaleLinear()
            .range([0, 100]);

        const canvasCrosshair = annotationCanvasCrosshair()
            .xScale(xScale)
            .yScale(yScale);

        canvasCrosshair.context(context)([{ x: 50, y: 50 }]);
    });

    it('should work with ordinal scales for svg', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const svgCrosshair = annotationSvgCrosshair()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([{ x: 50, y: 50 }])
            .call(svgCrosshair);
    });

    it('should work with ordinal scales for canvas', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const canvasCrosshair = annotationCanvasCrosshair()
            .xScale(xScale)
            .yScale(yScale);

        canvasCrosshair.context(context)([{ x: 50, y: 50 }]);
    });
});
