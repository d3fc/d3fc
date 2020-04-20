const isIntersecting = (a, b) =>
    !(
        a.x >= b.x + b.width ||
        a.x + a.width <= b.x ||
        a.y >= b.y + b.height ||
        a.y + a.height <= b.y
    );

const layoutIntersect = (a, b) => {
    if (isIntersecting(a, b)) {
        const left = Math.max(a.x, b.x);
        const right = Math.min(a.x + a.width, b.x + b.width);
        const top = Math.max(a.y, b.y);
        const bottom = Math.min(a.y + a.height, b.y + b.height);
        return (right - left) * (bottom - top);
    } else {
        return 0;
    }
};

const labelPadding = 4;
const label = fc
    .layoutTextLabel()
    .padding(labelPadding)
    .value(d => d.data);

const width = 700;
const height = 350;
let data = [];

// we intercept the strategy in order to capture the final layout and compute statistics
const strategyInterceptor = strategy => {
    const interceptor = layout => {
        const start = new Date();
        const finalLayout = strategy(layout);
        const time = new Date() - start;

        // record some statistics on this strategy
        if (!interceptor.time) {
            Object.defineProperty(interceptor, 'time', {
                enumerable: false,
                writable: true
            });
            Object.defineProperty(interceptor, 'hidden', {
                enumerable: false,
                writable: true
            });
            Object.defineProperty(interceptor, 'overlap', {
                enumerable: false,
                writable: true
            });
        }
        const visibleLabels = finalLayout.filter(d => !d.hidden);
        interceptor.time = time;
        interceptor.hidden = finalLayout.length - visibleLabels.length;
        interceptor.overlap = d3.sum(
            visibleLabels.map((label, index) =>
                d3.sum(
                    visibleLabels
                        .filter((_, i) => i !== index)
                        .map(d => layoutIntersect(d, label))
                )
            )
        );
        return finalLayout;
    };
    fc.rebind(interceptor, strategy, 'bounds');
    return interceptor;
};

let strategy = strategyInterceptor(fc.layoutAnnealing());

const generateData = () => {
    const dataCount = document.getElementById('label-count').value;
    data = d3.range(0, dataCount).map((_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        data: 'node-' + i
    }));
};

const svg = d3
    .select('svg')
    .attr('width', width)
    .attr('height', height);

const render = () => {
    svg.selectAll('g').remove();

    svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 2)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

    const labels = fc
        .layoutLabel(strategy)
        .size((_, i, g) => {
            const textSize = g[i].getElementsByTagName('text')[0].getBBox();
            return [
                textSize.width + labelPadding * 2,
                textSize.height + labelPadding * 2
            ];
        })
        .component(label);

    svg.append('g')
        .datum(data)
        .call(labels);

    const statsElement = document.getElementById('statistics');
    statsElement.innerHTML =
        '<b>Execution Time:</b> ' +
        strategy.time +
        'ms, ' +
        '<b>Hidden Labels:</b> ' +
        strategy.hidden +
        ', ' +
        '<b>Overlap Area:</b> ' +
        strategy.overlap.toFixed(2);
};

const getStrategyName = () => {
    const selector = document.getElementById('strategy-selector');
    return selector.options[selector.selectedIndex].value;
};

d3.select('#strategy-selector').on('change', () => {
    const strategyName = getStrategyName();
    d3.selectAll('.annealing-field').attr(
        'style',
        'display:' + (strategyName === 'annealing' ? 'visible' : 'none')
    );
});

d3.select('#apply-strategy').on('click', () => {
    d3.event.preventDefault();
    const strategyName = getStrategyName();
    strategy = d => d;
    if (strategyName !== 'none') {
        strategy = fc[strategyName]();
    }
    if (strategyName === 'annealing') {
        strategy.temperature(document.getElementById('temperature').value);
        strategy.cooling(document.getElementById('cooling').value);
    }
    const enforceBounds = document.getElementById('enforce-bounds').checked;
    if (enforceBounds) {
        strategy.bounds({ x: 0, y: 0, width, height });
    }
    const removeOverlaps = document.getElementById('remove-overlaps').checked;
    if (removeOverlaps) {
        strategy = fc.layoutRemoveOverlaps(strategy);
    }
    strategy = strategyInterceptor(strategy);
    render();
});

d3.select('#generate-data').on('click', () => {
    d3.event.preventDefault();
    generateData();
    render();
});

generateData();
setTimeout(render, 100);
