import heatmapBase from '../heatmapBase';
import { rebindAll, rebind } from '@d3fc/d3fc-rebind';

export default () => {

    const base = heatmapBase();

    const heatmap = (data) => {
        const filteredData = data.filter(base.defined());
        const colorInterpolate = base.colorInterpolate();
        const colorScale = base.colorScale(filteredData);
        const context = base.pathGenerator.context();

        filteredData.forEach((d, i) => {
            context.save();
            context.beginPath();

            const values = base.values(d, i);
            context.translate(values.x, values.y);

            context.fillStyle = colorInterpolate(colorScale(values.colorValue));
            context.strokeStyle = 'transparent';

            base.decorate()(context, d, i);

            base.pathGenerator.height(values.height)
                .width(values.width)([d]);

            context.fill();
            context.stroke();
            context.closePath();
            context.restore();
        });
    };

    rebind(heatmap, base.pathGenerator, 'context');
    rebindAll(heatmap, base);

    return heatmap;
};
