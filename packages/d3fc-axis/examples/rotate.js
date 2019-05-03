var width = 400;
var height = 80;
var margin = 10;

var foodScale = d3.scaleBand()
    .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber'])
    .range([margin, width - 40 - margin]);

// Decorate

var axis = fc.axisBottom(foodScale)
    .decorate(function(s) {
        s.enter().select('text')
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(45 -10 10)');
    });

var svg = d3.select('#decorateRotate').attr('width', width).attr('height', height);
svg.append('g')
    .attr('transform', 'translate(0, 10)')
    .call(axis);

// Auto
const draw = () => {
    const groupRect = d3.select('.ordinal-group').node().getBoundingClientRect();
    const groupSize = {
        width: Math.max(50, groupRect.width - 2 * height),
        height: Math.max(50, groupRect.height - 2 * height)
    };

    const renderAxis = (target, axis) => {
        const side = target.attr('class');
        const vertical = side === 'left' || side === 'right';

        foodScale.range([0, vertical ? groupSize.height : groupSize.width]);

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

    renderAxis(d3.select('#topAuto'),
        fc.axisLabelRotate(fc.axisOrdinalTop(foodScale))
    );

    renderAxis(d3.select('#bottomAuto'),
        fc.axisLabelRotate(fc.axisOrdinalBottom(foodScale))
    );

    renderAxis(d3.select('#leftAuto'),
        fc.axisLabelRotate(fc.axisOrdinalLeft(foodScale))
    );

    renderAxis(d3.select('#rightAuto'),
        fc.axisLabelRotate(fc.axisOrdinalRight(foodScale))
    );

    renderAxis(d3.select('#topFixed'),
        fc.axisLabelRotate(fc.axisOrdinalTop(foodScale)).labelRotate(30)
    );

    renderAxis(d3.select('#bottomFixed'),
        fc.axisLabelRotate(fc.axisOrdinalBottom(foodScale)).labelRotate(30)
    );

    renderAxis(d3.select('#leftFixed'),
        fc.axisLabelRotate(fc.axisOrdinalLeft(foodScale)).labelRotate(30)
    );

    renderAxis(d3.select('#rightFixed'),
        fc.axisLabelRotate(fc.axisOrdinalRight(foodScale)).labelRotate(30)
    );
};

draw();
window.addEventListener('resize', () => draw());
