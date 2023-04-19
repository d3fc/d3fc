const stream = fc.randomFinancial().stream();
const data = stream.take(110);

let yExtentHighLog = -1, yExtentLowLog = -1, xExtentLog = -1;
let yExtent = fc.extentLinear();
let yHighMax = -1e99, yHighMin = 1e99, yLowMax = -1e99, yLowMin = 1e99;
let xMin = new Date(8.64e7 * 100 * 365.25), xMax = new Date(1);
yExtent = yExtent.accessors([
    d => {
        if ((++yExtentHighLog / 10) === Math.floor(yExtentHighLog / 10))
            console.debug("yExtent: d.high", d.high);
        if (d.high < yHighMin) {
            console.log(`yHighMin: ${yHighMin} => ${d.high}`);
            yHighMin = d.high;
        }
        if (d.high > yHighMax) {
            console.log(`yHighMax: ${yHighMax} => ${d.high}`);
            yHighMax = d.high;
        }
        return d.high;
    },
    d => {
        if ((++yExtentLowLog / 10) === Math.floor(yExtentLowLog / 10))
            console.debug("yExtent: d.low", d.low);
        if (d.low > yLowMax) {
            console.log(`yLowMax: ${yLowMax} => ${d.low}`);
            yLowMax = d.low;
        }
        if (d.low < yLowMin) {
            console.log(`yLowMin: ${yLowMin} => ${d.low}`);
            yLowMin = d.low;
        }
        return d.low;
    }]);
const xExtent = fc.extentDate().accessors([
    d => {
        if ((++xExtentLog / 10) === Math.floor(xExtentLog / 10))
            console.debug("xExtent: d.date", d.date);
        if (d.date > xMax) {
            console.log(`xMax: ${xMax} => ${d.date}`);
            xMax = d.date;
        }
        if (d.date < xMin) {
            console.log(`xMin: ${xMin} => ${d.date}`);
            xMin = d.date;
        }
        return d.date;
    }]);

const gridlines = fc.annotationSvgGridline();
const candlestick = fc.seriesSvgCandlestick();
const multi = fc.seriesSvgMulti().series([gridlines, candlestick]);

const chart = fc
    .chartCartesian(d3.scaleTime(), d3.scaleLinear())
    .yDomain((d=>{
        const yEx=yExtent(data); console.log("yEx",d,yEx); return yEx;})())
    .xDomain((d=>{
        const xEx=xExtent(data); console.log("xEx",d,xEx); return xEx;})())
    .svgPlotArea(multi);

yExtentHighLog = -1;
yExtentLowLog = -1;
xExtentLog = -1;

console.log(
    `yHighMax: ${yHighMax}, yHighMin: ${yHighMin}, ` +
    `yLowMax: ${yLowMax}, yLowMin: ${yLowMin}, ` +
    `xMin: ${xMin}, xMax: ${xMax}`
);

function renderChart() {;
    data.push(stream.next());
    data.shift();
    // if (data.oclh.length > )
    // fix the `data` shape, match extendChart's antics with original `data` members
    chart.yDomain(yExtent(data)).xDomain(xExtent(data));
    d3.select('#chart')
        .datum(data)
        .call(chart);
}

renderChart();
setInterval(renderChart, 100);
