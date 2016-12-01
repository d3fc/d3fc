import { dispatch } from 'd3-dispatch';
import { mouse } from 'd3-selection';
import { rebind } from 'd3fc-rebind';

export default () => {
    const event = dispatch('point');

    function mousemove() {
        const point = mouse(this);
        event.point([{ x: point[0], y: point[1] }]);
    }

    const instance = (selection) => {
        selection
            .on('mouseenter.pointer', mousemove)
            .on('mousemove.pointer', mousemove)
            .on('mouseleave.pointer', () => void event.point([]));
    };

    rebind(instance, event, 'on');

    return instance;
};
