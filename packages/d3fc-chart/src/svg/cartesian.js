import { select, event } from 'd3-selection';
import { scaleIdentity } from 'd3-scale';
import { seriesSvgLine } from 'd3fc-series';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3fc-axis';
import { dataJoin } from 'd3fc-data-join';
import { rebindAll, exclude, prefix, includeMap } from 'd3fc-rebind';

export default (xScale = scaleIdentity(), yScale = scaleIdentity()) => {

    let yLabel = '';
    let xLabel = '';
    let yOrient = 'right';
    let xOrient = 'bottom';
    let chartLabel = '';
    let plotArea = seriesSvgLine();
    let xTickFormat = null;
    let xTickArgs;
    let xDecorate = () => {};
    let yTickFormat = null;
    let yTickArgs;
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
        }
    };

    let xAxis = axisForOrient(xOrient);
    let yAxis = axisForOrient(yOrient);

    const containerDataJoin = dataJoin('d3fc-group', 'cartesian-chart');

    const cartesian = (selection) => {

        selection.each((data, index, group) => {
            const container = containerDataJoin(select(group[index]), [data]);

            container.enter()
                .attr('style', 'display: flex; height: 100%; width: 100%; flex-direction: column')
                .attr('auto-resize', '')
                .html(`<div class='chart-label'
                            style='height: ${chartLabel ? 2 : 0}em; line-height: 2em; text-align: center; margin-${yOrient}: 4em'>
                      </div>
                      <div style='flex: 1; display: flex; flex-direction: ${xOrient === 'bottom' ? 'column' : 'column-reverse'}'>
                          <div style='flex: 1; display: flex; flex-direction: ${yOrient === 'right' ? 'row' : 'row-reverse'}'>
                              <d3fc-svg class='plot-area' style='flex: 1; overflow: hidden'></d3fc-svg>
                              <d3fc-svg class='y-axis' style='width: 3em'></d3fc-svg>
                              <div style='width: 1em; display: flex; align-items: center; justify-content: center'>
                                  <div class='y-axis-label' style='transform: rotate(90deg)'></div>
                              </div>
                          </div>
                          <d3fc-svg class='x-axis' style='height: 2em; margin-${yOrient}: 4em'></d3fc-svg>
                          <div class='x-axis-label' style='height: 1em; line-height: 1em; text-align: center; margin-${yOrient}: 4em'></div>
                      </div>`);

            container.select('.y-axis-label')
                .text(yLabel);

            container.select('.x-axis-label')
                .text(xLabel);

            container.select('.chart-label')
                .text(chartLabel);

            container.select('.y-axis')
                .on('measure', (d, i, nodes) => {
                    if (yOrient === 'left') {
                        const { width, height } = event.detail;
                        select(nodes[i])
                          .select('svg')
                          .attr('viewBox', `${-width} 0 ${width} ${height}`);
                    }
                })
                .on('draw', (d, i, nodes) => {
                    yAxis.tickFormat(yTickFormat)
                      .decorate(yDecorate);
                    if (yTickArgs) {
                        yAxis.ticks(...yTickArgs);
                    }
                    select(nodes[i])
                      .select('svg')
                      .call(yAxis.scale(yScale));
                });

            container.select('.x-axis')
                .on('measure', (d, i, nodes) => {
                    if (xOrient === 'top') {
                        const { width, height } = event.detail;
                        select(nodes[i])
                          .select('svg')
                          .attr('viewBox', `0 ${-height} ${width} ${height}`);
                    }
                })
                .on('draw', (d, i, nodes) => {
                    xAxis.tickFormat(xTickFormat)
                      .decorate(xDecorate);
                    if (xTickArgs) {
                        xAxis.ticks(...xTickArgs);
                    }
                    select(nodes[i])
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
                    select(nodes[i])
                      .select('svg')
                      .call(plotArea);
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

    cartesian.xTickFormat = (...args) => {
        if (!args.length) {
            return xTickFormat;
        }
        xTickFormat = args[0];
        return cartesian;
    };
    cartesian.xTicks = (...args) => {
        xTickArgs = args;
        return cartesian;
    };
    cartesian.xDecorate = (...args) => {
        if (!args.length) {
            return xDecorate;
        }
        xDecorate = args[0];
        return cartesian;
    };
    cartesian.yTickFormat = (...args) => {
        if (!args.length) {
            return yTickFormat;
        }
        yTickFormat = args[0];
        return cartesian;
    };
    cartesian.yTicks = (...args) => {
        yTickArgs = args;
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
        const newValue = args[0];
        if (newValue !== yOrient) {
            yAxis = axisForOrient(newValue);
        }
        yOrient = newValue;
        return cartesian;
    };
    cartesian.xOrient = (...args) => {
        if (!args.length) {
            return xOrient;
        }
        const newValue = args[0];
        if (newValue !== xOrient) {
            xAxis = axisForOrient(newValue);
        }
        xOrient = newValue;
        return cartesian;
    };
    cartesian.chartLabel = (...args) => {
        if (!args.length) {
            return chartLabel;
        }
        chartLabel = args[0];
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
        xLabel = args[0];
        return cartesian;
    };
    cartesian.yLabel = (...args) => {
        if (!args.length) {
            return yLabel;
        }
        yLabel = args[0];
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
