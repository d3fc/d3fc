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
        .style('text-anchor', 'start')
        .attr('transform', 'rotate(45 -10 10)');
});

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .append('g')
            .attr('transform', 'translate(0, 10)')
            .call(axis);
    })
    .on('measure', () => {
        const { width } = event.detail;
        scale.range([margin, width - 40 - margin]);
    });

container.requestRedraw();
