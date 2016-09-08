import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import annotationGridline from '../src/svg/gridline';

describe('gridline', () => {

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

        const gridline = annotationGridline()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .call(gridline);
    });

    it('should work with ordinal scales', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const gridline = annotationGridline()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .call(gridline);
    });
});
