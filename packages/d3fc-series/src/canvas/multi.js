import {rebindAll} from 'd3fc-rebind';
import multiBase from '../multiBase';

export default () => {

    let context = null;
    const base = multiBase();

    const multi = (data) => {
        const mapping = base.mapping();
        const series = base.series();
        const xScale = base.xScale();
        const yScale = base.yScale();

        series.forEach((dataSeries, index) => {
            const seriesData = mapping(data, dataSeries, index);
            dataSeries.context(context)
                .xScale(xScale)
                .yScale(yScale);
            dataSeries(seriesData);
        });
    };

    multi.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return multi;
    };

    rebindAll(multi, base);

    return multi;
};
