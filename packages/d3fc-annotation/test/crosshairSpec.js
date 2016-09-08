import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import annotationCrosshair from '../src/svg/crosshair';

describe('crosshair', () => {

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

        const crosshair = annotationCrosshair()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([{ x: 50, y: 50 }])
            .call(crosshair);
    });

    it('should work with ordinal scales', () => {
        const xScale = scaleOrdinal()
            .range([0, 100]);

        const yScale = scaleOrdinal()
            .range([0, 100]);

        const crosshair = annotationCrosshair()
            .xScale(xScale)
            .yScale(yScale);

        select('svg')
            .datum([{ x: 50, y: 50 }])
            .call(crosshair);
    });
});
