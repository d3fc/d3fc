describe('gridlines', function() {

    var element;

    beforeEach(function() {
        element = document.createElement('svg');
    });

    function elementsWithClass(elements, classname) {
        var elementsArray = Array.prototype.slice.call(elements, 0);
        return elementsArray.filter(function(e) {
            return e.classList.contains(classname);
        });
    }

    it('should have an x and y line for each tick of a linear scale', function() {
        var xScale = d3.scale.linear();
        var yScale = d3.scale.linear();

        var xTicks = 10, yTicks = 100;

        var gridline = fc.annotation.gridline()
            .xScale(xScale)
            .yScale(yScale)
            .xTicks(xTicks)
            .yTicks(yTicks);

        d3.select(element)
            .datum([{}])
            .call(gridline);

        var xLines = elementsWithClass(element.children, 'x');
        expect(xLines.length).toEqual(xScale.ticks(xTicks).length);

        var yLines = elementsWithClass(element.children, 'y');
        expect(yLines.length).toEqual(yScale.ticks(yTicks).length);
    });

    it('should utilise the domain for ordinal axes', function() {
        var xScale = d3.scale.ordinal().domain(['1', '2', '3']);
        var yScale = d3.scale.linear();

        var gridline = fc.annotation.gridline()
            .xScale(xScale)
            .yScale(yScale);

        d3.select(element)
            .datum([{}])
            .call(gridline);

        var xLines = elementsWithClass(element.children, 'x');
        expect(xLines.length).toEqual(3);
    });
});
