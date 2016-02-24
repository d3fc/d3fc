describe('fc.layout.rectanges', function() {

    var containerWidth = 100,
        containerHeight = 100;
    var elementWidth = 10,
        elementHeight = 10;

    var data = [
        {x: 50, y: 50},
        {x: 45, y: 50}
    ];

    it('should function without scales', function() {
        var svg = document.createElement('svg');

        var rectangles = fc.layout.rectangles(fc.layout.strategy.local())
            .size([elementWidth, elementHeight])
            .position(function(d) { return [d.x, d.y]; });

        d3.select(svg)
            .datum(data)
            .call(rectangles);

        // ensure that the first rectangle has been moved to avoid collision
        expect(svg.children[0].getAttribute('transform')).toEqual('translate(40, 40)');
        expect(svg.children[1].getAttribute('transform')).toEqual('translate(45, 50)');
    });

});
