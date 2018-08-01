import { dispatch } from 'd3-dispatch';
import { mouse } from 'd3-selection';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const event = dispatch('point');

    function mousemove() {
        const point = mouse(this);
        event.call('point', this, [{ x: point[0], y: point[1] }]);
    }

    function mouseleave() {
        void event.call('point', this, []);
    }

    const instance = (selection) => {
        selection
            .on('mouseenter.pointer', mousemove)
            .on('mousemove.pointer', mousemove)
            .on('mouseleave.pointer', mouseleave);
    };

    rebind(instance, event, 'on');

    return instance;
};
