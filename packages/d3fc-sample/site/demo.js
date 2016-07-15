var d3 = require('d3');
var topojson = require('topojson');
var sample = require('../build/d3fc-sample');

var width = 700;
var height = 350;
var strategy = strategyInterceptor(sample.modeMedian().value(function(d) { return d.y; }));
var data = [];
var ukData = [];

d3.json('uk.json', function(error, uk) {
    if (error) throw error;
    var mesh = topojson.mesh(uk);
    ukData = mesh.coordinates[62].map(function(d) {
        return {
            x: d[0],
            y: d[1]
        };
    });
});

// we intercept the strategy in order to capture the final layout and compute statistics
function strategyInterceptor(strategy) {
    var interceptor = function(layout) {
        var start = new Date().getMilliseconds();
        var finalLayout = strategy(data);
        var time = new Date().getMilliseconds() - start;

        // record some statistics on this strategy
        if (!interceptor.time) {
            Object.defineProperty(interceptor, 'time', { enumerable: false, writable: true });
        }
        interceptor.time = time;
        return finalLayout;
    };

    interceptor.bucketSize = function() {
        return strategy.bucketSize.apply(this, arguments);
    };

    return interceptor;
}

function setMap() {
    data = ukData;
}

function generateData(generator) {
    var dataCount = document.getElementById('data-count').value;
    data = d3.range(0, dataCount)
        .map(generator)
        .sort(function(a, b) {
            return a.x - b.x;
        });
}

function circleGenerator() {
    var dataCount = document.getElementById('data-count').value;
    return function(d, i) {
        var x = i / dataCount * width;
        var y = Math.sqrt(height * height - Math.pow(x - height, 2));
        return {
            x: x,
            y: y + Math.random() * 50 - 25
        };
    };
}

function chartGenerator() {
    var lastData = { x: 0, y: height / 2 };
    return function() {
        var nextData = {
            x: lastData.x + Math.random() * 10 - 4,
            y: lastData.y + Math.random() * 20 - 10
        };
        lastData = nextData;
        return nextData;
    };
}

var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

function render() {
    svg.selectAll('g').remove();

    var xExtent = d3.extent(data, function(d) { return d.x; });
    var xScale = d3.scaleLinear()
        .domain(xExtent)
        .range([0, width]);

    var yExtent = d3.extent(data, function(d) { return d.y; });
    var yScale = d3.scaleLinear()
        .domain(yExtent)
        .range([height, 0]);

    var path = d3.line()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); });

    svg.append('g')
        .selectAll('path')
        .data([data, strategy(data)])
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', function(d, i) {
            return i === 0 ? 'raw' : 'subsampled';
        });

    var statsElement = document.getElementById('statistics');
    statsElement.innerHTML = '<b>Execution Time:</b> ' + strategy.time + 'ms';
}

function getStrategyName() {
    var selector = document.getElementById('strategy-selector');
    return selector.options[selector.selectedIndex].value;
}

function getBucketSize() {
    var element = document.getElementById('bucket-size');
    return Number(element.value);
}

function updateBucketInfo() {
    var element = document.getElementById('bucket-size-text');
    element.innerHTML = getBucketSize();

    document.getElementById('bucket-size').max = document.getElementById('data-count').value / 10;
}

d3.select('#strategy-selector')
    .on('change', function() {
        d3.event.preventDefault();
        var strategyName = getStrategyName();
        strategy = function(d) { return d; };
        if (strategyName !== 'none') {
            strategy = sample[strategyName]()
                .bucketSize(getBucketSize());

            if (strategyName !== 'modeMedian') {
                strategy.x(function(d) { return d.x; })
                    .y(function(d) { return d.y; });
            } else {
                strategy.value(function(d) { return d.y; });
            }
        }
        strategy = strategyInterceptor(strategy);
        render();
    });

function sliderChange() {
    var bucketSize = getBucketSize();
    strategy.bucketSize(bucketSize);
    updateBucketInfo();
    render();
}

d3.select('#bucket-size')
    .on('change', sliderChange)
    .on('mousemove', function() {
        if (d3.event.buttons === 1) {
            sliderChange();
        }
    });

d3.selectAll('#data-form .btn')
    .on('click', function() {
        d3.event.preventDefault();
        var name = d3.event.target.name;
        if (name === 'chart') {
            generateData(chartGenerator());
        } else if (name === 'circle') {
            generateData(circleGenerator());
        } else {
            setMap();
        }
        render();
        updateBucketInfo();
    });

generateData(chartGenerator());
setTimeout(render, 100);
