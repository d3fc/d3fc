import { range, sum } from 'd3-array';
import { rebind } from 'd3fc-rebind';
import { select, selectAll } from 'd3-selection';
import * as d3 from 'd3-selection';
import { label as labelLayout, textLabel, annealing, intersect } from '..';
import * as fc from '..';

var labelPadding = 4;
var label = textLabel()
    .padding(labelPadding)
    .value(function(d) { return d.data; });

var width = 700;
var height = 350;
var itemWidth = 60;
var itemHeight = 20;
var strategy = strategyInterceptor(annealing());
var data = [];

// we intercept the strategy in order to capture the final layout and compute statistics
function strategyInterceptor(strategy) {
    var interceptor = function(layout) {
        var start = new Date().getMilliseconds();
        var finalLayout = strategy(layout);
        var time = new Date().getMilliseconds() - start;

        // record some statistics on this strategy
        if (!interceptor.time) {
            Object.defineProperty(interceptor, 'time', { enumerable: false, writable: true });
            Object.defineProperty(interceptor, 'hidden', { enumerable: false, writable: true });
            Object.defineProperty(interceptor, 'overlap', { enumerable: false, writable: true });
        }
        var visibleLabels = finalLayout.filter(function(d) { return !d.hidden; });
        interceptor.time = time;
        interceptor.hidden = finalLayout.length - visibleLabels.length;
        interceptor.overlap = sum(visibleLabels.map(function(label, index) {
            return sum(visibleLabels.filter(function(_, i) { return i !== index; })
                .map(function(d) {
                    return intersect(d, label);
                }));
        }));
        return finalLayout;
    };
    rebind(interceptor, strategy, 'bounds');
    return interceptor;
}

function generateData() {
    var dataCount = document.getElementById('label-count').value;
    data = range(0, dataCount)
        .map(function(d, i) {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                data: 'node-' + i
            };
        });
}

var svg = select('svg')
    .attr('width', width)
    .attr('height', height);

function render() {
    svg.selectAll('g').remove();

    svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr({
            r: 2,
            cx: function(d) { return d.x; },
            cy: function(d) { return d.y; }
        });

    var labels = labelLayout(strategy)
        .size(function() {
            var textSize = select(this)
              .select('text')
              .node()
              .getBBox();
            return [textSize.width + labelPadding * 2, textSize.height + labelPadding * 2];
        })
        .component(label);

    svg.append('g')
        .datum(data)
        .call(labels);

    var statsElement = document.getElementById('statistics');
    statsElement.innerHTML = '<b>Execution Time:</b> ' + strategy.time + 'ms, ' +
        '<b>Hidden Labels:</b> ' + strategy.hidden + ', ' +
        '<b>Overlap Area:</b> ' + strategy.overlap.toFixed(2);
}

function getStrategyName() {
    var selector = document.getElementById('strategy-selector');
    return selector.options[selector.selectedIndex].value;
}

select('#strategy-selector')
    .on('change', function() {
        var strategyName = getStrategyName();
        selectAll('.annealing-field')
            .attr('style', 'display:' + (strategyName === 'annealing' ? 'visible' : 'none'));
    });

select('#strategy-form .btn')
    .on('click', function() {
        d3.event.preventDefault();
        var strategyName = getStrategyName();
        strategy = function(d) { return d; };
        if (strategyName !== 'none') {
            strategy = fc[strategyName]();
        }
        if (strategyName === 'annealing') {
            strategy.temperature(document.getElementById('temperature').value);
            strategy.cooling(document.getElementById('cooling').value);
        }
        var enforceBounds = document.getElementById('enforce-bounds').checked;
        if (enforceBounds) {
            strategy.bounds([width, height]);
        }
        var removeOverlaps = document.getElementById('remove-overlaps').checked;
        if (removeOverlaps) {
            strategy = fc.removeOverlaps(strategy);
        }
        strategy = strategyInterceptor(strategy);
        render();
    });

select('#labels-form .btn')
    .on('click', function() {
        d3.event.preventDefault();
        generateData();
        render();
    });

generateData();
setTimeout(render, 100);
