import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { createCanvas } from 'canvas';
import annotationSvgBand from '../src/svg/band';
import annotationCanvasBand from '../src/canvas/band';

describe('band', () => {

    let context;

    beforeEach(() => {
        context = createCanvas().getContext('2d');
    });

    it('should work with continuous scales for svg', () => {
        const xScale = scaleLinear()
            .range([0, 100]);

        const yScale = scaleLinear()
            .range([0, 100]);

        const svgBand = annotationSvgBand()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([{ from: 10, to: 90 }])
            .call(svgBand);
    });

    it('should work with continuous scales for canvas', () => {
        const xScale = scaleLinear()
            .range([0, 100]);

        const yScale = scaleLinear()
            .range([0, 100]);

        const canvasBand = annotationCanvasBand()
            .xScale(xScale)
            .yScale(yScale);

        canvasBand.context(context)([{ from: 10, to: 90 }]);
    });

    it('should work with ordinal scales for svg', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const svgBand = annotationSvgBand()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([{ from: 10, to: 90 }])
            .call(svgBand);
    });

    it('should work with ordinal scales for canvas', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const canvasBand = annotationCanvasBand()
            .xScale(xScale)
            .yScale(yScale);

        canvasBand.context(context)([{ from: 10, to: 90 }]);
    });
});
