import { dispatch } from 'd3-dispatch';
import { pointer } from 'd3-selection';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const pointEvent = dispatch('point');

    function mousemove(event) {
        const point = pointer(event);
        pointEvent.call('point', this, [{ x: point[0], y: point[1] }]);
    }

    function mouseleave() {
        void pointEvent.call('point', this, []);
    }

    const instance = (selection) => {
        selection
            .on('mouseenter.pointer', mousemove)
            .on('mousemove.pointer', mousemove)
            .on('mouseleave.pointer', mouseleave);
    };

    rebind(instance, pointEvent, 'on');

    return instance;
};
