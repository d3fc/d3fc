(function(d3, fc) {
    'use strict';

    fc.tools.measure = function() {

        var event = d3.dispatch('measuresource', 'measuretarget', 'measureclear');

        var measure = function(selection) {

            selection.each(function() {
                var data = this.__data__ || [];
                if (!data.__measure__) {
                    data.__measure__ = {};
                    this.__data__ = data;
                }
            });

            selection.each(function(data) {

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.measure', mouseenter);

                if (!data.__measure__.overlay) {
                    container.append('rect')
                        .style('visibility', 'hidden');
                    data.__measure__.overlay = true;
                }

                container.select('rect')
                    .attr('x', measure.xScale.value.range()[0])
                    .attr('y', measure.yScale.value.range()[1])
                    .attr('width', measure.xScale.value.range()[1])
                    .attr('height', measure.yScale.value.range()[0]);

                var g = fc.utilities.simpleDataJoin(container, 'measure', data);

                var enter = g.enter();
                enter.append('line')
                    .attr('class', 'tangent');
                enter.append('line')
                    .attr('class', 'horizontal');
                enter.append('line')
                    .attr('class', 'vertical');
                enter.append('text')
                    .attr('class', 'horizontal');
                enter.append('text')
                    .attr('class', 'vertical');

                g.select('line.tangent')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

                g.select('line.horizontal')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.source.y; })
                    .style('visibility', function(d) { return d.state !== 'MEASURED' ? 'hidden' : 'visible'; });

                g.select('line.vertical')
                    .attr('x1', function(d) { return d.target.x; })
                    .attr('y1', function(d) { return d.target.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.source.y; })
                    .style('visibility', function(d) { return d.state !== 'MEASURED' ? 'hidden' : 'visible'; });

                var paddingValue = measure.padding.value.apply(this, arguments);

                g.select('text.horizontal')
                    .attr('x', function(d) { return d.source.x + (d.target.x - d.source.x) / 2; })
                    .attr('y', function(d) { return d.source.y - paddingValue; })
                    .style('visibility', function(d) { return d.state !== 'MEASURED' ? 'hidden' : 'visible'; })
                    .text(measure.xLabel.value);

                g.select('text.vertical')
                    .attr('x', function(d) { return d.target.x + paddingValue; })
                    .attr('y', function(d) { return d.source.y + (d.target.y - d.source.y) / 2; })
                    .style('visibility', function(d) { return d.state !== 'MEASURED' ? 'hidden' : 'visible'; })
                    .text(measure.yLabel.value);

                measure.decorate.value(g);
            });
        };

        function updatePositions() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            if (datum.state !== 'MEASURED') {
                var mouse = d3.mouse(this);
                var snapped = measure.snap.value.apply(this, mouse);
                if (datum.state === 'SELECT_SOURCE') {
                    datum.source = datum.target = snapped;
                } else if (datum.state === 'SELECT_TARGET') {
                    datum.target = snapped;
                } else {
                    throw new Error('Unknown state ' + datum.state);
                }
            }
        }

        function mouseenter() {
            var container = d3.select(this)
                .on('click.measure', mouseclick)
                .on('mousemove.measure', mousemove)
                .on('mouseleave.measure', mouseleave);
            var data = container.datum();
            if (data[0] == null) {
                data.push({
                    state: 'SELECT_SOURCE'
                });
            }
            updatePositions.call(this);
            container.call(measure);
        }

        function mousemove() {
            var container = d3.select(this);
            updatePositions.call(this);
            container.call(measure);
        }

        function mouseleave() {
            var container = d3.select(this);
            var data = container.datum();
            if (data[0] != null && data[0].state === 'SELECT_SOURCE') {
                data.pop();
            }
            container.on('click.measure', null)
                .on('mousemove.measure', null)
                .on('mouseleave.measure', null);
        }

        function mouseclick() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            switch (datum.state) {
                case 'SELECT_SOURCE':
                    updatePositions.call(this);
                    event.measuresource.apply(this, arguments);
                    datum.state = 'SELECT_TARGET';
                    break;
                case 'SELECT_TARGET':
                    updatePositions.call(this);
                    event.measuretarget.apply(this, arguments);
                    datum.state = 'MEASURED';
                    break;
                case 'MEASURED':
                    event.measureclear.apply(this, arguments);
                    datum.state = 'SELECT_SOURCE';
                    updatePositions.call(this);
                    break;
                default:
                    throw new Error('Unknown state ' + datum.state);
            }
            container.call(measure);
        }

        measure.xScale = fc.utilities.property(d3.time.scale());
        measure.yScale = fc.utilities.property(d3.scale.linear());
        measure.snap = fc.utilities.property(function(x, y) { return {x: x, y: y}; });
        measure.decorate = fc.utilities.property(fc.utilities.fn.noop);
        measure.xLabel = fc.utilities.functorProperty('');
        measure.yLabel = fc.utilities.functorProperty('');
        measure.padding = fc.utilities.functorProperty(2);

        d3.rebind(measure, event, 'on');

        return measure;
    };

}(d3, fc));