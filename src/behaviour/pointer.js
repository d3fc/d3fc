import d3 from 'd3';

export default function() {

    var event = d3.dispatch('point');

    function mousemove() {
        const point = d3.mouse(this);
        event.point([{ x: point[0], y: point[1] }]);
    }

    var instance = function(selection) {

        selection.on('mouseenter.pointer', mousemove)
                .on('mousemove.pointer', mousemove)
                .on('mouseleave.pointer', function() {
                    event.point([]);
                });
    };
    d3.rebind(instance, event, 'on');

    return instance;
}
