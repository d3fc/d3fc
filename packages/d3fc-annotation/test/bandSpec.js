import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import annotationBand from '../src/band';

describe('band', () => {

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

        const band = annotationBand()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([{ from: 10, to: 90 }])
            .call(band);
    });

    it('should work with ordinal scales', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const band = annotationBand()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([{ from: 10, to: 90 }])
            .call(band);
    });
});
