const sales = [
    { Year: 2011, Month: 'Jan', Sales: 320 },
    { Year: 2011, Month: 'Feb', Sales: 230 },
    { Year: 2011, Month: 'Mar', Sales: 365 },
    { Year: 2011, Month: 'Apr', Sales: 385 },
    { Year: 2011, Month: 'May', Sales: 300 },
    { Year: 2012, Month: 'Jan', Sales: 380 },
    { Year: 2012, Month: 'Feb', Sales: 180 },
    { Year: 2012, Month: 'Mar', Sales: 275 },
    { Year: 2012, Month: 'Apr', Sales: 450 },
    { Year: 2012, Month: 'May', Sales: 410 },
    { Year: 2013, Month: 'Jan', Sales: 320 },
    { Year: 2013, Month: 'Feb', Sales: 170 },
    { Year: 2013, Month: 'Mar', Sales: 375 },
    { Year: 2013, Month: 'Apr', Sales: 510 },
    { Year: 2013, Month: 'May', Sales: 390 },
    { Year: 2014, Month: 'Jan', Sales: 420 },
    { Year: 2014, Month: 'Feb', Sales: 125 },
    { Year: 2014, Month: 'Mar', Sales: 310 },
    { Year: 2014, Month: 'Apr', Sales: 450 },
    { Year: 2014, Month: 'May', Sales: 410 },
    { Year: 2015, Month: 'Jan', Sales: 460 },
    { Year: 2015, Month: 'Feb', Sales: 195 },
    { Year: 2015, Month: 'Mar', Sales: 360 },
    { Year: 2015, Month: 'Apr', Sales: 410 },
    { Year: 2015, Month: 'May', Sales: 385 }
];

// group by month, giving our per-month small multiples
const groupedByMonth = d3
    .nest()
    .key(d => d.Month)
    .entries(sales);

// the various series components
const area = fc
    .seriesSvgArea()
    .crossValue(d => d.Year)
    .mainValue(d => d.Sales);
const line = fc
    .seriesSvgLine()
    .crossValue(d => d.Year)
    .mainValue(d => d.Sales);
const point = fc
    .seriesSvgPoint()
    .crossValue(d => d.Year)
    .mainValue(d => d.Sales);

// the average line
const average = fc.annotationSvgLine().value(d => d);

// bring all these renderers together into one using the multi-series. The area/point/line
// are mapped to the 'values' returned by d3.nest, and the line annotation maps to the average
const multi = fc
    .seriesSvgMulti()
    .series([area, line, point, average])
    .mapping((data, index, series) => {
        switch (series[index]) {
            case average:
                return [d3.mean(data.values, d => d.Sales)];
            default:
                return data.values;
        }
    });

// compute the extent of the y-values, adding some padding
const yExtent = fc
    .extentLinear()
    .include([0])
    .pad([0, 0.2])
    .accessors([d => d.Sales]);

// the chart!
var chart = fc
    .chartCartesian(d3.scaleLinear(), d3.scaleLinear())
    .xDomain([2010.5, 2015.5])
    .yDomain(yExtent(sales))
    .yOrient('left')
    .xTickFormat(d3.format('0'))
    .xTicks(2)
    .chartLabel(d => d.key)
    .svgPlotArea(multi);

// data-join to render our small multiples
d3.select('#chart')
    .selectAll('div')
    .data(groupedByMonth)
    .enter()
    .append('div')
    .call(chart);
