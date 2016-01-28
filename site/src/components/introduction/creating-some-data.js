// a random number generator
var generator = fc.data.random.walk()
    .steps(11);

// some formaters
var valueformatter = d3.format('$f');
var dateFormatter = d3.time.format('%b');

// randomly generated sales data
var data = generator(5).map(function(d, i) {
    return {
        month: dateFormatter(new Date(0, i + 1, 0)),
        sales: d + i / 2
    };
});

// render some point
d3.select('#sales-data')
    .text(JSON.stringify(data.slice(0, 3), null, 2));
