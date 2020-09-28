export default (xScale, yScale) => {
    let plotAreaNode, xAxis, yAxis;

    const zoom = d3.zoom(),
        zoomX = d3.zoom(),
        zoomY = d3.zoom();

    const instance = sel => {
        plotAreaNode = sel.select('.plot-area').node();
        xAxis = sel.selectAll('.x-axis');
        yAxis = sel.selectAll('.y-axis');

        const applyTransform = () => {
            xScale.domain(
                d3
                    .zoomTransform(xAxis.node())
                    .rescaleX(plotAreaNode.__xScaleOriginal)
                    .domain()
            );
            yScale.domain(
                d3
                    .zoomTransform(yAxis.node())
                    .rescaleY(plotAreaNode.__yScaleOriginal)
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
        if (!plotAreaNode.__xScaleOriginal) {
            plotAreaNode.__xScaleOriginal = xScale.copy();
            plotAreaNode.__yScaleOriginal = yScale.copy();
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
                plotAreaNode.__xScaleOriginal.range([0, event.detail.width]);
                plotAreaNode.__yScaleOriginal.range([event.detail.height, 0]);
            })
            .call(zoom);
    };

    instance.xDomain = val => {
        plotAreaNode.__xScaleOriginal.domain(val);
        plotAreaNode.__oldZoom = d3.zoomIdentity;
        xAxis.call(zoomX.transform, d3.zoomIdentity);
        yAxis.call(zoomY.transform, d3.zoomIdentity);
        d3.select(plotAreaNode).call(zoom.transform, d3.zoomIdentity);
        return instance;
    };

    instance.yDomain = val => {
        plotAreaNode.__yScaleOriginal.domain(val);
        plotAreaNode.__oldZoom = d3.zoomIdentity;
        xAxis.call(zoomX.transform, d3.zoomIdentity);
        yAxis.call(zoomY.transform, d3.zoomIdentity);
        d3.select(plotAreaNode).call(zoom.transform, d3.zoomIdentity);
        return instance;
    };

    return instance;
};
