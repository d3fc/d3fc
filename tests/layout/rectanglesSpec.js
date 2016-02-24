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

    it('should allow the use of a domain coordinate system', function() {
        var svg = document.createElement('svg');

        var xScale = d3.scale.linear()
            .range([0, 1000])
            .domain([0, 100]);

        var yScale = d3.scale.linear()
            .range([0, 1000])
            .domain([0, 100]);

        var rectangles = fc.layout.rectangles(fc.layout.strategy.local())
            .xScale(xScale)
            .yScale(yScale)
            .coords('domain')
            .size([elementWidth, elementHeight])
            .position(function(d) { return [d.x, d.y]; });

        d3.select(svg)
            .datum(data)
            .call(rectangles);

        // the addition of scales that apply a x10 scaling to the location of each item means
        // that they do not have to be moved in order to avoid collisions
        expect(svg.children[0].getAttribute('transform')).toEqual('translate(500, 500)');
        expect(svg.children[1].getAttribute('transform')).toEqual('translate(450, 500)');
    });

});
