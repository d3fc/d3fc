const forceIndexExample = () => {
    let xScale = d3.scaleTime();
    let yScale = d3.scaleLinear();
    let multiSeries = fc.seriesSvgMulti();

    const annotations = fc.annotationSvgLine();

    const forceLine = fc.seriesSvgLine()
      .crossValue(d => d.date)
      .mainValue(d => d.force);

    const force = (selection) => {
        multiSeries.xScale(xScale)
          .yScale(yScale)
          .series([annotations, forceLine])
          .mapping((data, index, series) => (series[index] === annotations) ? [0] : data)
          .decorate(function(g, data, index) {
              g.enter()
                .attr('class', (d, i) => (
                    'multi ' + ['annotations', 'indicator'][i]
                ));
          });

        selection.call(multiSeries);
    };

    force.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        annotations.xScale(args[0]);
        return force;
    };
    force.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        annotations.yScale(args[0]);
        return force;
    };

    fc.rebind(force, forceLine, 'mainValue', 'crossValue');

    return force;
};

const width = 500;
const height = 250;

const container = d3.select('#force-index')
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
// Create and apply the Force Index algorithm
const forceAlgorithm = fc.indicatorForceIndex();
const forceData = forceAlgorithm(data);
const mergedData = data.map((d, i) => Object.assign({}, d, { force: forceData[i] }));

// Scaling the display using the maximum absolute value of the Index
const yDomain = fc.extentLinear()
  .accessors([d => d.force])
  .symmetricalAbout(0);

const yScale = d3.scaleLinear()
  .domain(yDomain(mergedData))
  .range([height, 0])
  .nice();

// Create the renderer
const force = forceIndexExample()
  .xScale(xScale)
  .yScale(yScale);

// Add it to the container
container.append('g')
  .datum(mergedData)
  .call(force);
