// Generate 50 random data points using geometric Brownian motion.
const data = fc.randomGeometricBrownianMotion().steps(50)(1);

const extent = fc.extentLinear();

const xScale = d3.scaleLinear().domain([0, data.length - 1]);
const yScale = d3.scaleLinear().domain(extent(data));

const container = document.querySelector('d3fc-canvas');
const tooltip = document.querySelector('#tooltip');
const lastClick = document.querySelector('#last-click');

// -- Hover state --
// Track which bar index the cursor is over (-1 = none).
let hoveredIndex = -1;

// fc.webglFillColor uses reference equality to detect changes:
// if you pass the same function object twice, it skips re-projecting
// the color buffer. We must create a NEW function each time
// hoveredIndex changes so the dirty check triggers.
let colorFunc = makeColorFunc(-1);

function makeColorFunc(activeIndex) {
    return (d, i) => {
        if (i === activeIndex) {
            return [1, 0.5, 0, 1]; // orange highlight
        }
        return [0.26, 0.54, 0.8, 1]; // steel blue
    };
}

// -- Fill color helper --
// webglFillColor sets a per-vertex color attribute on the shader program.
// Calling .value(fn) with a function makes it per-bar; .data(data) provides
// the dataset the function iterates over.
const fillColor = fc.webglFillColor();

// -- Bar series --
const series = fc
    .seriesWebglBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue((d, i) => i)
    .mainValue(d => d)
    .bandwidth(15)
    .defined(() => true)
    .equals(previousData => previousData.length > 0)
    .decorate(program => {
        // decorate runs on every draw call regardless of equals().
        // This is where we apply per-bar colors via the fill attribute.
        fillColor.value(colorFunc).data(data)(program);
    });

let gl = null;

// -- Hover detection via scale inversion --
// WebGL renders everything in a single GPU draw call with no DOM nodes,
// so there are no native click/hover events on individual bars.
// Instead, we convert the mouse pixel position back to data space
// using xScale.invert(), then round to the nearest bar index.
//
// Important: xScale.range() is set in device pixels (CSS * devicePixelRatio)
// because d3fc's measure event reports device pixels. Mouse events report
// CSS pixels, so we must scale up before inverting.
function getBarIndex(mouseX) {
    const pixelRatio = window.devicePixelRatio || 1;
    const dataIndex = Math.round(xScale.invert(mouseX * pixelRatio));
    // Clamp to valid range
    return Math.max(0, Math.min(data.length - 1, dataIndex));
}

d3.select(container)
    .on('mousemove', event => {
        const index = getBarIndex(event.offsetX);
        if (index !== hoveredIndex) {
            hoveredIndex = index;
            // Create a new function reference so webglFillColor detects
            // the change and re-projects the color buffer.
            colorFunc = makeColorFunc(hoveredIndex);
            container.requestRedraw();
        }

        // Position the tooltip near the cursor
        tooltip.style.display = 'block';
        tooltip.style.left = event.offsetX + 12 + 'px';
        tooltip.style.top = event.offsetY - 28 + 'px';
        tooltip.textContent = 'Bar ' + index + ': ' + data[index].toFixed(4);
    })
    .on('mouseleave', () => {
        hoveredIndex = -1;
        colorFunc = makeColorFunc(-1);
        tooltip.style.display = 'none';
        container.requestRedraw();
    })
    .on('click', event => {
        const index = getBarIndex(event.offsetX);
        lastClick.style.display = 'block';
        lastClick.textContent =
            'Clicked: Bar ' + index + ' = ' + data[index].toFixed(4);
    })
    .on('measure', event => {
        const { width, height } = event.detail;
        xScale.range([0, width]);
        yScale.range([height, 0]);

        gl = container.querySelector('canvas').getContext('webgl');
        series.context(gl);
    })
    .on('draw', () => {
        series(data);
    });

container.requestRedraw();
