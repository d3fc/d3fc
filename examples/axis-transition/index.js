const container = document.querySelector('d3fc-svg');

const alphabet = 'abcdefghijkl'.split('');

const linearScale = d3.scaleLinear();

const ordinalScale = d3.scaleBand();

const d3LinearAxis = d3.axisBottom(linearScale);
const fcLinearAxis = fc.axisBottom(linearScale);

const d3OrdinalAxis = d3.axisBottom(ordinalScale);
const fcOrdinalAxis = d3.axisBottom(ordinalScale);

const transition = selection =>
    selection
        .transition()
        .duration(1000)
        .ease(d3.easeLinear);

const d3LinearAxisJoin = fc.dataJoin('g', 'd3-axis-linear');
const fcLinearAxisJoin = fc.dataJoin('g', 'fc-axis-linear');

const d3OrdinalAxisJoin = fc.dataJoin('g', 'd3-axis-ordinal');
const fcOrdinalAxisJoin = fc.dataJoin('g', 'fc-axis-ordinal');

d3.select(container)
    .on('draw', () => {
        linearScale.domain([0, Math.random() * 200]);
        ordinalScale.domain(alphabet.filter(() => Math.random() < 0.8));

        const svg = d3.select(container).select('svg');

        transition(
            d3LinearAxisJoin(svg, d => [d]).attr(
                'transform',
                'translate(0, 50)'
            )
        ).call(d3LinearAxis);
        transition(
            fcLinearAxisJoin(svg, d => [d]).attr(
                'transform',
                'translate(0, 150)'
            )
        ).call(d3OrdinalAxis);
        transition(
            d3OrdinalAxisJoin(svg, d => [d]).attr(
                'transform',
                'translate(0, 250)'
            )
        ).call(fcLinearAxis);
        transition(
            fcOrdinalAxisJoin(svg, d => [d]).attr(
                'transform',
                'translate(0, 350)'
            )
        ).call(fcOrdinalAxis);
    })
    .on('measure', () => {
        const { width } = event.detail;
        linearScale.range([0, width]);
        ordinalScale.range([0, width]);
    });

container.requestRedraw();
setInterval(() => {
    container.requestRedraw();
}, 1100);
