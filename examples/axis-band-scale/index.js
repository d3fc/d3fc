const container = document.querySelector('d3fc-svg');

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

d3.select(container)
    .on('draw', () => {
        const svg = d3.select(container).select('svg');
        svg.append('g')
            .attr('transform', 'translate(0, 20)')
            .call(d3.axisBottom(scale));
        svg.append('g')
            .attr('transform', 'translate(0, 50)')
            .call(fc.axisBottom(scale));
    })
    .on('measure', () => {
        const { width } = event.detail;
        scale.range([0, width]);
    });

container.requestRedraw();
