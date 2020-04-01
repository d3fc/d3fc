function bollingerBandsExample() {
    let xScale = d3.scaleTime();
    let yScale = d3.scaleLinear();
    let mainValue = (d, i) => d.close;
    let crossValue = (d, i) => d.date;
    let decorate = () => {};
    let ctx;

    const area = fc
        .seriesCanvasArea()
        .mainValue((d, i) => d.upper)
        .baseValue((d, i) => d.lower);

    const upperLine = fc.seriesCanvasLine().mainValue((d, i) => d.upper);

    const averageLine = fc.seriesCanvasLine().mainValue((d, i) => d.average);

    const lowerLine = fc.seriesCanvasLine().mainValue((d, i) => d.lower);

    const styles = {
        area: {
            fillStyle: 'rgba(153, 204, 255, 0.5)',
            strokeStyle: 'transparent'
        },
        upper: { strokeStyle: '#06c' },
        lower: { strokeStyle: '#06c' },
        average: { strokeStyle: '#06c' }
    };

    const bollingerBands = function(data) {
        const multi = fc
            .seriesCanvasMulti()
            .xScale(xScale)
            .yScale(yScale)
            .context(ctx)
            .series([area, upperLine, lowerLine, averageLine])
            .decorate((context, data, index) => {
                const series = ['area', 'upper', 'lower', 'average'];
                Object.assign(context, styles[series[index]]);
            });

        area.crossValue(crossValue);
        upperLine.crossValue(crossValue);
        averageLine.crossValue(crossValue);
        lowerLine.crossValue(crossValue);

        multi(data);
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

    bollingerBands.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return bollingerBands;
    };

    bollingerBands.ctx = (...args) => {
        if (!args.length) {
            return ctx;
        }
        ctx = args[0];
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
const container = document.querySelector('d3fc-canvas');

d3.select(container)
    .on('draw', () => {
        bollinger(mergedData);
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);

        const ctx = container.querySelector('canvas').getContext('2d');
        bollinger.ctx(ctx);
    });

container.requestRedraw();
