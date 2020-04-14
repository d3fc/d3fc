const width = 700;
const height = 350;
let strategy = strategyInterceptor(fc.modeMedian().value(d => d.y));
let data = [];

// we intercept the strategy in order to compute statistics
function strategyInterceptor(strategy) {
    const interceptor = () => {
        const start = new Date().getMilliseconds();
        const finalLayout = strategy(data);
        const time = new Date().getMilliseconds() - start;

        // record some statistics on this strategy
        if (!interceptor.time) {
            Object.defineProperty(interceptor, 'time', {
                enumerable: false,
                writable: true
            });
        }
        interceptor.time = time;
        return finalLayout;
    };

    fc.rebind(interceptor, strategy, 'bucketSize');

    return interceptor;
}

function generateData(generator) {
    const dataCount = document.getElementById('data-count').value;
    data = d3
        .range(0, dataCount)
        .map(generator)
        .sort((a, b) => a.x - b.x);
}

function circleGenerator() {
    const dataCount = document.getElementById('data-count').value;
    return (d, i) => {
        const x = (i / dataCount) * width;
        const y = Math.sqrt(height * height - Math.pow(x - height, 2));
        return {
            x: x,
            y: y + Math.random() * 50 - 25
        };
    };
}

function chartGenerator() {
    let lastData = { x: 0, y: height / 2 };
    return function() {
        const nextData = {
            x: lastData.x + Math.random() * 10 - 4,
            y: lastData.y + Math.random() * 20 - 10
        };
        lastData = nextData;
        return nextData;
    };
}

const svg = d3
    .select('svg')
    .attr('width', width)
    .attr('height', height);

function render() {
    svg.selectAll('g').remove();

    const xExtent = d3.extent(data, d => d.x);
    const xScale = d3
        .scaleLinear()
        .domain(xExtent)
        .range([0, width]);

    const yExtent = d3.extent(data, d => d.y);
    const yScale = d3
        .scaleLinear()
        .domain(yExtent)
        .range([height, 0]);

    const path = d3
        .line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

    svg.append('g')
        .selectAll('path')
        .data([data, strategy(data)])
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', (d, i) => (i === 0 ? 'raw' : 'subsampled'));

    const statsElement = document.getElementById('statistics');
    statsElement.innerHTML = '<b>Execution Time:</b> ' + strategy.time + 'ms';
}

function getStrategy() {
    const selector = document.getElementById('strategy-selector');
    switch (selector.options[selector.selectedIndex].value) {
        case 'modeMedian': {
            return fc
                .modeMedian()
                .bucketSize(getBucketSize())
                .value(d => d.y);
        }
        case 'largestTriangleOneBucket': {
            return fc
                .largestTriangleOneBucket()
                .bucketSize(getBucketSize())
                .x(d => d.x)
                .y(d => d.y);
        }
        case 'largestTriangleThreeBucket': {
            return fc
                .largestTriangleThreeBucket()
                .bucketSize(getBucketSize())
                .x(d => d.x)
                .y(d => d.y);
        }
        default: {
            return d => d;
        }
    }
}

function getBucketSize() {
    return Number(document.getElementById('bucket-size').value);
}

function updateBucketInfo() {
    document.getElementById('bucket-size-text').innerHTML = getBucketSize();
    document.getElementById('bucket-size').max =
        document.getElementById('data-count').value / 10;
}

d3.select('#strategy-selector').on('change', () => {
    d3.event.preventDefault();
    strategy = getStrategy();
    strategy = strategyInterceptor(strategy);
    render();
});

function sliderChange() {
    const bucketSize = getBucketSize();
    strategy.bucketSize(bucketSize);
    updateBucketInfo();
    render();
}

d3.select('#bucket-size')
    .on('change', sliderChange)
    .on('mousemove', () => {
        if (d3.event.buttons === 1) {
            sliderChange();
        }
    });

d3.select('#generate-chart').on('click', () => {
    d3.event.preventDefault();
    generateData(chartGenerator());
    render();
    updateBucketInfo();
});

d3.select('#generate-circle').on('click', () => {
    d3.event.preventDefault();
    generateData(circleGenerator());
    render();
    updateBucketInfo();
});

generateData(chartGenerator());
setTimeout(render, 100);
