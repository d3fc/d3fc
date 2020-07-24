import {rebindAll} from '@d3fc/d3fc-rebind';
import multiBase from '../multiBase';

export default () => {

    let context = null;
    let pixelRatio = 1;
    const base = multiBase();

    const multi = (data) => {
        const mapping = base.mapping();
        const series = base.series();
        const xScale = base.xScale();
        const yScale = base.yScale();

        series.forEach((dataSeries, index) => {
            const seriesData = mapping(data, index, series);
            dataSeries.context(context)
                .pixelRatio(pixelRatio)
                .xScale(xScale)
                .yScale(yScale);

            let adaptedDecorate;
            if (dataSeries.decorate) {
                adaptedDecorate = dataSeries.decorate();
                dataSeries.decorate((c, d, i) => {
                    base.decorate()(c, data, index);
                    adaptedDecorate(c, d, i);
                });
            } else {
                base.decorate()(context, data, index);
            }

            dataSeries(seriesData);

            if (adaptedDecorate) {
                dataSeries.decorate(adaptedDecorate);
            }
        });
    };

    multi.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return multi;
    };

    multi.pixelRatio = (...args) => {
        if (!args.length) {
            return pixelRatio;
        }
        pixelRatio = args[0];
        return multi;
    };

    rebindAll(multi, base);

    return multi;
};
