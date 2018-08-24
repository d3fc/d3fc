import { select, event } from 'd3-selection';
import { scaleIdentity } from 'd3-scale';
import { seriesSvgLine } from '@d3fc/d3fc-series';
import { axisBottom, axisRight, axisLeft, axisTop } from '@d3fc/d3fc-axis';
import { dataJoin } from '@d3fc/d3fc-data-join';
import { rebindAll, exclude, prefix } from '@d3fc/d3fc-rebind';
import store from './store';

const functor = (v) =>
  typeof v === 'function' ? v : () => v;

export default (d3fcElementType, plotAreaDrawFunction) =>
    (xScale = scaleIdentity(), yScale = scaleIdentity()) => {

        let yLabel = functor('');
        let xLabel = functor('');
        let yOrient = functor('right');
        let xOrient = functor('bottom');
        let chartLabel = functor('');
        let plotArea = seriesSvgLine();
        let xAxisStore = store('tickFormat', 'ticks', 'tickArguments', 'tickSize', 'tickSizeInner', 'tickSizeOuter', 'tickValues', 'tickPadding');
        let xDecorate = () => {};
        let yAxisStore = store('tickFormat', 'ticks', 'tickArguments', 'tickSize', 'tickSizeInner', 'tickSizeOuter', 'tickValues', 'tickPadding');
        let yDecorate = () => {};
        let decorate = () => {};

        const axisForOrient = (orient) => {
            switch (orient) {
            case 'bottom':
                return axisBottom();
            case 'top':
                return axisTop();
            case 'left':
                return axisLeft();
            case 'right':
                return axisRight();
            case 'none':
                return null;
            }
        };

        const xMargin = (yOrient) => {
            switch (yOrient) {
            case 'left':
                return 'margin-left: 4em';
            case 'right':
                return 'margin-right: 4em';
            default:
                return '';
            }
        };

        const xPadding = (yOrient) => {
            switch (yOrient) {
            case 'left':
                return 'padding-right: 1em';
            case 'right':
                return 'padding-left: 1em';
            case 'none':
                return 'padding-left: 1em; padding-right: 1em';
            default:
                return '';
            }
        };

        const colFlexDirection = (xOrient) => {
            switch (xOrient) {
            case 'bottom':
                return 'flex-direction: column';
            default:
                return 'flex-direction: column-reverse';
            }
        };

        const rowFlexDirection = (yOrient) => {
            switch (yOrient) {
            case 'right':
                return 'flex-direction: row';
            default:
                return 'flex-direction: row-reverse';
            }
        };

        const containerDataJoin = dataJoin('d3fc-group', 'cartesian-chart');

        const propagateTransition = maybeTransition => selection =>
            maybeTransition.selection ? selection.transition(maybeTransition) : selection;

        const cartesian = (selection) => {

            const transitionPropagator = propagateTransition(selection);

            selection.each((data, index, group) => {
                const container = containerDataJoin(select(group[index]), [data]);

                const xOrientValue = xOrient(data);
                const yOrientValue = yOrient(data);
                const xAxis = xAxisStore(axisForOrient(xOrientValue));
                const yAxis = yAxisStore(axisForOrient(yOrientValue));

                const xAxisMarkup = xAxis
                  ? `<d3fc-svg class='x-axis' style='height: 2em; ${xMargin(yOrientValue)}'></d3fc-svg>
                    <div class='x-axis-label' style='height: 1em; line-height: 1em; text-align: center; ${xMargin(yOrientValue)}'></div>`
                  : '';
                const yAxisMarkup = yAxis
                  ? `<d3fc-svg class='y-axis' style='width: 3em'></d3fc-svg>
                    <div style='width: 1em; display: flex; align-items: center; justify-content: center'>
                        <div class='y-axis-label' style='transform: rotate(-90deg)'></div>
                    </div>`
                  : '';

                container.enter()
                    .attr('style', 'display: flex; height: 100%; width: 100%; flex-direction: column; overflow: hidden')
                    .attr('auto-resize', '')
                    .html(`<div class='chart-label'
                                style='height: 2em; line-height: 2em; text-align: center; ${xMargin(yOrientValue)}'>
                          </div>
                          <div style='flex: 1; display: flex; ${colFlexDirection(xOrientValue)}; ${xPadding(yOrientValue)}'>
                              <div style='flex: 1; display: flex; ${rowFlexDirection(yOrientValue)}'>
                                  <${d3fcElementType} class='plot-area' style='flex: 1; overflow: hidden'></${d3fcElementType}>
                                  ${yAxisMarkup}
                              </div>
                              ${xAxisMarkup}
                          </div>`);

                container.select('.y-axis-label')
                    .text(yLabel(data));

                container.select('.x-axis-label')
                    .text(xLabel(data));

                container.select('.chart-label')
                    .text(chartLabel(data));

                container.select('.y-axis')
                    .on('measure', (d, i, nodes) => {
                        if (yOrientValue === 'left') {
                            const { width, height } = event.detail;
                            select(nodes[i])
                              .select('svg')
                              .attr('viewBox', `${-width} 0 ${width} ${height}`);
                        }
                    })
                    .on('draw', (d, i, nodes) => {
                        yAxis.decorate(yDecorate);
                        transitionPropagator(select(nodes[i]))
                          .select('svg')
                          .call(yAxis.scale(yScale));
                    });

                container.select('.x-axis')
                    .on('measure', (d, i, nodes) => {
                        if (xOrientValue === 'top') {
                            const { width, height } = event.detail;
                            select(nodes[i])
                              .select('svg')
                              .attr('viewBox', `0 ${-height} ${width} ${height}`);
                        }
                    })
                    .on('draw', (d, i, nodes) => {
                        xAxis.decorate(xDecorate);
                        transitionPropagator(select(nodes[i]))
                          .select('svg')
                          .call(xAxis.scale(xScale));
                    });

                container.select('.plot-area')
                    .on('measure', () => {
                        const { width, height } = event.detail;
                        xScale.range([0, width]);
                        yScale.range([height, 0]);
                    })
                    .on('draw', (d, i, nodes) => {
                        plotArea.xScale(xScale)
                          .yScale(yScale);
                        plotAreaDrawFunction(d, nodes[i], plotArea, transitionPropagator);
                    });

                container.each((_, index, group) => group[index].requestRedraw());

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
        cartesian.yOrient = (...args) => {
            if (!args.length) {
                return yOrient;
            }
            yOrient = functor(args[0]);
            return cartesian;
        };
        cartesian.xOrient = (...args) => {
            if (!args.length) {
                return xOrient;
            }
            xOrient = functor(args[0]);
            return cartesian;
        };
        cartesian.chartLabel = (...args) => {
            if (!args.length) {
                return chartLabel;
            }
            chartLabel = functor(args[0]);
            return cartesian;
        };
        cartesian.plotArea = (...args) => {
            if (!args.length) {
                return plotArea;
            }
            plotArea = args[0];
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
        cartesian.decorate = (...args) => {
            if (!args.length) {
                return decorate;
            }
            decorate = args[0];
            return cartesian;
        };

        return cartesian;

    };
