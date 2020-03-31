const domain = [
    'Carrots',
    'Bananas',
    'Sausages',
    'Pickles',
    'Aubergines',
    'Artichokes',
    'Spinach',
    'Cucumber',
    'Beef',
    'Fish',
    'Potato',
    'Avacado',
    'Cheese',
    'Marzipan',
    'Peas',
    'Popcorn'
];

const renderAxis = (axisFactory, selector) => {
    const container = document.querySelector(selector);

    const scale = d3.scaleBand().domain(domain);
    const axis = axisFactory(scale);

    d3.select(container)
        .on('draw', () => {
            d3.select(container)
                .select('svg')
                .call(axis);
        })
        .on('measure', () => {
            const { width, height } = event.detail;
            scale.range([
                0,
                container.getAttribute('data-orient') === 'vertical'
                    ? height
                    : width
            ]);

            const containerId = container.getAttribute('id');
            const topOffset = containerId === 'top' ? 80 : 0;
            const leftOffset = containerId === 'left' ? 160 : 0;

            d3.select(container)
                .select('svg')
                .attr(
                    'viewBox',
                    `${-leftOffset} ${-topOffset} ${width} ${height}`
                );
        });
    container.requestRedraw();
};

renderAxis(scale => fc.axisLabelOffset(fc.axisBottom(scale)), '#bottom');
renderAxis(scale => fc.axisLabelOffset(fc.axisTop(scale)), '#top');
renderAxis(scale => fc.axisLabelOffset(fc.axisLeft(scale)), '#left');
renderAxis(scale => fc.axisLabelOffset(fc.axisRight(scale)), '#right');
