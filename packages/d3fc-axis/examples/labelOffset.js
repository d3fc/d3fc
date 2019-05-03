
const draw = () => {
    const renderAxis = (axisFactory, selector, transform) => {
        const hostElement = d3.select(selector).node();
        const groupRect = hostElement.getBoundingClientRect();

        const scale = d3.scaleBand()
            .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber', 'Beef', 'Fish', 'Potato', 'Avacado', 'Cheese', 'Marzipan', 'Peas', 'Popcorn'])
            .range([0, hostElement.getAttribute('data-orient') === 'vertical' ? groupRect.height : groupRect.width]);

        const axis = axisFactory(scale);

        const join = fc.dataJoin('g', 'axis');
        join(d3.select(selector), [{}])
            .attr('transform', transform)
            .call(axis);
    };

    renderAxis(scale => fc.axisLabelOffset(fc.axisBottom(scale)), '#bottom svg', '');
    renderAxis(scale => fc.axisLabelOffset(fc.axisTop(scale)), '#top svg', 'translate(0, 80)');
    renderAxis(scale => fc.axisLabelOffset(fc.axisLeft(scale)), '#left svg', 'translate(160, 0)');
    renderAxis(scale => fc.axisLabelOffset(fc.axisRight(scale)), '#right svg', 'translate(0, 0)');
};

draw();
window.addEventListener('resize', () => draw());
