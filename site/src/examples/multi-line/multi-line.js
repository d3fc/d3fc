var priceData = fc.data.random.financial()(110);
var tradeData = [
    [
        {
            date: priceData[73].date,
            price: d3.random.normal(priceData[73].close, 0.2)()
        },
        {
            date: priceData[81].date,
            price: d3.random.normal(priceData[81].close, 0.2)()
        }
    ],
    [
        {
            date: priceData[24].date,
            price: d3.random.normal(priceData[24].close, 0.2)()
        },
        {
            date: priceData[100].date,
            price: d3.random.normal(priceData[100].close, 0.2)()
        }
    ],
    [
        {
            date: priceData[5].date,
            price: d3.random.normal(priceData[5].close, 0.2)()
        },
        {
            date: priceData[45].date,
            price: d3.random.normal(priceData[45].close, 0.2)()
        }
    ]
];
var data = {
    priceData: priceData,
    tradeData: tradeData
};

var xExtent = fc.util.extent()
    .fields([
        function(d) { return d.date; }
    ]);

var yExtent = fc.util.extent()
    .fields([
        function(d) { return d.high; },
        function(d) { return d.low; }
    ])
    .pad(0.2);

var chart = fc.chart.cartesian(
        fc.scale.dateTime(),
        d3.scale.linear()
    )
    .xTicks(5)
    .yTicks(5)
   .xDomain(xExtent(data.priceData))
   .yDomain(yExtent(data.priceData))
   .yNice()
   .chartLabel('Multi Line')
   .margin({left: 30, right: 50, bottom: 20, top: 30});

var gridlines = fc.annotation.gridline()
    .xTicks(5)
    .yTicks(5);
var candlestick = fc.series.candlestick();

var line = fc.series.line()
    .xValue(function(d) { return d.date; })
    .yValue(function(d) { return d.price; });

var lineMulti = fc.series.multi()
    .series(tradeData.map(function() { return line; }))
    .mapping(function(series, index) { return this[index]; });

var plotArea = fc.series.multi()
    .series([gridlines, candlestick, lineMulti])
    .mapping(function(series, index) {
        switch (series) {
        case candlestick:
            return this.priceData;
        case lineMulti:
            return this.tradeData;
        default:
            return data;
        }
    });

chart.plotArea(plotArea);

d3.select('#multi-line')
    .datum(data)
    .call(chart);
