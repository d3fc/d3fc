d3.csv('heatmap-data.csv',
    function(row) {
        return {
            count: Number(row.count),
            day: Number(row.day),
            hour: Number(row.hour)
        };
    },
    function(data) {

        var width = 500;
        var height = 250;
        var container = d3.select('#heatmap-svg');

        var xScale = d3.scaleLinear()
                .domain([-0.5, 23.5])
                .range([0, width]);

        var yScale = d3.scaleLinear()
                .domain([0.5, 7.5])
                .range([height, 0]);

        var svgHeatmap = fc.autoBandwidth(fc.seriesSvgHeatmap())
                .xValue(function(d) { return d.hour; })
                .yValue(function(d) { return d.day; })
                .colorValue(function(d) { return d.count; })
                .colorInterpolate(d3.interpolateWarm)
                .xScale(xScale)
                .yScale(yScale)
                .widthFraction(1.0);

        container.append('g')
                .datum(data)
                .call(svgHeatmap);

        var canvas = d3.select('#heatmap-canvas').node();
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');

        // for the canvas series we use band scales for x & y, demonstrating
        // that the autoBandwidth component is able to obtain the bandwidth from the scale
        var xScaleBand = d3.scaleBand()
                .domain(d3.range(0, 23))
                .range([0, width]);

        var yScaleBand = d3.scaleBand()
                .domain(d3.range(1, 8))
                .range([height, 0]);

        var canvasHeatmap = fc.autoBandwidth(fc.seriesCanvasHeatmap())
                .xValue(function(d) { return d.hour; })
                .yValue(function(d) { return d.day; })
                .colorValue(function(d) { return d.count; })
                .xScale(xScaleBand)
                .yScale(yScaleBand)
                // band scales require a different alignment
                .xAlign('right')
                .yAlign('top')
                .context(ctx)
                .widthFraction(1.0);
        canvasHeatmap(data);
    });
