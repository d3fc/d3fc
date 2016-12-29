const envelopeExample = () => {

    let xScale = d3.scaleTime();
    let yScale = d3.scaleLinear();
    let mainValue = d => d.close;
    let crossValue = d => d.date;

    const area = fc.seriesSvgArea()
      .mainValue(d => d.upper)
      .baseValue(d => d.lower);

    const upperLine = fc.seriesSvgLine()
      .mainValue(d => d.upper);

    const lowerLine = fc.seriesSvgLine()
      .mainValue(d => d.lower);

    const envelope = (selection) => {
        const multi = fc.seriesSvgMulti()
          .xScale(xScale)
          .yScale(yScale)
          .series([area, upperLine, lowerLine])
          .decorate((g, data, index) => {
              g.enter()
                .attr('class', (d, i) => (
                    'multi envelope ' + ['area', 'upper', 'lower'][i]
                ));
          });

        area.crossValue(crossValue);
        upperLine.crossValue(crossValue);
        lowerLine.crossValue(crossValue);

        selection.call(multi);
    };

    envelope.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return envelope;
    };
    envelope.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return envelope;
    };
    envelope.crossValue = (...args) => {
        if (!args.length) {
            return crossValue;
        }
        crossValue = args[0];
        return envelope;
    };
    envelope.mainValue = (...args) => {
        if (!args.length) {
            return mainValue;
        }
        mainValue = args[0];
        return envelope;
    };

    return envelope;
};

const width = 500;
const height = 250;

const container = d3.select('#envelope')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const dataGenerator = fc.randomFinancial()
  .startDate(new Date(2014, 1, 1));

const data = dataGenerator(50);

const xScale = d3.scaleTime()
  .domain(fc.extentDate().accessors([d => d.date])(data))
  .range([0, width]);

const yScale = d3.scaleLinear()
.domain(
  fc.extentLinear()
    .pad([0.4, 0.4])
    .accessors([d => d.high, d => d.low])(data)
  )
  .range([height, 0]);

// START
// Create and apply the envelope algorithm
const envelopeAlgorithm = fc.indicatorEnvelope()
  .factor(0.01)
  .value(d => d.close);

const envelopeData = envelopeAlgorithm(data);
const mergedData = data.map((d, i) => Object.assign({}, d, envelopeData[i]));

// Create the renderer
const envelope = envelopeExample()
  .xScale(xScale)
  .yScale(yScale);

// Add it to the container
container
  .append('g')
  .datum(mergedData)
  .call(envelope);
