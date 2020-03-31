function bollingerBandsExample() {
    let xScale = d3.scaleTime();
    let yScale = d3.scaleLinear();
    let mainValue = d => d.close;
    let crossValue = d => d.date;

    const area = fc
        .seriesSvgArea()
        .mainValue((d, i) => d.upper)
        .baseValue((d, i) => d.lower);

    const upperLine = fc.seriesSvgLine().mainValue((d, i) => d.upper);

    const averageLine = fc.seriesSvgLine().mainValue((d, i) => d.average);

    const lowerLine = fc.seriesSvgLine().mainValue((d, i) => d.lower);

    const bollingerBands = function(selection) {
        const multi = fc
            .seriesSvgMulti()
            .xScale(xScale)
            .yScale(yScale)
            .series([area, upperLine, lowerLine, averageLine])
            .decorate((g, data, index) => {
                g.enter().attr(
                    'class',
                    (d, i) =>
                        'multi bollinger ' +
                        ['area', 'upper', 'lower', 'average'][i]
                );
            });

        area.crossValue(crossValue);
        upperLine.crossValue(crossValue);
        averageLine.crossValue(crossValue);
        lowerLine.crossValue(crossValue);

        selection.call(multi);
    };

    bollingerBands.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return bollingerBands;
    };

    bollingerBands.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return bollingerBands;
    };

    bollingerBands.crossValue = (...args) => {
        if (!args.length) {
            return crossValue;
        }
        crossValue = args[0];
        return bollingerBands;
    };

    bollingerBands.mainValue = (...args) => {
        if (!args.length) {
            return mainValue;
        }
        mainValue = args[0];
        return bollingerBands;
    };

    return bollingerBands;
}

const dataGenerator = fc.randomFinancial().startDate(new Date(2014, 1, 1));

const data = dataGenerator(50);

const xScale = d3
    .scaleTime()
    .domain(fc.extentDate().accessors([d => d.date])(data));

const yScale = d3.scaleLinear().domain(
    fc
        .extentLinear()
        .pad([0.4, 0.4])
        .accessors([d => d.high, d => d.low])(data)
);

// START
// Create and apply the bollinger algorithm
const bollingerAlgorithm = fc.indicatorBollingerBands().value(d => d.close);
const bollingerData = bollingerAlgorithm(data);
const mergedData = data.map((d, i) => Object.assign({}, d, bollingerData[i]));

// Create the renderer
const bollinger = bollingerBandsExample()
    .xScale(xScale)
    .yScale(yScale);

// Add it to the container
const container = document.querySelector('d3fc-svg');

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .datum(mergedData)
            .call(bollinger);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
    });

container.requestRedraw();
