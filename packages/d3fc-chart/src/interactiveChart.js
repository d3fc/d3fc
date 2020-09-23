const interactiveChart = (xScale, yScale) => {
    const zoom = d3.zoom(),
        zoomX = d3.zoom(),
        zoomY = d3.zoom();

    const chart = fc.chartCartesian(xScale, yScale).decorate(sel => {
        const plotAreaNode = sel.select('.plot-area').node();
        const xAxis = sel.selectAll('.x-axis');
        const yAxis = sel.selectAll('.y-axis');

        const applyTransform = () => {
            // FIXME: this changes the xDomain and yDomain properties
            // of the chart component
            xScale.domain(
                d3
                    .zoomTransform(xAxis.node())
                    .rescaleX(xScaleOriginal)
                    .domain()
            );
            yScale.domain(
                d3
                    .zoomTransform(yAxis.node())
                    .rescaleY(yScaleOriginal)
                    .domain()
            );
            sel.node().requestRedraw();
        };

        xAxis.call(zoomX.on('zoom', applyTransform));
        yAxis.call(zoomY.on('zoom', applyTransform));

        // stash the previous transform, so we can track its changes
        if (!plotAreaNode.__oldZoom) {
            plotAreaNode.__oldZoom = d3.zoomIdentity;
        }

        // FIXME - this is all pretty nasty! if a user wants to manually change the
        // chart zoom they will update the x/y domain properties of the chart component
        // then re-render via select.call. This code detects whether these properties
        // have changed
        if (!plotAreaNode.__xDomain) {
            // stack the domain values
            plotAreaNode.__xDomain = xScale.domain();
            plotAreaNode.__yDomain = yScale.domain();
        } else if (
            plotAreaNode.__xDomain !== xScale.domain() ||
            plotAreaNode.__yDomain !== yScale.domain()
        ) {
            // stash once again
            plotAreaNode.__xDomain = xScale.domain();
            plotAreaNode.__yDomain = yScale.domain();

            // reset the various zooms
            plotAreaNode.__oldZoom = d3.zoomIdentity;
            xAxis.call(zoomX.transform, d3.zoomIdentity);
            yAxis.call(zoomY.transform, d3.zoomIdentity);
            d3.select(plotAreaNode).call(zoomY.transform, d3.zoomIdentity);
        }

        zoom.on('zoom', e => {
            const transform = e.transform;
            const k = transform.k / plotAreaNode.__oldZoom.k;
            const point = e.sourceEvent
                ? d3.pointer(e)
                : [xScale.range()[1] / 2, yScale.range()[0] / 2];

            if (k === 1) {
                // translation
                const transformX = d3.zoomTransform(xAxis.node());
                const transformY = d3.zoomTransform(yAxis.node());
                xAxis.call(
                    zoomX.translateBy,
                    (transform.x - plotAreaNode.__oldZoom.x) / transformX.k,
                    0
                );
                yAxis.call(
                    zoomY.translateBy,
                    0,
                    (transform.y - plotAreaNode.__oldZoom.y) / transformY.k
                );
            } else {
                // zoom
                xAxis.call(zoomX.scaleBy, k, point);
                yAxis.call(zoomY.scaleBy, k, point);
            }

            // cache the previous transform
            plotAreaNode.__oldZoom = transform;

            applyTransform();
        });

        sel.enter()
            .select('.plot-area')
            .on('measure.range', event => {
                xScaleOriginal.range([0, event.detail.width]);
                yScaleOriginal.range([event.detail.height, 0]);
            })
            .call(zoom);

        decorate(sel);
    });

    let xScaleOriginal = xScale.copy(),
        yScaleOriginal = yScale.copy();

    let decorate = () => {};

    const instance = selection => chart(selection);

    instance.yDomain = (...args) => {
        if (!args.length) {
            return chart.yDomain();
        }
        yScaleOriginal.domain(...args);
        chart.yDomain(...args);
        return instance;
    };

    instance.xDomain = (...args) => {
        if (!args.length) {
            return chart.xDomain();
        }
        xScaleOriginal.domain(...args);
        chart.xDomain(...args);
        return instance;
    };

    instance.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return instance;
    };

    fc.rebindAll(instance, chart, fc.exclude('xDomain', 'yDomain', 'decorate'));
    fc.rebindAll(instance, zoomX, fc.include('scaleExtent'), fc.prefix('x'));
    fc.rebindAll(instance, zoomY, fc.include('scaleExtent'), fc.prefix('y'));

    return instance;
};

export default interactiveChart;
