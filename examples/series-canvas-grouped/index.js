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

// Use a band scale, which provides the bandwidth value to the grouped
// series via fc.autobandwidth
const xScale = d3
    .scaleBand()
    .domain(data.map(d => d.State))
    .paddingInner(0.2)
    .paddingOuter(0.1);

const yExtent = fc
    .extentLinear()
    .accessors([a => a.map(d => d[1])])
    .include([0]);

const yScale = d3.scaleLinear().domain(yExtent(series));

const color = d3.scaleOrdinal(d3.schemeCategory10);

const verticalContainer = document.querySelector('#vertical');

// Create the grouped series
const verticalGroupedBar = fc
    .autoBandwidth(fc.seriesCanvasGrouped(fc.seriesCanvasBar()))
    .align('left')
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(d => d[0])
    .mainValue(d => d[1])
    .decorate((ctx, _, index) => {
        ctx.fillStyle = color(index);
    });

d3.select(verticalContainer)
    .on('draw', () => {
        verticalGroupedBar(series);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
    });

verticalContainer.requestRedraw();

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

const horizontalContainer = document.querySelector('#horizontal');

const horizontalGroupedBar = fc
    .autoBandwidth(fc.seriesCanvasGrouped(fc.seriesCanvasBar()))
    .orient('horizontal')
    .align('left')
    .xScale(xScaleHorizontal)
    .yScale(yScaleHorizontal)
    .crossValue(d => d[0])
    .mainValue(d => d[1])
    .decorate((ctx, _, index) => {
        ctx.fillStyle = color(index);
    });

d3.select(horizontalContainer)
    .on('draw', () => {
        horizontalGroupedBar(series);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScaleHorizontal.range([0, width]);
        yScaleHorizontal.rangeRound([0, height]);

        const verticalContext = verticalContainer
            .querySelector('canvas')
            .getContext('2d');
        verticalGroupedBar.context(verticalContext);
        const horizontalContext = horizontalContainer
            .querySelector('canvas')
            .getContext('2d');
        horizontalGroupedBar.context(horizontalContext);
    });

horizontalContainer.requestRedraw();
