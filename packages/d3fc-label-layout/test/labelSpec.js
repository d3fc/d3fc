import { select } from 'd3-selection';
import label from '../src/label';
import removeOverlaps from '../src/removeOverlaps';

describe('label', () => {

    it('should remove collisions', () => {
        var svg = document.createElement('svg');

        var labels = label(removeOverlaps())
            .size([10, 10])
            .position((d) => [d.x, d.y]);

        var data = [
            {x: 45, y: 50},
            // this rectangle overlaps both its neighbours, and is the optimum candidate for removal
            // in that once it is removed, neither of the remaining rectangles overlap.
            {x: 50, y: 50},
            {x: 55, y: 50}
        ];

        select(svg)
            .datum(data)
            .call(labels);

        expect(svg.children).toHaveLength(3);
        expect(svg.children[0].getAttribute('style')).toEqual('display:inherit');
        expect(svg.children[1].getAttribute('style')).toEqual('display:none');
        expect(svg.children[2].getAttribute('style')).toEqual('display:inherit');
    });

});
