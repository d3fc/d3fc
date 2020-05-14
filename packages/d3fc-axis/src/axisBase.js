import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { dataJoin as _dataJoin } from '@d3fc/d3fc-data-join';
import { ticksArrayForAxis, tickFormatterForAxis } from './axisTickUtils';

const identity = d => d;

export const axisBase = (orient, scale, custom = {}) => {

    let tickArguments = [10];
    let tickValues = null;
    let decorate = () => {};
    let tickFormat = null;
    let tickSizeOuter = 6;
    let tickSizeInner = 6;
    let tickPadding = 3;

    const svgDomainLine = line();

    const dataJoin = _dataJoin('g', 'tick')
        .key(identity);

    const domainPathDataJoin = _dataJoin('path', 'domain');

    const defaultLabelOffset = () => ({ offset: [0, tickSizeInner + tickPadding] });
    const defaultTickPath = () => ({ path: [[0, 0], [0, tickSizeInner]] });

    const labelOffset = custom.labelOffset || defaultLabelOffset;
    const tickPath = custom.tickPath || defaultTickPath;

    // returns a function that creates a translation based on
    // the bound data
    const containerTranslate = (scale, trans) => {
        let offset = 0;
        if (scale.bandwidth) {
            offset = scale.bandwidth() / 2;
            if (scale.round()) {
                offset = Math.round(offset);
            }
        }
        return d => trans(scale(d) + offset, 0);
    };

    const translate = (x, y) =>
        isVertical()
            ? `translate(${y}, ${x})`
            : `translate(${x}, ${y})`;

    const pathTranspose = (arr) =>
        isVertical()
           ? arr.map(d => [d[1], d[0]])
           : arr;

    const isVertical = () =>
        orient === 'left' || orient === 'right';

    const axis = (selection) => {

        if (selection.selection) {
            dataJoin.transition(selection);
            domainPathDataJoin.transition(selection);
        }

        selection.each((data, index, group) => {

            const element = group[index];

            const container = select(element);
            if (!element.__scale__) {
                container
                    .attr('fill', 'none')
                    .attr('font-size', 10)
                    .attr('font-family', 'sans-serif')
                    .attr('text-anchor', orient === 'right' ? 'start' : orient === 'left' ? 'end' : 'middle');
            }

            // Stash a snapshot of the new scale, and retrieve the old snapshot.
            const scaleOld = element.__scale__ || scale;
            element.__scale__ = scale.copy();

            const ticksArray = ticksArrayForAxis(axis);
            const tickFormatter = tickFormatterForAxis(axis);
            const sign = orient === 'bottom' || orient === 'right' ? 1 : -1;
            const withSign = ([x, y]) => ([x, sign * y]);

            // add the domain line
            const range = scale.range();
            const domainPathData = pathTranspose([
                [range[0], sign * tickSizeOuter],
                [range[0], 0],
                [range[1], 0],
                [range[1], sign * tickSizeOuter]
            ]);

            const domainLine = domainPathDataJoin(container, [data]);

            domainLine.enter()
                .attr('stroke', '#000');

            domainLine.attr('d', svgDomainLine(domainPathData));

            const g = dataJoin(container, ticksArray);

            const labelOffsets = ticksArray.map((d, i) => labelOffset(d, i, ticksArray));
            const tickPaths = ticksArray.map((d, i) => tickPath(d, i, ticksArray));

            // enter
            g.enter()
                .attr('transform', containerTranslate(scaleOld, translate))
                .append('path')
                .attr('stroke', '#000');

            g.enter()
                .append('text')
                .attr('transform', (d, i) => translate(...withSign(labelOffsets[i].offset)))
                .attr('fill', '#000');

            // exit
            g.exit()
                .attr('transform', containerTranslate(scale, translate));

            // update
            g.select('path')
                .attr('visibility', (d, i) => tickPaths[i].hidden && 'hidden')
                .attr('d',
                    (d, i) => svgDomainLine(pathTranspose(tickPaths[i].path.map(withSign)))
                );

            g.select('text')
                .attr('visibility', (d, i) => labelOffsets[i].hidden && 'hidden')
                .attr('transform', (d, i) => translate(...withSign(labelOffsets[i].offset)))
                .attr('dy', () => {
                    let offset = '0em';
                    if (isVertical()) {
                        offset = '0.32em';
                    } else if (orient === 'bottom') {
                        offset = '0.71em';
                    }
                    return offset;
                })
               .text(tickFormatter);

            g.attr('transform', containerTranslate(scale, translate));

            decorate(g, data, index);
        });
    };

    axis.tickFormat = (...args) => {
        if (!args.length) {
            return tickFormat;
        }
        tickFormat = args[0];
        return axis;
    };

    axis.tickSize = (...args) => {
        if (!args.length) {
            return tickSizeInner;
        }
        tickSizeInner = tickSizeOuter = Number(args[0]);
        return axis;
    };

    axis.tickSizeInner = (...args) => {
        if (!args.length) {
            return tickSizeInner;
        }
        tickSizeInner = Number(args[0]);
        return axis;
    };

    axis.tickSizeOuter = (...args) => {
        if (!args.length) {
            return tickSizeOuter;
        }
        tickSizeOuter = Number(args[0]);
        return axis;
    };

    axis.tickPadding = (...args) => {
        if (!args.length) {
            return tickPadding;
        }
        tickPadding = args[0];
        return axis;
    };

    axis.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return axis;
    };

    axis.scale = (...args) => {
        if (!args.length) {
            return scale;
        }
        scale = args[0];
        return axis;
    };

    axis.ticks = (...args) => {
        tickArguments = [...args];
        return axis;
    };

    axis.tickArguments = (...args) => {
        if (!args.length) {
            return tickArguments !== null ? tickArguments.slice() : null;
        }
        tickArguments = args[0] == null ? [] : [...args[0]];
        return axis;
    };

    axis.tickValues = (...args) => {
        if (!args.length) {
            return tickValues !== null ? tickValues.slice() : null;
        }
        tickValues = args[0] == null ? [] : [...args[0]];
        return axis;
    };

    axis.orient = () => orient;

    return axis;
};
