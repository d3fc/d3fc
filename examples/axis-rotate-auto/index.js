const domain = [
    'Carrots',
    'Bananas',
    'Sausages',
    'Pickles',
    'Aubergines',
    'Artichokes',
    'Spinach',
    'Cucumber'
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
            const side = container.getAttribute('class');

            const vertical = side === 'left' || side === 'right';
            scale.range([0, vertical ? height : width]);

            const topOffset = side === 'top' ? 80 : 0;
            const leftOffset = side === 'left' ? 80 : 0;

            d3.select(container)
                .select('svg')
                .attr(
                    'viewBox',
                    `${-leftOffset} ${-topOffset} ${width} ${height}`
                );
        });
    container.requestRedraw();
};

renderAxis(scale => fc.axisLabelRotate(fc.axisOrdinalTop(scale)), '#topAuto');
renderAxis(
    scale => fc.axisLabelRotate(fc.axisOrdinalBottom(scale)),
    '#bottomAuto'
);
renderAxis(scale => fc.axisLabelRotate(fc.axisOrdinalLeft(scale)), '#leftAuto');
renderAxis(
    scale => fc.axisLabelRotate(fc.axisOrdinalRight(scale)),
    '#rightAuto'
);

renderAxis(
    scale => fc.axisLabelRotate(fc.axisOrdinalTop(scale)).labelRotate(30),
    '#topFixed'
);
renderAxis(
    scale => fc.axisLabelRotate(fc.axisOrdinalBottom(scale)).labelRotate(30),
    '#bottomFixed'
);
renderAxis(
    scale => fc.axisLabelRotate(fc.axisOrdinalLeft(scale)).labelRotate(30),
    '#leftFixed'
);
renderAxis(
    scale => fc.axisLabelRotate(fc.axisOrdinalRight(scale)).labelRotate(30),
    '#rightFixed'
);
