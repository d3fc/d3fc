import { scaleLinear } from 'd3-scale';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import groupedBase from '../groupedBase';

export default function(series) {

    const base = groupedBase(series);

    const grouped = (data) => {
        data.forEach((seriesData, index) => {

            // create a composite scale that applies the required offset
            const compositeScale = (d, i) => {
                const offset = base.offsetScaleForDatum(data, d, i);
                return base.xScale()(d) +
                  offset(index) +
                  offset.bandwidth() / 2;
            };
            series.xScale(compositeScale);

            // if the sub-series has a bandwidth, set this from the offset scale
            if (series.bandwidth) {
                series.bandwidth(
                  (d, i) => base.offsetScaleForDatum(data, d, i)
                                .bandwidth()
                );
            }

            // adapt the decorate function to give each series the correct index
            series.decorate((c, d) => base.decorate()(c, d, index));
            series(seriesData);
        });
    };

    rebindAll(grouped, series, exclude('decorate', 'xScale'));
    rebindAll(grouped, base, exclude('configureOffsetScale', 'configureOffset'));

    return grouped;
}
