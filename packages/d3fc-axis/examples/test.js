const width = 500;

function bandScale() {
    const bandScale = d3.scaleBand()
        .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber'])
        .range([0, width]);

    const svg = d3.select('body').append('svg')
        .attr('width', width + 10)
        .attr('height', 200);
    svg.append('text')
        .attr('transform', 'translate(0, 15)')
        .text('Band scale');
    svg.append('g')
        .attr('transform', 'translate(0, 20)')
        .call(d3.axisBottom(bandScale));
    svg.append('g')
        .attr('transform', 'translate(0, 50)')
        .call(fc.axisBottom(bandScale));
}

function linearScale() {
    const scale = d3.scaleLinear()
        .domain([0, 10000])
        .range([0, width]);

    const svg = d3.select('body').append('svg')
        .attr('width', width + 10)
        .attr('height', 200);
    svg.append('text')
        .attr('transform', 'translate(0, 15)')
        .text('Linear scale - and testing the various tick arguments');

    svg.append('g')
        .attr('transform', 'translate(0, 20)')
        .call(d3.axisBottom(scale).tickPadding(2).ticks(5, 's'));
    svg.append('g')
        .attr('transform', 'translate(0, 50)')
        .call(fc.axisBottom(scale).tickPadding(2).ticks(5, 's'));

    svg.append('g')
        .attr('transform', 'translate(0, 80)')
        .call(d3.axisBottom(scale).tickSizeInner(2).tickArguments([20, 's']));
    svg.append('g')
        .attr('transform', 'translate(0, 110)')
        .call(fc.axisBottom(scale).tickSizeInner(2).tickArguments([20, 's']));

    svg.append('g')
        .attr('transform', 'translate(0, 140)')
        .call(d3.axisBottom(scale).tickFormat(d3.format(',.0f')));
    svg.append('g')
        .attr('transform', 'translate(0, 170)')
        .call(fc.axisBottom(scale).tickFormat(d3.format(',.0f')));
}

bandScale();
linearScale();
