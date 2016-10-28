import { scaleLinear } from 'd3-scale';
import { rebindAll, exclude } from 'd3fc-rebind';
import groupedBase from '../groupedBase';

export default function(series) {

    const base = groupedBase(series);

    const grouped = (data) => {
        base.configureOffsetScale(data);

        data.forEach((seriesData, index) => {

            // create a composite scale that applies the required offset
            const compositeScale = x => base.xScale()(x) +
                base.offsetScale()(index) +
                base.offsetScale().bandwidth() / 2;
            series.xScale(compositeScale);

            // adapt the decorate function to give each series the correct index
            series.decorate((c, d) => base.decorate()(c, d, index));
            series(seriesData);
        });
    };

    rebindAll(grouped, series, exclude('decorate', 'xScale'));
    rebindAll(grouped, base, exclude('configureOffsetScale', 'configureOffset'));

    return grouped;
}
