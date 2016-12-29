// Elder Ray Component
const elderRayExample = () => {
    let xScale = d3.scaleTime();
    let yScale = d3.scaleLinear();
    let crossValue = d => d.date;
    let barWidth = fc.seriesFractionalBarWidth(0.75);
    let bullBar = fc.seriesSvgBar();
    let bearBar = fc.seriesSvgBar();
    let bullBarTop = fc.seriesSvgBar();
    let bearBarTop = fc.seriesSvgBar();
    let multi = fc.seriesSvgMulti();

    const elderRay = (selection) => {
        function isTop(input, comparison) {
            // The values share parity and the input is smaller than the comparison
            return (input * comparison > 0 && Math.abs(input) < Math.abs(comparison));
        }

        bullBar
          .crossValue(crossValue)
          .mainValue((d, i) =>
            isTop(d.bullPower, d.bearPower)
            ? undefined
            : d.bullPower
          )
          .barWidth(barWidth);

        bearBar
          .crossValue(crossValue)
          .mainValue((d, i) =>
            isTop(d.bearPower, d.bullPower)
            ? undefined
            : d.bearPower
          )
          .barWidth(barWidth);

        bullBarTop
          .crossValue(crossValue)
          .mainValue((d, i) =>
            isTop(d.bullPower, d.bearPower)
            ? d.bullPower
            : undefined
          )
          .barWidth(barWidth);

        bearBarTop
          .crossValue(crossValue)
          .mainValue((d, i) =>
            isTop(d.bearPower, d.bullPower)
            ? d.bearPower
            : undefined
          )
          .barWidth(barWidth);

        multi
          .xScale(xScale)
          .yScale(yScale)
          .series([bullBar, bearBar, bullBarTop, bearBarTop])
          .decorate((g, data, index) => {
              g.enter()
                .attr('class', (d, i) => (
                    'multi ' + ['bull', 'bear', 'bull top', 'bear top'][i]
                ));
          });

        selection.call(multi);
    };

    elderRay.barWidth = (...args) => {
        if (!args.length) {
            return barWidth;
        }
        barWidth = args[0];
        return elderRay;
    };
    elderRay.crossValue = (...args) => {
        if (!args.length) {
            return crossValue;
        }
        crossValue = args[0];
        return elderRay;
    };
    elderRay.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return elderRay;
    };
    elderRay.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return elderRay;
    };

    return elderRay;
};

const width = 500;
const height = 250;

const container = d3.select('#elder')
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
// Create and apply the elder ray algorithm
const elderRayAlgorithm = fc.indicatorElderRay().period(6);
const elderRayData = elderRayAlgorithm(data);
const mergedData = data.map((d, i) => Object.assign({}, d, elderRayData[i]));

// the elder ray is rendered on its own scale
const yDomain = fc.extentLinear()
  .accessors([d => d.bullPower, d => d.bearPower])
  .symmetricalAbout(0)
  .pad([0.1, 0.1]);

const yScale = d3.scaleLinear()
  .domain(yDomain(mergedData))
  .range([height, 0]);

// Create the renderer
const elderRay = elderRayExample()
  .xScale(xScale)
  .yScale(yScale);

// Add it to the container
container.append('g')
  .datum(mergedData)
  .call(elderRay);
