const stochasticExample = () => {
    let xScale = d3.scaleTime();
    let yScale = d3.scaleLinear();
    let highValue = 70;
    let lowValue = 30;
    const multi = fc.seriesSvgMulti();

    const annotations = fc.annotationSvgLine();
    const dLine = fc.seriesSvgLine()
      .crossValue(d => d.date)
      .mainValue(d => d.stochastic.d);

    const kLine = fc.seriesSvgLine()
      .crossValue(d => d.date)
      .mainValue(d => d.stochastic.k);

    const stochastic = (selection) => {
        multi.xScale(xScale)
          .yScale(yScale)
          .series([annotations, dLine, kLine])
          .mapping((data, index, series) =>
            (series[index] === annotations)
              ? [highValue, lowValue]
              : data
          )
          .decorate((g, data, index) => {
              g.enter()
                .attr('class', (d, i) => (
                    'multi stochastic ' + ['annotations', 'stochastic-d', 'stochastic-k'][i]
                ));
          });

        selection.call(multi);
    };

    stochastic.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return stochastic;
    };
    stochastic.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return stochastic;
    };
    stochastic.highValue = (...args) => {
        if (!args.length) {
            return highValue;
        }
        highValue = args[0];
        return stochastic;
    };
    stochastic.lowValue = (...args) => {
        if (!args.length) {
            return lowValue;
        }
        lowValue = args[0];
        return stochastic;
    };

    return stochastic;
};

const width = 500;
const height = 250;
const container = d3.select('#stochastic')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const dataGenerator = fc.randomFinancial()
  .startDate(new Date(2014, 1, 1));
const data = dataGenerator(50);

const xScale = d3.scaleTime()
  .domain(fc.extentDate().accessors([d => d.date])(data))
  .range([0, width]);

// START
// Create and apply the stochastic oscillator algorithm
const stochasticAlgorithm = fc.indicatorStochasticOscillator()
  .kPeriod(14);
const stochasticData = stochasticAlgorithm(data);
const mergedData = data.map((d, i) => Object.assign({}, d, { stochastic: stochasticData[i] }));

// the stochastic oscillator is rendered on its own scale
const yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([height - 5, 5]);

// Create the renderer
const stochastic = stochasticExample()
  .xScale(xScale)
  .yScale(yScale);

// Add it to the container
container.append('g')
  .datum(mergedData)
  .call(stochastic);
