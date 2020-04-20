const data = [
    {
        State: 'AL',
        'Under 5 Years': '310',
        '5 to 13 Years': '552',
        '14 to 17 Years': '259',
        '18 to 24 Years': '450',
        '25 to 44 Years': '1215',
        '45 to 64 Years': '641'
    },
    {
        State: 'AK',
        'Under 5 Years': '52',
        '5 to 13 Years': '85',
        '14 to 17 Years': '42',
        '18 to 24 Years': '74',
        '25 to 44 Years': '183',
        '45 to 64 Years': '50'
    },
    {
        State: 'AZ',
        'Under 5 Years': '515',
        '5 to 13 Years': '828',
        '14 to 17 Years': '362',
        '18 to 24 Years': '601',
        '25 to 44 Years': '1804',
        '45 to 64 Years': '1523'
    },
    {
        State: 'AR',
        'Under 5 Years': '202',
        '5 to 13 Years': '343',
        '14 to 17 Years': '157',
        '18 to 24 Years': '264',
        '25 to 44 Years': '754',
        '45 to 64 Years': '727'
    }
];

const stack = d3.stack().keys(Object.keys(data[0]).filter(k => k !== 'State'));
const series = stack(data);

const container = document.querySelector('d3fc-canvas');

const xScale = d3
    .scalePoint()
    .domain(data.map(d => d.State))
    .padding(0.5);

const yExtent = fc
    .extentLinear()
    .accessors([a => a.map(d => d[1])])
    .include([0]);

const yScale = d3.scaleLinear().domain(yExtent(series));

const color = d3.scaleOrdinal(d3.schemeCategory10);

const barSeries = fc
    .seriesWebglBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(d => d.data.State)
    .mainValue(d => d[1])
    .baseValue(d => d[0]);

let pixels = null;
let frame = 0;
let gl = null;

d3.select(container)
    .on('click', () => {
        const domain = yScale.domain();
        const max = Math.round(domain[1] / 2);
        yScale.domain([0, max]);
        container.requestRedraw();
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);

        gl = container.querySelector('canvas').getContext('webgl');
        barSeries.context(gl);
    })
    .on('draw', () => {
        if (pixels == null) {
            pixels = new Uint8Array(
                gl.drawingBufferWidth * gl.drawingBufferHeight * 4
            );
        }
        performance.mark(`draw-start-${frame}`);
        series.forEach((s, i) => {
            barSeries.decorate(program => {
                fc
                    .webglFillColor()
                    .value(() => {
                        const { r, g, b, opacity } = d3.color(color(i));
                        return [r / 255, g / 255, b / 255, opacity];
                    })
                    .data(data)(program);
            })(s);
        });
        // Force GPU to complete rendering to allow accurate performance measurements to be taken
        gl.readPixels(
            0,
            0,
            gl.drawingBufferWidth,
            gl.drawingBufferHeight,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            pixels
        );
        performance.measure(`draw-duration-${frame}`, `draw-start-${frame}`);
        frame++;
    });

container.requestRedraw();
