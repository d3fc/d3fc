var width = 400;
var height = 20;

var categories = [
    { text: 'Fruit', domain: ['Apples', 'Bananas'] },
    { text: 'Meat', domain: ['Sausages'] },
    { text: 'Drink', domain: ['Soda'] },
    { text: 'Vegetables', domain: ['Pickles', 'Aubergines'] }
];
var domain = [].concat.apply([], categories.map(c => c.domain));
var map = value => categories.find(m => m.text === value).domain;

var scale = d3.scaleBand()
    .domain(domain)
    .range([0, width - 0]);

function center() {
    var axis = fc.axisOrdinalBottom(scale)
        .tickPadding(5);

    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);
    svg.append('g')
        .call(axis);
}

function categorisedScale() {
    function customScale(value) {
        const values = map(value);
        return values.reduce((sum, d) => sum + scale(d), 0) / values.length;
    }
    customScale.ticks = () => categories.map(c => c.text);
    fc.rebindAll(customScale, scale, fc.exclude('ticks'));
    return customScale;
}

function custom() {
    var axis = fc.axisOrdinalBottom(categorisedScale())
        .tickPadding(5)
        .tickOffset(d => map(d).length * scale.step() / 2);

    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);
    svg.append('g')
        .call(axis);
}

center();
custom();
