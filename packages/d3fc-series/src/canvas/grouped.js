import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import groupedBase from '../groupedBase';

export default function(series) {

    const base = groupedBase(series);

    const grouped = (data) => {
        data.forEach((seriesData, index) => {

            // create a composite scale that applies the required offset
            const isVertical = series.orient() !== 'horizontal';
            const compositeScale = (d, i) => {
                const offset = base.offsetScaleForDatum(data, d, i);
                const baseScale = isVertical ? base.xScale() : base.yScale();
                return baseScale(d) +
                  offset(index) +
                  offset.bandwidth() / 2;
            };

            if (isVertical) {
                series.xScale(compositeScale);
                series.yScale(base.yScale());
            } else {
                series.yScale(compositeScale);
                series.xScale(base.xScale());
            }

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

    rebindAll(grouped, series, exclude('decorate', 'xScale', 'yScale'));
    rebindAll(grouped, base, exclude('offsetScaleForDatum'));

    return grouped;
}
