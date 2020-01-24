const data = fc.randomGeometricBrownianMotion().steps(1e4)(1);

const extent = fc.extentLinear();

const xScale = d3.scaleLinear().domain([0, data.length - 1]);

const yScale = d3.scaleLinear().domain(extent(data));

const container = document.querySelector('d3fc-canvas');

const gl = d3
    .select(container)
    .select('canvas')
    .node()
    .getContext('webgl');

const series = fc
    .seriesWebglBar()
    .xScale(xScale)
    .yScale(yScale)
    .context(gl)
    .crossValue((d, i) => i)
    .mainValue(d => d)
    .bandwidth(0.05);

let frame = 0;

d3.select(container)
    .on('click', () => {
        const domain = xScale.domain();
        const max = Math.round(domain[1] / 2);
        xScale.domain([0, max]);
        yScale.domain(extent(data.slice(0, max)));
        series.bandwidth(series.bandwidth()() * 2);
        container.requestRedraw();
    })
    .on('measure', () => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);
    })
    .on('draw', () => {
        performance.mark(`draw-start-${frame}`);
        series(data);
        performance.measure(`draw-duration-${frame}`, `draw-start-${frame}`);
        frame++;
    });

container.requestRedraw();
