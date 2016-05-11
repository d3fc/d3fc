/* global d3 fc_label_layout */

var labelPadding = 4;
var label = fc_label_layout.textLabel()
    .padding(labelPadding)
    .value(function(d) { return d.data; });

var width = 700;
var height = 350;
var itemWidth = 60;
var itemHeight = 20;
var strategy = strategyInterceptor(fc_label_layout.annealing());
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
        interceptor.overlap = d3.sum(visibleLabels.map(function(label, index) {
            return d3.sum(visibleLabels.filter(function(_, i) { return i !== index; })
                .map(function(d) {
                    return fc_label_layout.intersect(d, label);
                }));
        }));
        return finalLayout;
    };
    d3.rebind(interceptor, strategy, 'bounds');
    return interceptor;
}

function generateData() {
    var dataCount = document.getElementById('label-count').value;
    data = d3.range(0, dataCount)
        .map(function(d, i) {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                data: 'node-' + i
            };
        });
}

var svg = d3.select('svg')
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

    var labels = fc_label_layout.label(strategy)
        .size(function() {
            var textSize = d3.select(this)
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

d3.select('#strategy-selector')
    .on('change', function() {
        var strategyName = getStrategyName();
        d3.selectAll('.annealing-field')
            .attr('style', 'display:' + (strategyName === 'annealing' ? 'visible' : 'none'));
    });

d3.select('#strategy-form .btn')
    .on('click', function() {
        d3.event.preventDefault();
        var strategyName = getStrategyName();
        strategy = function(d) { return d; };
        if (strategyName !== 'none') {
            strategy = fc_label_layout[strategyName]();
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
            strategy = fc_label_layout.removeOverlaps(strategy);
        }
        strategy = strategyInterceptor(strategy);
        render();
    });

d3.select('#labels-form .btn')
    .on('click', function() {
        d3.event.preventDefault();
        generateData();
        render();
    });

generateData();
setTimeout(render, 100);
