import { scaleLinear, scaleBand } from 'd3-scale';
import { range } from 'd3-array';
import { rebindAll, includeMap } from '@d3fc/d3fc-rebind';
import functor from './functor';
import alignOffset from './alignOffset';
import createBase from './base';

export default (series) => {

    let bandwidth = () => 50;
    let align = 'center';

    // the offset scale is used to offset each of the series within a group
    const offsetScale = scaleBand();

    const grouped = createBase({
        decorate: () => {},
        xScale: scaleLinear(),
        yScale: scaleLinear()
    });

    // the bandwidth for the grouped series can be a function of datum / index. As a result
    // the offset scale required to cluster the 'sub' series is also dependent on datum / index.
    // This function computes the offset scale for a specific datum / index of the grouped series
    grouped.offsetScaleForDatum = (data, d, i) => {
        const width = bandwidth(d, i);
        const offset = alignOffset(align, width);

        const halfWidth = width / 2;
        return offsetScale
          .domain(range(0, data.length))
          .range([-halfWidth + offset, halfWidth + offset]);
    };

    grouped.bandwidth = (...args) => {
        if (!args.length) {
            return bandwidth;
        }
        bandwidth = functor(args[0]);
        return grouped;
    };
    grouped.align = (...args) => {
        if (!args.length) {
            return align;
        }
        align = args[0];
        return grouped;
    };

    rebindAll(grouped, offsetScale, includeMap({'paddingInner': 'paddingOuter'}));

    return grouped;
};
