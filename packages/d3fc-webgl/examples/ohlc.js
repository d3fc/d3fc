const dataGenerator = fc.randomFinancial();
let data = dataGenerator(10);

let counter = 0;
data = data.map((val) => ({
  ...val,
  x: counter++
}));

const x = d3.scaleLinear();
const y = d3.scaleLinear();

x.domain(fc.extentLinear().accessors([d => d.x])(data));
y.domain(fc.extentLinear().accessors([d => d.high, d => d.low])(data));

const x2 = x.copy();
const y2 = y.copy();

const getWebglSeries = () => fc.seriesWebglOhlc()
  .crossValue(d => d.x)
  .bandwidth(10)
  .lineWidth(2);

const zoom = d3.zoom()
  .on('zoom', () => {
    x.domain(d3.event.transform.rescaleX(x2).domain());
    y.domain(d3.event.transform.rescaleY(y2).domain());
    d3.select('d3fc-group')
      .node()
      .requestRedraw();
  });

const decorate = (sel) => {
  sel.enter()
    .select('.plot-area')
    .on('measure.range', () => {
      x2.range([0, d3.event.detail.width]);
      y2.range([d3.event.detail.height, 0]);
    })
    .call(zoom);
};

const chart = fc.chartCartesian(x, y)
  .decorate(decorate)
  .webglPlotArea(getWebglSeries());

d3.select('#chart')
  .datum(data)
  .call(chart);
