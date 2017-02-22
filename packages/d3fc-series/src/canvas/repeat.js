import {rebindAll, exclude} from 'd3fc-rebind';
import multiSeries from './multi';
import line from './line';

export default () => {

    let orient = 'vertical';
    let series = line();
    const multi = multiSeries();

    const repeat = (data) => {
        if (orient === 'vertical') {
            multi.series(data[0].map(_ => series))
              .mapping((data, index) => data.map(d => d[index]));
        } else {
            multi.series(data.map(_ => series))
              .mapping((data, index) => data[index]);
        }
        multi(data);
    };

    repeat.series = (...args) => {
        if (!args.length) {
            return series;
        }
        series = args[0];
        return repeat;
    };

    repeat.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return repeat;
    };

    rebindAll(repeat, multi, exclude('series', 'mapping'));

    return repeat;
};
