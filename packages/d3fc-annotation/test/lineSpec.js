import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import annotationLine from '../src/svg/line';

describe('line', () => {

    let element;
    let container;

    beforeEach(() => {
        element = document.createElement('svg');
        container = select(element);
    });

    it('should work with continuous scales', () => {
        const xScale = scaleLinear()
            .range([0, 100]);

        const yScale = scaleLinear()
            .range([0, 100]);

        const line = annotationLine()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([30])
            .call(line);
    });

    it('should work with ordinal scales', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const line = annotationLine()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([30])
            .call(line);
    });
});
