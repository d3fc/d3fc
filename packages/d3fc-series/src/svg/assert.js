import {selection} from 'd3-selection';

export const assertIsSelection = (sel) => {
    if (!(sel instanceof selection)) {
        throw new Error('Series components must be invoked with a D3 selection. If you are using in conjunction with d3fc chart, check you are adding the series to an svgPlotArea');
    }
};
