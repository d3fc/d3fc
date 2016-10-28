import { scaleLinear, scaleBand } from 'd3-scale';
import fractionalBarWidth from './fractionalBarWidth';
import functor from './functor';
import { range } from 'd3-array';
import { rebindAll, includeMap } from 'd3fc-rebind';

export default (series) => {

    let groupWidth = fractionalBarWidth(0.75);
    let decorate = () => {};
    let xScale = scaleLinear();

    const offsetScale = scaleBand();
    const grouped = () => {};

    const computeGroupWidth = (data) => {
        if (!data.length) {
            return 0;
        }
        const seriesData = data[0];
        const crossValue = series.crossValue();
        const x = (d, i) => xScale(crossValue(d, i));
        const width = groupWidth(seriesData.map(x));
        return width;
    };

    grouped.configureOffsetScale = (data) => {
        const groupWidth = computeGroupWidth(data);

        const halfWidth = groupWidth / 2;
        offsetScale.domain(range(0, data.length))
          .range([-halfWidth, halfWidth]);

        if (series.barWidth) {
            series.barWidth(offsetScale.bandwidth());
        }
    };

    grouped.offsetScale = () => offsetScale;

    grouped.groupWidth = (...args) => {
        if (!args.length) {
            return groupWidth;
        }
        groupWidth = functor(args[0]);
        return grouped;
    };
    grouped.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return grouped;
    };
    grouped.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return grouped;
    };

    rebindAll(grouped, offsetScale, includeMap({'paddingInner': 'subPadding'}));

    return grouped;
};
