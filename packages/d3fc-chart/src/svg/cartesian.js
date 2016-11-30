import cartesianBase from '../cartesianBase';
import { select } from 'd3-selection';

const cartesian = cartesianBase('d3fc-svg',
    (data, element, plotArea, transitionPropagator) => {
        transitionPropagator(select(element))
            .select('svg')
            .call(plotArea);
    });

export default (...args) => cartesian(...args);
