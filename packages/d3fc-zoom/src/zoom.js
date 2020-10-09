import { dispatch } from 'd3-dispatch';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { rebind } from '@d3fc/d3fc-rebind';

const domainsEqual = (a, b) => {
    if (a == null && b == null) {
        return true;
    }
    const aDomain = a.domain();
    const bDomain = b.domain();
    return (
        aDomain.length === bDomain.length &&
        aDomain.every((d, i) => d?.valueOf() === bDomain[i]?.valueOf())
    );
};

const subtract = (a, b) =>
    zoomIdentity.scale(a.k / b.k).translate(a.x - b.x, a.y - b.y);

const symbol = Symbol('d3fc-domain-zoom');

export default () => {
    const dispatcher = dispatch('zoom');

    const zoomer = zoom().on('zoom', function({ transform }) {
        const node = this;
        let updatedTransform = transform;
        let {
            originalXScale,
            previousXScale,
            xScale,
            originalYScale,
            previousYScale,
            yScale,
            previousTransform
        } = node[symbol];
        if (
            !domainsEqual(previousXScale, xScale) ||
            !domainsEqual(previousYScale, yScale)
        ) {
            originalXScale = xScale?.copy();
            originalYScale = yScale?.copy();
            updatedTransform = subtract(transform, previousTransform);
        }
        if (xScale != null) {
            previousXScale = updatedTransform.rescaleX(
                originalXScale.range(xScale.range())
            );
            xScale.domain(previousXScale.domain());
        }
        if (yScale != null) {
            previousYScale = updatedTransform.rescaleY(
                originalYScale.range(yScale.range())
            );
            yScale.domain(previousYScale.domain());
        }
        previousTransform = updatedTransform;
        node[symbol] = {
            originalXScale,
            previousXScale,
            xScale,
            originalYScale,
            previousYScale,
            yScale,
            previousTransform
        };
        if (updatedTransform !== transform) {
            zoomer.transform(select(node), updatedTransform);
        }
        dispatcher.call('zoom');
    });

    const instance = (selection, xScale = null, yScale = null) => {
        if (xScale == null && yScale == null) {
            console.warn(
                `Without an xScale and/or yScale specified, this component won't do anything. Perhaps you forgot to specify them e.g. selection.call(zoom, x, y)?`
            );
        }
        selection
            .each((d, i, nodes) => {
                const existingContext = nodes[i][symbol];
                if (
                    existingContext != null &&
                    existingContext.xScale === xScale &&
                    existingContext.yScale === yScale
                ) {
                    console.warn(
                        `This component should only be called on a selection once. Perhaps you're missing an .enter()?`
                    );
                }
                const xScaleCopy = xScale?.copy();
                const yScaleCopy = yScale?.copy();
                nodes[i][symbol] = {
                    originalXScale: xScaleCopy,
                    previousXScale: xScaleCopy,
                    xScale,
                    originalYScale: yScaleCopy,
                    previousYScale: yScaleCopy,
                    yScale,
                    previousTransform: zoomIdentity
                };
            })
            .call(zoomer);
    };

    rebind(instance, dispatcher, 'on');
    rebind(
        instance,
        zoomer,
        'extent',
        'filter',
        'wheelDelta',
        'touchable',
        'clickDistance',
        'tapDistance',
        'duration',
        'interpolate'
    );

    return instance;
};
