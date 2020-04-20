const data = [
    {
        State: 'AL',
        'Under 5 Years': '310',
        '5 to 13 Years': '552',
        '14 to 17 Years': '259',
        '18 to 24 Years': '450',
        '25 to 44 Years': '1215',
        '45 to 64 Years': '641'
    },
    {
        State: 'AK',
        'Under 5 Years': '52',
        '5 to 13 Years': '85',
        '14 to 17 Years': '42',
        '18 to 24 Years': '74',
        '25 to 44 Years': '183',
        '45 to 64 Years': '50'
    },
    {
        State: 'AZ',
        'Under 5 Years': '515',
        '5 to 13 Years': '828',
        '14 to 17 Years': '362',
        '18 to 24 Years': '601',
        '25 to 44 Years': '1804',
        '45 to 64 Years': '1523'
    },
    {
        State: 'AR',
        'Under 5 Years': '202',
        '5 to 13 Years': '343',
        '14 to 17 Years': '157',
        '18 to 24 Years': '264',
        '25 to 44 Years': '754',
        '45 to 64 Years': '727'
    }
];

// Manipulate the data into stacked series
const group = fc.group().key('State');
const series = group(data);

const yExtent = fc
    .extentLinear()
    .accessors([a => a.map(d => d[1])])
    .include([0]);

const yScale = d3.scaleLinear().domain(yExtent(series));

const color = d3.scaleOrdinal(d3.schemeCategory10);

// Render the series against a linear scale. In this case the auto-bandwidth wrapper
// will compute the bandwidth based on the underlying data
const linearScale = d3.scaleLinear().domain([-0.5, data.length - 0.5]);

const linearGroupedBar = fc
    .seriesSvgGrouped(fc.seriesSvgBar())
    .align('center')
    .xScale(linearScale)
    .yScale(yScale)
    .crossValue((_, i) => i)
    .mainValue(d => d[1])
    .decorate((sel, _, index) => {
        sel.enter()
            .select('path')
            .attr('fill', () => color(index));
    });

const linearContainer = document.querySelector('#autobandwidth-linearscale');

d3.select(linearContainer)
    .on('draw', () => {
        d3.select(linearContainer)
            .select('svg')
            .datum(series)
            .call(fc.autoBandwidth(linearGroupedBar));
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        linearScale.range([0, width]);
        yScale.range([height, 0]);
    });

linearContainer.requestRedraw();

// Now render the same series against a point scale
const pointScale = d3
    .scalePoint()
    .domain(data.map(d => d.State))
    .padding(0.5);

const pointGroupedBar = fc
    .seriesSvgGrouped(fc.seriesSvgBar())
    // Center align the bars around the points on the scale
    .align('center')
    .xScale(pointScale)
    .yScale(yScale)
    .crossValue(d => d[0])
    .mainValue(d => d[1])
    // Because point scales have a zero bandwidth, in this context we provide
    // an explicit bandwidth and don't wrap the series in fc.autoBandwidth. This
    // example also shows how bandwidth can vary on a point-to-point basis
    .bandwidth((_, i) => 50 + (i % 2) * 50)
    .decorate((sel, _, index) => {
        sel.enter()
            .select('path')
            .attr('fill', () => color(index));
    });

const variableContainer = document.querySelector('#variable-bandwidth');

d3.select(variableContainer)
    .on('draw', () => {
        d3.select(variableContainer)
            .select('svg')
            .datum(series)
            .call(pointGroupedBar);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        pointScale.range([0, width]);
        yScale.range([height, 0]);
    });

variableContainer.requestRedraw();

// Show a horizontal grouped bar
const yScaleHorizontal = d3
    .scaleBand()
    .domain(data.map(d => d.State))
    .paddingInner(0.2)
    .paddingOuter(0.1);

const xHorizontalExtent = fc
    .extentLinear()
    .accessors([a => a.map(d => d[1])])
    .include([0]);

const xScaleHorizontal = d3.scaleLinear().domain(xHorizontalExtent(series));

const groupedHorizontal = fc
    .seriesSvgGrouped(fc.seriesSvgBar())
    .orient('horizontal')
    .xScale(xScaleHorizontal)
    .yScale(yScaleHorizontal)
    .align('left')
    .crossValue(d => d[0])
    .mainValue(d => d[1])
    .decorate((sel, _, index) => {
        sel.enter()
            .select('path')
            .attr('fill', () => color(index));
    });

const horizontalContainer = document.querySelector('#horizontal');

d3.select(horizontalContainer)
    .on('draw', () => {
        d3.select(horizontalContainer)
            .select('svg')
            .datum(series)
            .call(fc.autoBandwidth(groupedHorizontal));
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScaleHorizontal.range([0, width]);
        yScaleHorizontal.rangeRound([0, height]);
    });

horizontalContainer.requestRedraw();
