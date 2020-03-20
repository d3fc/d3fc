const data = fc.randomFinancial()(50);

const container = document.querySelector('d3fc-svg');

const xScale = d3
    .scaleTime()
    .domain(fc.extentDate().accessors([d => d.date])(data));

const yScale = d3
    .scaleLinear()
    .domain(fc.extentLinear().accessors([d => d.high, d => d.low])(data));

const series = fc
    .seriesSvgOhlc()
    .xScale(xScale)
    .yScale(yScale);

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .datum(data)
            .call(series);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
