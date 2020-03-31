const forceIndexExample = () => {
    let xScale = d3.scaleTime();
    let yScale = d3.scaleLinear();
    const multiSeries = fc.seriesSvgMulti();

    const annotations = fc.annotationSvgLine();

    const forceLine = fc
        .seriesSvgLine()
        .crossValue(d => d.date)
        .mainValue(d => d.force);

    const force = selection => {
        multiSeries
            .xScale(xScale)
            .yScale(yScale)
            .series([annotations, forceLine])
            .mapping((data, index, series) =>
                series[index] === annotations ? [0] : data
            )
            .decorate(function(g, data, index) {
                g.enter().attr(
                    'class',
                    (d, i) => 'multi ' + ['annotations', 'indicator'][i]
                );
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

const dataGenerator = fc.randomFinancial().startDate(new Date(2014, 1, 1));

const data = dataGenerator(50);

const xScale = d3
    .scaleTime()
    .domain(fc.extentDate().accessors([d => d.date])(data));

// START
// Create and apply the Force Index algorithm
const forceAlgorithm = fc.indicatorForceIndex();
const forceData = forceAlgorithm(data);
const mergedData = data.map((d, i) =>
    Object.assign({}, d, { force: forceData[i] })
);

// Scaling the display using the maximum absolute value of the Index
const yDomain = fc
    .extentLinear()
    .accessors([d => d.force])
    .symmetricalAbout(0);

const yScale = d3
    .scaleLinear()
    .domain(yDomain(mergedData))
    .nice();

// Create the renderer
const force = forceIndexExample()
    .xScale(xScale)
    .yScale(yScale);

// Add it to the container
const container = document.querySelector('d3fc-svg');

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .datum(mergedData)
            .call(force);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
