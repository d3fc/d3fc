const container = document.querySelector('d3fc-svg');
const margin = 10;

const scale = d3
    .scaleBand()
    .domain([
        'Carrots',
        'Bananas',
        'Sausages',
        'Pickles',
        'Aubergines',
        'Artichokes',
        'Spinach',
        'Cucumber'
    ]);

const axis = fc.axisBottom(scale).decorate(s => {
    s.enter()
        .select('text')
        .attr('transform', (_, i) => `translate(0, ${i % 2 === 0 ? 20 : 10})`);
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
