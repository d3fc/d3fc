import { range, sum } from 'd3-array';
import { rebind } from 'd3fc-rebind';
import { select, selectAll } from 'd3-selection';
import * as d3 from 'd3-selection';
import { layoutLabel, layoutTextLabel, layoutAnnealing, layoutIntersect, layoutRemoveOverlaps } from '..';
import * as fc from '..';

const labelPadding = 4;
const label = layoutTextLabel()
    .padding(labelPadding)
    .value((d) => d.data);

const width = 700;
const height = 350;
const itemWidth = 60;
const itemHeight = 20;
let data = [];

// we intercept the strategy in order to capture the final layout and compute statistics
const strategyInterceptor = (strategy) => {
    const interceptor = (layout) => {
        const start = new Date();
        const finalLayout = strategy(layout);
        const time = new Date() - start;

        // record some statistics on this strategy
        if (!interceptor.time) {
            Object.defineProperty(interceptor, 'time', { enumerable: false, writable: true });
            Object.defineProperty(interceptor, 'hidden', { enumerable: false, writable: true });
            Object.defineProperty(interceptor, 'overlap', { enumerable: false, writable: true });
        }
        const visibleLabels = finalLayout.filter((d) => !d.hidden);
        interceptor.time = time;
        interceptor.hidden = finalLayout.length - visibleLabels.length;
        interceptor.overlap = sum(visibleLabels.map((label, index) => {
            return sum(visibleLabels.filter((_, i) => i !== index)
                .map((d) => layoutIntersect(d, label)));
        }));
        return finalLayout;
    };
    rebind(interceptor, strategy, 'bounds');
    return interceptor;
};

let strategy = strategyInterceptor(layoutAnnealing());

const generateData = () => {
    const dataCount = document.getElementById('label-count').value;
    data = range(0, document.getElementById('label-count').value)
        .map((_, i) => {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                data: 'node-' + i
            };
        });
};

const svg = select('svg')
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

    const labels = layoutLabel(strategy)
        .size((_, i, g) => {
            const textSize = select(g[i])
              .select('text')
              .node()
              .getBBox();
            return [textSize.width + labelPadding * 2, textSize.height + labelPadding * 2];
        })
        .component(label);

    svg.append('g')
        .datum(data)
        .call(labels);

    const statsElement = document.getElementById('statistics');
    statsElement.innerHTML = '<b>Execution Time:</b> ' + strategy.time + 'ms, ' +
        '<b>Hidden Labels:</b> ' + strategy.hidden + ', ' +
        '<b>Overlap Area:</b> ' + strategy.overlap.toFixed(2);
};

const getStrategyName = () => {
    const selector = document.getElementById('strategy-selector');
    return selector.options[selector.selectedIndex].value;
};

select('#strategy-selector')
    .on('change', () => {
        const strategyName = getStrategyName();
        selectAll('.annealing-field')
            .attr('style', 'display:' + (strategyName === 'annealing' ? 'visible' : 'none'));
    });

select('#strategy-form .btn')
    .on('click', () => {
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
            strategy.bounds([width, height]);
        }
        const removeOverlaps = document.getElementById('remove-overlaps').checked;
        if (removeOverlaps) {
            strategy = layoutRemoveOverlaps(strategy);
        }
        strategy = strategyInterceptor(strategy);
        render();
    });

select('#labels-form .btn')
    .on('click', () => {
        d3.event.preventDefault();
        generateData();
        render();
    });

generateData();
setTimeout(render, 100);
