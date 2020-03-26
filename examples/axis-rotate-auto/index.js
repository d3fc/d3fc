const width = 400;
const height = 80;
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
    ])
    .range([margin, width - 40 - margin]);

const draw = () => {
    const groupRect = d3
        .select('.ordinal-group')
        .node()
        .getBoundingClientRect();
    const groupSize = {
        width: Math.max(50, groupRect.width - 2 * height),
        height: Math.max(50, groupRect.height - 2 * height)
    };

    const renderAxis = (target, axis) => {
        const side = target.attr('class');
        const vertical = side === 'left' || side === 'right';

        scale.range([0, vertical ? groupSize.height : groupSize.width]);

        target
            .attr('width', `${vertical ? height : groupSize.width}px`)
            .attr('height', `${vertical ? groupSize.height : height}px`);

        let axisElement = target.select('g');
        if (!axisElement.size()) axisElement = target.append('g');

        axisElement
            .attr('transform', () => {
                if (side === 'top') return `translate(0, ${height})`;
                if (side === 'left') return `translate(${height}, 0)`;
            })
            .call(axis);
    };

    renderAxis(
        d3.select('#topAuto'),
        fc.axisLabelRotate(fc.axisOrdinalTop(scale))
    );

    renderAxis(
        d3.select('#bottomAuto'),
        fc.axisLabelRotate(fc.axisOrdinalBottom(scale))
    );

    renderAxis(
        d3.select('#leftAuto'),
        fc.axisLabelRotate(fc.axisOrdinalLeft(scale))
    );

    renderAxis(
        d3.select('#rightAuto'),
        fc.axisLabelRotate(fc.axisOrdinalRight(scale))
    );

    renderAxis(
        d3.select('#topFixed'),
        fc.axisLabelRotate(fc.axisOrdinalTop(scale)).labelRotate(30)
    );

    renderAxis(
        d3.select('#bottomFixed'),
        fc.axisLabelRotate(fc.axisOrdinalBottom(scale)).labelRotate(30)
    );

    renderAxis(
        d3.select('#leftFixed'),
        fc.axisLabelRotate(fc.axisOrdinalLeft(scale)).labelRotate(30)
    );

    renderAxis(
        d3.select('#rightFixed'),
        fc.axisLabelRotate(fc.axisOrdinalRight(scale)).labelRotate(30)
    );
};

draw();
window.addEventListener('resize', () => draw());
