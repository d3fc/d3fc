const data = [
    {
        month: 'Jan',
        sales: 1
    },
    {
        month: 'Feb',
        sales: 1.5332793661950717
    },
    {
        month: 'Mar',
        sales: 2.0486834288742597
    },
    {
        month: 'Apr',
        sales: 2.556310832331535
    },
    {
        month: 'May',
        sales: 3.029535759511747
    },
    {
        month: 'Jun',
        sales: 3.507418002703505
    },
    {
        month: 'Jul',
        sales: 4.02130992651795
    },
    {
        month: 'Aug',
        sales: 4.482485234741706
    },
    {
        month: 'Sep',
        sales: 4.957935275183866
    },
    {
        month: 'Oct',
        sales: 5.427273488256043
    },
    {
        month: 'Nov',
        sales: 5.943007604008045
    },
    {
        month: 'Dec',
        sales: 6.454464059891373
    }
];

const yExtent = fc
    .extentLinear()
    .accessors([d => d.sales])
    .include([0]);

const bar = fc
    .seriesSvgBar()
    .crossValue(d => d.month)
    .mainValue(d => d.sales);

const chart = fc
    .chartCartesian(d3.scalePoint().padding(0.5), d3.scaleLinear())
    .xLabel('Value')
    .yLabel('Sine / Cosine')
    .yOrient('left')
    .yDomain(yExtent(data))
    .xDomain(data.map(d => d.month))
    .svgPlotArea(bar);

d3.select('#chart')
    .datum(data)
    .call(chart);
