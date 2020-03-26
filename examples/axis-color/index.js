const container = document.querySelector('d3fc-svg');
const margin = 10;

const scale = d3
    .scaleLinear()
    .domain([0, 140])
    .nice();

const axis = fc.axisBottom(scale).decorate(s => {
    s.enter()
        .select('text')
        .style('fill', d => (d >= 100 ? 'red' : 'black'));
});

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .call(axis);
    })
    .on('measure', () => {
        const { width } = event.detail;
        scale.range([margin, width - margin]);
    });

container.requestRedraw();
