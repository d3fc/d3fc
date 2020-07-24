import { select, event } from 'd3-selection';
import { scaleIdentity } from 'd3-scale';
import { axisBottom, axisRight, axisLeft, axisTop } from '@d3fc/d3fc-axis';
import { dataJoin } from '@d3fc/d3fc-data-join';
import { rebindAll, exclude, prefix } from '@d3fc/d3fc-rebind';
import store from './store';
import './css';

const functor = (v) =>
    typeof v === 'function' ? v : () => v;

export default (...args) => {
    const { xScale, yScale, xAxis, yAxis } = getArguments(...args);

    let chartLabel = functor('');
    let xLabel = functor('');
    let yLabel = functor('');
    let xAxisHeight = functor(null);
    let yAxisWidth = functor(null);
    let yOrient = functor('right');
    let xOrient = functor('bottom');
    let webglPlotArea = null;
    let canvasPlotArea = null;
    let svgPlotArea = null;
    let isContextLost = false;
    let useDevicePixelRatio = true;
    let xAxisStore = store('tickFormat', 'ticks', 'tickArguments', 'tickSize', 'tickSizeInner', 'tickSizeOuter', 'tickValues', 'tickPadding', 'tickCenterLabel');
    let xDecorate = () => { };
    let yAxisStore = store('tickFormat', 'ticks', 'tickArguments', 'tickSize', 'tickSizeInner', 'tickSizeOuter', 'tickValues', 'tickPadding', 'tickCenterLabel');
    let yDecorate = () => { };
    let decorate = () => { };

    const containerDataJoin = dataJoin('d3fc-group', 'cartesian-chart');
    const webglDataJoin = dataJoin('d3fc-canvas', 'webgl-plot-area');
    const canvasDataJoin = dataJoin('d3fc-canvas', 'canvas-plot-area');
    const svgDataJoin = dataJoin('d3fc-svg', 'svg-plot-area');
    const xAxisDataJoin = dataJoin('d3fc-svg', 'x-axis')
        .key(d => d);
    const yAxisDataJoin = dataJoin('d3fc-svg', 'y-axis')
        .key(d => d);
    const chartLabelDataJoin = dataJoin('div', 'chart-label');
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
                .attr('auto-resize', '');

            chartLabelDataJoin(container, [xOrient(data)])
                .attr('class', d => d === 'top' ? 'chart-label bottom-label' : 'chart-label top-label')
                .style('margin-bottom', d => d === 'top' ? 0 : '1em')
                .style('margin-top', d => d === 'top' ? '1em' : 0)
                .text(chartLabel(data));

            xLabelDataJoin(container, [xOrient(data)])
                .attr('class', d => `x-label ${d}-label`)
                .text(xLabel(data));

            yLabelDataJoin(container, [yOrient(data)])
                .attr('class', d => `y-label ${d}-label`)
                .text(yLabel(data));

            webglDataJoin(container, webglPlotArea ? [data] : [])
                .attr('set-webgl-viewport','')
                .classed('plot-area', true)
                .attr('use-device-pixel-ratio', useDevicePixelRatio)
                .on('draw', (d) => {
                    const { child, pixelRatio } = event.detail;
                    webglPlotArea.context(isContextLost ? null : child.getContext('webgl'))
                        .pixelRatio(pixelRatio)
                        .xScale(xScale)
                        .yScale(yScale);
                    webglPlotArea(d);
                });

            container.select('.webgl-plot-area>canvas')
                .on('webglcontextlost', () => {
                    console.warn('WebGLRenderingContext lost');
                    event.preventDefault();
                    isContextLost = true;
                    container.node().requestRedraw();
                })
                .on('webglcontextrestored', () => {
                    console.info('WebGLRenderingContext restored');
                    isContextLost = false;
                    container.node().requestRedraw();
                });

            canvasDataJoin(container, canvasPlotArea ? [data] : [])
                .classed('plot-area', true)
                .attr('use-device-pixel-ratio', useDevicePixelRatio)
                .on('draw', (d) => {
                    const { child, pixelRatio } = event.detail;
                    const context = child.getContext('2d');
                    context.save();
                    if (useDevicePixelRatio) {
                        context.scale(pixelRatio, pixelRatio);
                    }
                    canvasPlotArea.context(context)
                        .xScale(xScale)
                        .yScale(yScale);
                    canvasPlotArea(d);
                    context.restore();
                });

            svgDataJoin(container, svgPlotArea ? [data] : [])
                .classed('plot-area', true)
                .on('draw', (d, i, nodes) => {
                    const { child } = event.detail;
                    svgPlotArea.xScale(xScale)
                        .yScale(yScale);
                    transitionPropagator(select(child).datum(d))
                        .call(svgPlotArea);
                });

            xAxisDataJoin(container, [xOrient(data)])
                .attr('class', d => `x-axis ${d}-axis`)
                .style('height', xAxisHeight(data))
                .on('measure', (d) => {
                    const { width, height, child } = event.detail;
                    if (d === 'top') {
                        select(child)
                            .attr('viewBox', `0 ${-height} ${width} ${height}`);
                    }
                    xScale.range([0, width]);
                })
                .on('draw', (d) => {
                    const { child } = event.detail;
                    const xAxisComponent = d === 'top' ? xAxis.top(xScale) : xAxis.bottom(xScale);
                    xAxisComponent.decorate(xDecorate);
                    transitionPropagator(select(child).datum(d))
                        .call(xAxisStore(xAxisComponent));
                });

            yAxisDataJoin(container, [yOrient(data)])
                .attr('class', d => `y-axis ${d}-axis`)
                .style('width', yAxisWidth(data))
                .on('measure', (d) => {
                    const { width, height, child } = event.detail;
                    if (d === 'left') {
                        select(child)
                            .attr('viewBox', `${-width} 0 ${width} ${height}`);
                    }
                    yScale.range([height, 0]);
                })
                .on('draw', (d) => {
                    const { child } = event.detail;
                    const yAxisComponent = d === 'left' ? yAxis.left(yScale) : yAxis.right(yScale);
                    yAxisComponent.decorate(yDecorate);
                    transitionPropagator(select(child).datum(d))
                        .call(yAxisStore(yAxisComponent));
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
    cartesian.chartLabel = (...args) => {
        if (!args.length) {
            return chartLabel;
        }
        chartLabel = functor(args[0]);
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
    cartesian.xAxisHeight = (...args) => {
        if (!args.length) {
            return xAxisHeight;
        }
        xAxisHeight = functor(args[0]);
        return cartesian;
    };
    cartesian.yAxisWidth = (...args) => {
        if (!args.length) {
            return yAxisWidth;
        }
        yAxisWidth = functor(args[0]);
        return cartesian;
    };
    cartesian.webglPlotArea = (...args) => {
        if (!args.length) {
            return webglPlotArea;
        }
        webglPlotArea = args[0];
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
    cartesian.useDevicePixelRatio = (...args) => {
        if (!args.length) {
            return useDevicePixelRatio;
        }
        useDevicePixelRatio = args[0];
        return cartesian;
    };

    return cartesian;

};

const getArguments = (...args) => {
    const defaultSettings = {
        xScale: scaleIdentity(),
        yScale: scaleIdentity(),
        xAxis: { bottom: axisBottom, top: axisTop },
        yAxis: { right: axisRight, left: axisLeft }
    };

    if (args.length === 1 && !args[0].domain && !args[0].range) {
        // Settings object
        return Object.assign(defaultSettings, args[0]);
    }

    // xScale/yScale parameters
    return Object.assign(defaultSettings, {
        xScale: args[0] || defaultSettings.xScale,
        yScale: args[1] || defaultSettings.yScale
    });
};
