import { select, event } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { seriesSvgLine } from 'd3fc-series';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3fc-axis';
import { dataJoin } from 'd3fc-data-join';
import { rebindAll, exclude, prefix, includeMap } from 'd3fc-rebind';

export default (xScale, yScale) => {
    xScale = xScale || scaleLinear();
    yScale = yScale || scaleLinear();

    let yLabel = '';
    let xLabel = '';
    let yOrient = 'right';
    let xOrient = 'bottom';
    let chartLabel = '';
    let plotArea = seriesSvgLine();

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

            const yLabelElements = `<div class='y-axis-label' style='width: 1em; display: flex; align-items: center; justify-content: center'>
                    <div class='label' style='transform: rotateZ(90deg)'></div>
                </div>`;
            const yAxisElements = '<d3fc-svg class=\'y-axis\' style=\'width: 3em\'></d3fc-svg>';

            const xLabelElements = `<div class='x-axis-label' style='height: 1em; display: flex; align-items: center; justify-content: center'>
                    <div class='label'></div>
                </div>`;
            const xAxisElements = '<d3fc-svg class=\'x-axis\' style=\'flex: 1\'></d3fc-svg>';

            const xAxisContainer = `<div style='height: 3em; display: flex; flex-direction: column; margin-${yOrient}: 4em'>
                    ${xOrient === 'bottom' ? xAxisElements : xLabelElements}
                    ${xOrient === 'bottom' ? xLabelElements : xAxisElements}
                </div>`;

            container.enter()
                .attr('style', 'display: flex; height: 100%; width: 100%; flex-direction: column')
                .attr('auto-resize', '')
                .html(`<div class='chart-label'
                            style='height: ${chartLabel ? '2' : '0'}em; display: flex; align-items: center; justify-content: center'>
                          <div class='label'></div>
                      </div>
                      ${xOrient === 'top' ? xAxisContainer : ''}
                      <div style='flex: 1; display: flex; flex-direction: row'>
                          ${yOrient === 'left' ? yLabelElements : ''}
                          ${yOrient === 'left' ? yAxisElements : ''}
                          <d3fc-svg class='plot-area' style='flex: 1; overflow: hidden'></d3fc-svg>
                          ${yOrient === 'right' ? yAxisElements : ''}
                          ${yOrient === 'right' ? yLabelElements : ''}
                      </div>
                      ${xOrient === 'bottom' ? xAxisContainer : ''}`);

            container.select('.y-axis-label .label')
                .text(yLabel);

            container.select('.x-axis-label .label')
                .text(xLabel);

            container.select('.chart-label .label')
                .text(chartLabel);

            select('.y-axis')
                .on('resize', (d, i, nodes) => {
                    if (yOrient === 'left') {
                        const { width, height } = event.detail;
                        select(nodes[i])
                          .select('svg')
                          .attr('viewBox', `${-width} 0 ${width} ${height}`);
                    }
                })
                .on('draw', (d, i, nodes) => {
                    select(nodes[i])
                      .select('svg')
                      .call(yAxis.scale(yScale));
                });

            select('.x-axis')
                .on('resize', (d, i, nodes) => {
                    if (xOrient === 'top') {
                        const { width, height } = event.detail;
                        select(nodes[i])
                          .select('svg')
                          .attr('viewBox', `0 ${-height} ${width} ${height}`);
                    }
                })
                .on('draw', (d, i, nodes) => {
                    select(nodes[i])
                      .select('svg')
                      .call(xAxis.scale(xScale));
                });

            container.select('.plot-area')
                .on('resize', () => {
                    const size = event.detail;
                    xScale.range([0, size.width]);
                    yScale.range([size.height, 0]);
                })
                .on('draw', (d, i, nodes) => {
                    plotArea.xScale(xScale)
                      .yScale(yScale);
                    select(nodes[i])
                      .select('svg')
                      .call(plotArea);
                });
        });
    };

    const scaleExclusions = exclude(
        /range\w*/,   // the scale range is set via the component layout
        /tickFormat/  // use axis.tickFormat instead (only present on linear scales)
    );
    rebindAll(cartesian, xScale, scaleExclusions, exclude('ticks'), prefix('x'));
    rebindAll(cartesian, yScale, scaleExclusions, exclude('ticks'), prefix('y'));

    // The scale ticks method is a stateless method that returns (roughly) the number of ticks
    // requested. This is subtley different from the axis ticks methods that simply stores the given arguments
    // for invocation of the scale method at some point in the future.
    // Here we expose the underling scale ticks method in case the user want to generate their own ticks.
    if (xScale.ticks) {
        rebindAll(cartesian, xScale, includeMap({'ticks': 'xScaleTicks'}));
    }
    if (yScale.ticks) {
        rebindAll(cartesian, yScale, includeMap({'ticks': 'yScaleTicks'}));
    }

    var axisExclusions = exclude(
        'xScale', 'yScale'  // these are set by this components
    );
    rebindAll(cartesian, xAxis, axisExclusions, prefix('x'));
    rebindAll(cartesian, yAxis, axisExclusions, prefix('y'));

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

    return cartesian;

};
