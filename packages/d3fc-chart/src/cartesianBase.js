import { rebindAll, include } from '@d3fc/d3fc-rebind';
import cartesianChart from './cartesian';

const functor = (v) =>
    typeof v === 'function' ? v : () => v;

export default (setPlotArea, defaultPlotArea) =>
    (...args) => {

        let yLabel = functor('');
        let plotArea = defaultPlotArea;
        let decorate = () => { };

        const cartesian = cartesianChart(...args);

        const cartesianBase = (selection) => {
            setPlotArea(cartesian, plotArea);

            cartesian.decorate((container, data, index) => {
                container.enter()
                    .select('.x-label')
                    .style('height', '1em')
                    .style('line-height', '1em');

                const yOrientValue = cartesian.yOrient()(data);

                container.enter()
                    .append('div')
                    .attr('class', 'y-label-container')
                    .style('grid-column', yOrientValue === 'left' ? 1 : 5)
                    .style('-ms-grid-column', yOrientValue === 'left' ? 1 : 5)
                    .style('grid-row', 3)
                    .style('-ms-grid-row', 3)
                    .style('width', '1em')
                    .style('display', 'flex')
                    .style('align-items', 'center')
                    .style('justify-content', 'center')
                    .style('white-space', 'nowrap')
                    .append('div')
                    .attr('class', 'y-label')
                    .style('transform', 'rotate(-90deg)');

                container.select('.y-label-container>.y-label')
                    .text(yLabel);

                decorate(container, data, index);
            });

            selection.call(cartesian);
        };

        rebindAll(cartesianBase, cartesian, include(/^x/, /^y/, 'chartLabel'));

        cartesianBase.yLabel = (...args) => {
            if (!args.length) {
                return yLabel;
            }
            yLabel = functor(args[0]);
            return cartesianBase;
        };
        cartesianBase.plotArea = (...args) => {
            if (!args.length) {
                return plotArea;
            }
            plotArea = args[0];
            return cartesianBase;
        };
        cartesianBase.decorate = (...args) => {
            if (!args.length) {
                return decorate;
            }
            decorate = args[0];
            return cartesianBase;
        };

        return cartesianBase;

    };
