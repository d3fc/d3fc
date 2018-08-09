import heatmapBase from '../heatmapBase';
import { rebindAll, rebind } from '@d3fc/d3fc-rebind';

export default () => {

    let context = null;
    const base = heatmapBase();

    const heatmap = (data) => {
        const filteredData = data.filter(base.defined());
        const colorValue = base.colorValue();
        const colorInterpolate = base.colorInterpolate();
        const colorScale = base.colorScale(filteredData);
        const context = base.pathGenerator.context();

        filteredData.forEach((d, i) => {
            context.save();
            context.beginPath();

            const values = base.values(d, i);
            context.translate(values.x, values.y);

            context.fillStyle = colorInterpolate(colorScale(values.colorValue));

            base.pathGenerator.height(values.height)
                .width(values.width)([d]);

            base.decorate()(context, d, i);

            context.fill();
            context.closePath();
            context.restore();
        });
    };

    rebind(heatmap, base.pathGenerator, 'context');
    rebindAll(heatmap, base);

    return heatmap;
};
