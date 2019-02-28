import { select, event } from 'd3-selection';
import { scaleIdentity } from 'd3-scale';
import { seriesSvgMulti, seriesCanvasMulti } from '@d3fc/d3fc-series';
import { axisBottom, axisRight, axisLeft, axisTop } from '@d3fc/d3fc-axis';
import { dataJoin } from '@d3fc/d3fc-data-join';
import { rebindAll, exclude, prefix } from '@d3fc/d3fc-rebind';
import store from './store';
import { css } from './css';

const functor = (v) =>
    typeof v === 'function' ? v : () => v;

export default (xScale = scaleIdentity(), yScale = scaleIdentity()) => {

    let xLabel = functor('');
    let yLabel = functor('');
    let yOrient = functor('right');
    let xOrient = functor('bottom');
    let canvasPlotArea = seriesCanvasMulti();
    let svgPlotArea = seriesSvgMulti();
    let xAxisStore = store('tickFormat', 'ticks', 'tickArguments', 'tickSize', 'tickSizeInner', 'tickSizeOuter', 'tickValues', 'tickPadding');
    let xDecorate = () => { };
    let yAxisStore = store('tickFormat', 'ticks', 'tickArguments', 'tickSize', 'tickSizeInner', 'tickSizeOuter', 'tickValues', 'tickPadding');
    let yDecorate = () => { };
    let decorate = () => { };

    const containerDataJoin = dataJoin('d3fc-group', 'cartesian-chart');
    const xAxisDataJoin = dataJoin('d3fc-svg', 'x-axis')
        .key(d => d);
    const yAxisDataJoin = dataJoin('d3fc-svg', 'y-axis')
        .key(d => d);
    const xLabelDataJoin = dataJoin('div', 'x-label')
        .key(d => d);
    const yLabelDataJoin = dataJoin('div', 'y-label')
        .key(d => d);

    const propagateTransition = maybeTransition => selection =>
        maybeTransition.selection ? selection.transition(maybeTransition) : selection;

    const cartesian = (selection) => {

        const transitionPropagator = propagateTransition(selection);

        selection.each((data, index, group) => {
            const container = containerDataJoin(select(group[index]), [data]);

            container.enter()
                .attr('auto-resize', '')
                .each((d, i, nodes) => {
                    nodes[i].applyCss(css, 'd3fc-chart-css');
                })
                .html(
                    '<d3fc-svg class="plot-area"></d3fc-svg>' +
                    '<d3fc-canvas class="plot-area"></d3fc-canvas>'
                );

            xLabelDataJoin(container, [xOrient(data)])
                .attr('class', d => `x-label ${d}-label`)
                .text(xLabel(data));

            yLabelDataJoin(container, [yOrient(data)])
                .attr('class', d => `y-label ${d}-label`)
                .text(yLabel(data));

            xAxisDataJoin(container, [xOrient(data)])
                .attr('class', d => `x-axis ${d}-axis`)
                .on('measure', (d, i, nodes) => {
                    const { width, height } = event.detail;
                    if (d === 'top') {
                        select(nodes[i])
                            .select('svg')
                            .attr('viewBox', `0 ${-height} ${width} ${height}`);
                    }
                    xScale.range([0, width]);
                })
                .on('draw', (d, i, nodes) => {
                    const xAxis = d === 'top' ? axisTop(xScale) : axisBottom(xScale);
                    xAxis.decorate(xDecorate);
                    transitionPropagator(select(nodes[i]))
                        .select('svg')
                        .call(xAxisStore(xAxis));
                });

            yAxisDataJoin(container, [yOrient(data)])
                .attr('class', d => `y-axis ${d}-axis`)
                .on('measure', (d, i, nodes) => {
                    const { width, height } = event.detail;
                    if (d === 'left') {
                        select(nodes[i])
                            .select('svg')
                            .attr('viewBox', `${-width} 0 ${width} ${height}`);
                    }
                    yScale.range([height, 0]);
                })
                .on('draw', (d, i, nodes) => {
                    const yAxis = d === 'left' ? axisLeft(yScale) : axisRight(yScale);
                    yAxis.decorate(yDecorate);
                    transitionPropagator(select(nodes[i]))
                        .select('svg')
                        .call(yAxisStore(yAxis));
                });

            container.select('d3fc-canvas.plot-area')
                .on('draw', (d, i, nodes) => {
                    const canvas = select(nodes[i])
                        .select('canvas')
                        .node();
                    canvasPlotArea.context(canvas.getContext('2d'))
                        .xScale(xScale)
                        .yScale(yScale);
                    canvasPlotArea(d);
                });

            container.select('d3fc-svg.plot-area')
                .on('draw', (d, i, nodes) => {
                    svgPlotArea.xScale(xScale)
                        .yScale(yScale);
                    transitionPropagator(select(nodes[i]))
                        .select('svg')
                        .call(svgPlotArea);
                });

            container.each((d, i, nodes) => nodes[i].requestRedraw());

            decorate(container, data, index);
        });
    };

    const scaleExclusions = exclude(
        /range\w*/,   // the scale range is set via the component layout
        /tickFormat/  // use axis.tickFormat instead (only present on linear scales)
    );
    rebindAll(cartesian, xScale, scaleExclusions, prefix('x'));
    rebindAll(cartesian, yScale, scaleExclusions, prefix('y'));
    rebindAll(cartesian, xAxisStore, prefix('x'));
    rebindAll(cartesian, yAxisStore, prefix('y'));

    cartesian.xOrient = (...args) => {
        if (!args.length) {
            return xOrient;
        }
        xOrient = functor(args[0]);
        return cartesian;
    };
    cartesian.yOrient = (...args) => {
        if (!args.length) {
            return yOrient;
        }
        yOrient = functor(args[0]);
        return cartesian;
    };
    cartesian.xDecorate = (...args) => {
        if (!args.length) {
            return xDecorate;
        }
        xDecorate = args[0];
        return cartesian;
    };
    cartesian.yDecorate = (...args) => {
        if (!args.length) {
            return yDecorate;
        }
        yDecorate = args[0];
        return cartesian;
    };
    cartesian.xLabel = (...args) => {
        if (!args.length) {
            return xLabel;
        }
        xLabel = functor(args[0]);
        return cartesian;
    };
    cartesian.yLabel = (...args) => {
        if (!args.length) {
            return yLabel;
        }
        yLabel = functor(args[0]);
        return cartesian;
    };
    cartesian.canvasPlotArea = (...args) => {
        if (!args.length) {
            return canvasPlotArea;
        }
        canvasPlotArea = args[0];
        return cartesian;
    };
    cartesian.svgPlotArea = (...args) => {
        if (!args.length) {
            return svgPlotArea;
        }
        svgPlotArea = args[0];
        return cartesian;
    };
    cartesian.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return cartesian;
    };

    return cartesian;

};
