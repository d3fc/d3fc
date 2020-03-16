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

const groupedSeries = fc.seriesSvgBar();

const color = d3.scaleOrdinal(d3.schemeCategory10);

// Create the grouped series
const groupedBar = fc
    .seriesSvgGrouped(groupedSeries)
    .xScale(xScale)
    .yScale(yScale)
    .align('left')
    .crossValue(d => d[0])
    .mainValue(d => d[1])
    .decorate((sel, _, index) => {
        sel.enter()
            .select('path')
            .attr('fill', () => color(index));
    });

const container = document.querySelector('d3fc-svg');

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .datum(series)
            .call(fc.autoBandwidth(groupedBar));
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
