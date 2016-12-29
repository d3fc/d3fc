const macdExample = () => {
    let xScale = d3.scaleTime();
    let yScale = d3.scaleLinear();
    let crossValue = d => d.date;
    const macdLine = fc.seriesSvgLine();
    const signalLine = fc.seriesSvgLine();
    const divergenceBar = fc.seriesSvgBar();
    const multiSeries = fc.seriesSvgMulti();

    const macd = (selection) => {
        macdLine.crossValue(crossValue)
          .mainValue(d => d.macd);

        signalLine.crossValue(crossValue)
          .mainValue(d => d.signal);

        divergenceBar.crossValue(crossValue)
          .mainValue(d => d.divergence);

        multiSeries.xScale(xScale)
          .yScale(yScale)
          .series([divergenceBar, macdLine, signalLine])
          .decorate((g, data, index) => {
              g.enter()
                .attr('class', (d, i) => (
                    'multi ' + ['macd-divergence', 'macd', 'macd-signal'][i]
                ));
          });

        selection.call(multiSeries);
    };

    macd.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return macd;
    };
    macd.crossValue = (...args) => {
        if (!args.length) {
            return crossValue;
        }
        crossValue = args[0];
        return macd;
    };
    macd.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return macd;
    };

    fc.rebind(macd, divergenceBar, 'barWidth');

    return macd;
};

const width = 500;
const height = 250;

const container = d3.select('#macd')
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
// Create and apply the macd algorithm
const macdAlgorithm = fc.indicatorMacd()
  .fastPeriod(4)
  .slowPeriod(10)
  .signalPeriod(5)
  .value(d => d.close);
const macdData = macdAlgorithm(data);
const mergedData = data.map((d, i) => Object.assign({}, d, macdData[i]));

// the MACD is rendered on its own scale, centered around zero
const yDomain = fc.extentLinear()
  .accessors([d => d.macd])
  .symmetricalAbout(0);

const yScale = d3.scaleLinear()
  .domain(yDomain(mergedData))
  .range([height, 0]);

// Create the renderer
const macd = macdExample()
  .xScale(xScale)
  .yScale(yScale);

// Add it to the container
container.append('g')
  .datum(mergedData)
  .call(macd);
