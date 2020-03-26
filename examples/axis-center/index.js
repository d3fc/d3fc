const categories = [
    { text: 'Fruit', domain: ['Apples', 'Bananas'] },
    { text: 'Meat', domain: ['Sausages'] },
    { text: 'Drink', domain: ['Soda'] },
    { text: 'Vegetables', domain: ['Pickles', 'Aubergines'] }
];

const bandContainer = document.querySelector('#band-container');

const domain = categories.reduce((acc, curr) => [...acc, ...curr.domain], []);

const bandScale = d3.scaleBand().domain(domain);

const bandAxis = fc.axisOrdinalBottom(bandScale).tickPadding(5);

d3.select(bandContainer)
    .on('draw', () => {
        d3.select(bandContainer)
            .select('svg')
            .call(bandAxis);
    })
    .on('measure', () => {
        const { width } = event.detail;
        bandScale.range([0, width]);
    });

bandContainer.requestRedraw();

const categoryContainer = document.querySelector('#category-container');

const map = value => categories.find(m => m.text === value).domain;

const categorisedScale = () => {
    const customScale = value => {
        const values = map(value);
        return values.reduce((sum, d) => sum + bandScale(d), 0) / values.length;
    };
    customScale.ticks = () => categories.map(c => c.text);
    fc.rebindAll(customScale, bandScale, fc.exclude('ticks'));
    return customScale;
};

const categoryAxis = fc
    .axisOrdinalBottom(categorisedScale())
    .tickPadding(5)
    .tickOffset(d => (map(d).length * bandScale.step()) / 2);

d3.select(categoryContainer).on('draw', () => {
    d3.select(categoryContainer)
        .select('svg')
        .call(categoryAxis);
});

categoryContainer.requestRedraw();
