import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import multiSeries from './multi';
import line from './line';

export default () => {

    let orient = 'vertical';
    let series = () => line();
    const multi = multiSeries();
    let seriesCache = [];

    const repeat = (data) => {
        if (orient === 'vertical') {
            const previousSeriesCache = seriesCache;
            seriesCache = data[0].map((d, i) => i < previousSeriesCache.length ? previousSeriesCache[i] : series());
            multi.series(seriesCache)
              .mapping((data, index) => data.map(d => d[index]));
        } else {
            const previousSeriesCache = seriesCache;
            seriesCache = data.map((d, i) => i < previousSeriesCache.length ? previousSeriesCache[i] : series());
            multi.series(seriesCache)
              .mapping((data, index) => data[index]);
        }
        multi(data);
    };

    repeat.series = (...args) => {
        if (!args.length) {
            return series;
        }
        if (typeof args[0].xScale === 'function' && typeof args[0].yScale === 'function') {
            series = () => args[0];
        } else {
            series = args[0];
        }
        seriesCache = [];
        return repeat;
    };

    repeat.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        seriesCache = [];
        return repeat;
    };

    rebindAll(repeat, multi, exclude('series', 'mapping'));

    return repeat;
};
