var data = [
    {
        'period': 'Old|2017|Q1',
        'sales': 1
    },
    {
        'period': 'Old|2017|Q2',
        'sales': 1.5332793661950717
    },
    {
        'period': 'Old|2017|Q3',
        'sales': 2.0486834288742597
    },
    {
        'period': 'Old|2017|Q4',
        'sales': 2.556310832331535
    },
    {
        'period': 'New|2018|Q1',
        'sales': 3.029535759511747
    },
    {
        'period': 'New|2018|Q2',
        'sales': 3.507418002703505
    },
    {
        'period': 'New|2018|Q3',
        'sales': 4.02130992651795
    },
    {
        'period': 'New|2018|Q4',
        'sales': 4.482485234741706
    },
    {
        'period': 'New|2019|Q1',
        'sales': 4.957935275183866
    },
    {
        'period': 'New|2019|Q2',
        'sales': 5.427273488256043
    },
    {
        'period': 'New|2019|Q3',
        'sales': 5.943007604008045
    }
];

var yExtent = fc.extentLinear()
    .accessors([d => d.sales])
    .include([0]);

var bar = fc.autoBandwidth(fc.seriesSvgBar())
    .crossValue(d => d.period)
    .mainValue(d => d.sales)
    .align('left');

var chart = fc.chartSvgCartesian(
    d3.scaleBand().padding(0.5),
    d3.scaleLinear()
)
    .xLabel('Quarter')
    .xTickPadding(5)
    .xTickSizeInner(15)
    .xAxisSize(45)
    .xTickGrouping(tick => tick.split('|'))
    .xTickSizeOuter(5)
    .yLabel('Value')
    .yOrient('left')
    .yDomain(yExtent(data))
    .xDomain(data.map(d => d.period))
    .plotArea(bar);

d3.select('#multiOrdinal')
    .datum(data)
    .call(chart);

var barHorizontal = fc.autoBandwidth(fc.seriesSvgBar())
    .crossValue(d => d.period)
    .mainValue(d => d.sales)
    .align('left')
    .orient('horizontal');

var chartHorizontal = fc.chartSvgCartesian(
    d3.scaleLinear(),
    d3.scaleBand().padding(0.5)
)
    .yLabel('Quarter')
    .yTickPadding(5)
    .yTickSizeInner(25)
    .yAxisSize(90)
    .yTickGrouping(tick => tick.split('|'))
    .yTickSizeOuter(5)
    .xLabel('Value')
    .yOrient('left')
    .xDomain(yExtent(data))
    .yDomain(data.map(d => d.period))
    .plotArea(barHorizontal);

d3.select('#multiOrdinalHorizontal')
    .datum(data)
    .call(chartHorizontal);
