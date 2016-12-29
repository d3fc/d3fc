const rsiExample = () => {
    let xScale = d3.scaleTime();
    let yScale = d3.scaleLinear();
    let upperValue = 70;
    let lowerValue = 30;
    const multiSeries = fc.seriesSvgMulti();

    const annotations = fc.annotationSvgLine();
    const rsiLine = fc.seriesSvgLine()
      .crossValue(d => d.date)
      .mainValue(d => d.rsi);

    const rsi = (selection) => {
        multiSeries.xScale(xScale)
          .yScale(yScale)
          .series([annotations, rsiLine])
          .mapping((data, index, series) =>
              (series[index] === annotations)
                ? [upperValue, 50, lowerValue]
                : data
          )
          .decorate((g, data, index) => {
              g.enter()
                .attr('class', (d, i) => (
                    'multi rsi ' + ['annotations', 'indicator'][i]
                ));
          });

        selection.call(multiSeries);
    };

    rsi.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return rsi;
    };
    rsi.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return rsi;
    };
    rsi.upperValue = (...args) => {
        if (!args.length) {
            return upperValue;
        }
        upperValue = args[0];
        return rsi;
    };
    rsi.lowerValue = (...args) => {
        if (!args.length) {
            return lowerValue;
        }
        lowerValue = args[0];
        return rsi;
    };

    fc.rebind(rsi, rsiLine, 'mainValue', 'crossValue');

    return rsi;
};

const width = 500;
const height = 250;

const container = d3.select('#rsi')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const dataGenerator = fc.randomFinancial()
  .startDate(new Date(2014, 1, 1));

const data = dataGenerator(50);

const xScale = d3.scaleTime()
  .domain(fc.extentDate().accessors([d => d.date])(data))
  .range([0, width - 50]);

// START
// the RSI is output on a percentage scale, so requires a domain from 0 - 100
const yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);

// Create and apply the RSI algorithm
const rsiAlgorithm = fc.indicatorRelativeStrengthIndex().value(d => d.close);
const rsiData = rsiAlgorithm(data);
const mergedData = data.map((d, i) => Object.assign({}, d, { rsi: rsiData[i] }));

// Create the renderer
const rsi = rsiExample()
  .xScale(xScale)
  .yScale(yScale);

// Add it to the container
container.append('g')
  .datum(mergedData)
  .call(rsi);
