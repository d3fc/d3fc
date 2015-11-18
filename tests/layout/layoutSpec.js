describe('layout', function() {

    it('should allow attributes to be set as name / value pairs', function() {
        var svg = document.createElement('svg');

        d3.select(svg).layout('height', 30);
        expect(svg.getAttribute('layout-style')).toEqual('height:30');

        d3.select(svg).layout('flexDirection', 'row');
        expect(svg.getAttribute('layout-style')).toEqual('flexDirection:row');
    });

    it('should allow attributes to be set as an object', function() {
        var svg = document.createElement('svg');
        d3.select(svg).layout({'height': 30, 'flexDirection': 'row'});
        expect(svg.getAttribute('layout-style')).toEqual('height:30;flexDirection:row');
    });

    it('should modify already set attributes when given an object', function() {
        var svg = document.createElement('svg');
        d3.select(svg).layout({'height': 30, 'flexDirection': 'row'});
        expect(svg.getAttribute('layout-style')).toEqual('height:30;flexDirection:row');
        d3.select(svg).layout({'height': 100, 'width': 90});
        expect(svg.getAttribute('layout-style')).toEqual('height:100;flexDirection:row;width:90');
    });

    it('should provide access to layout- prefixed properties', function() {
        var svg = document.createElement('svg');
        svg.setAttribute('layout-width', '30');
        expect(d3.select(svg).layout('width')).toEqual(30);
    });

    it('should permit layout with an explicit width / height', function() {
        var div = document.createElement('div');
        var svgElement = document.createElement('svg');
        div.appendChild(svgElement);
        document.body.appendChild(div);

        var svg = d3.select(svgElement)
            .layout('justifyContent', 'flex-end');

        var row1 = svg.append('g')
            .layout('flex', 1);

        var row2 = svg.append('g')
            .layout('flex', 2);

        svg.layout(800, 300);

        expect(row1.layout('height')).toEqual(100);
        expect(row2.layout('height')).toEqual(200);
    });

    it('should set the width and height attributes of the svg element', function() {
        var div = document.createElement('div');
        var svgElement = document.createElement('svg');
        div.appendChild(svgElement);
        document.body.appendChild(div);

        var svg = d3.select(svgElement);

        svg.layout(800, 300);

        expect(svgElement.getAttribute('width')).toEqual('800');
        expect(svgElement.getAttribute('height')).toEqual('300');
    });

    it('should set the width / height of rect elements', function() {
        var div = document.createElement('div');
        var svgElement = document.createElement('svg');
        div.appendChild(svgElement);
        document.body.appendChild(div);

        var svg = d3.select(svgElement)
            .layout('justifyContent', 'flex-end');

        var rect = svg.append('rect')
            .layout('flex', 1);

        svg.layout(800, 300);

        expect(rect.node().getAttribute('width')).toEqual('800');
        expect(rect.node().getAttribute('height')).toEqual('300');
    });

    it('should should perform layout on selections containing multiple elements', function() {
        var div = document.createElement('div');
        var svgElement1 = document.createElement('svg');
        var svgElement2 = document.createElement('svg');
        div.appendChild(svgElement1);
        div.appendChild(svgElement2);
        document.body.appendChild(div);

        var svg = d3.select(div).selectAll('svg')
            .layout('justifyContent', 'flex-end');

        var rects = svg.append('rect')
            .layout('flex', 1);

        svg.layout(800, 300);

        expect(rects[0][0].getAttribute('width')).toEqual('800');
        expect(rects[0][0].getAttribute('height')).toEqual('300');
        expect(rects[0][1].getAttribute('width')).toEqual('800');
        expect(rects[0][1].getAttribute('height')).toEqual('300');
    });

    it('should should perform layout on enter selections', function() {
        var div = document.createElement('div');
        document.body.appendChild(div);

        var svgs = d3.select(div).selectAll('svg')
            .data([1, 2]);

        svgs.enter()
            .append('svg')
            .layout('justifyContent', 'flex-end')
            .append('rect')
            .layout('flex', 1);

        svgs.layout(800, 300);

        var rects = d3.select(div).selectAll('rect');

        expect(rects[0][0].getAttribute('width')).toEqual('800');
        expect(rects[0][0].getAttribute('height')).toEqual('300');
        expect(rects[0][1].getAttribute('width')).toEqual('800');
        expect(rects[0][1].getAttribute('height')).toEqual('300');
    });

    it('should not blow up on width / height accessors on enter', function() {
        var div = document.createElement('div');
        document.body.appendChild(div);

        var svgs = d3.select(div).selectAll('svg')
            .data([1, 2]);

        svgs.enter().append('g').layout('width');
    });


    it('should not measure using innerDimensions if layout-width/height are set', function() {
        var svg = document.createElement('svg');

        var g = document.createElement('g');
        g.setAttribute('layout-style', 'flex: 1');
        svg.appendChild(g);

        expect(Number(g.getAttribute('layout-width'))).toEqual(0);
        expect(Number(g.getAttribute('layout-height'))).toEqual(0);

        d3.select(g)
            .layout();

        d3.select(svg)
            .layout(100, 100);

        expect(Number(g.getAttribute('layout-width'))).toEqual(100);
        expect(Number(g.getAttribute('layout-height'))).toEqual(100);

        d3.select(g)
            .layout();

        expect(Number(g.getAttribute('layout-width'))).toEqual(100);
        expect(Number(g.getAttribute('layout-height'))).toEqual(100);
    });

    it('should not set layout-width/height attributes on root node', function() {
        var svg = document.createElement('svg');
        d3.select(svg)
            .layout();
        expect(svg.hasAttribute('layout-width')).toBe(false);
        expect(svg.hasAttribute('layout-height')).toBe(false);
    });

    it('should not re-position nodes within a nested layout', function() {
        var svg = document.createElement('svg');

        var g1 = document.createElement('g');
        g1.setAttribute('layout-style', 'flex: 1');
        svg.appendChild(g1);

        var g2 = document.createElement('g');
        g2.setAttribute('layout-style', 'flex: 1');
        svg.appendChild(g2);

        d3.select(svg)
            .layout(100, 100);

        expect(Number(g1.getAttribute('layout-x'))).toEqual(0);
        expect(Number(g1.getAttribute('layout-y'))).toEqual(0);
        expect(Number(g2.getAttribute('layout-x'))).toEqual(0);
        expect(Number(g2.getAttribute('layout-y'))).toEqual(50);

        d3.select(g2)
            .layout();

        expect(Number(g2.getAttribute('layout-x'))).toEqual(0);
        expect(Number(g2.getAttribute('layout-y'))).toEqual(50);
    });

});
