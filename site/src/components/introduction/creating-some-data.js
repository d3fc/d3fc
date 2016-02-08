// a random number generator
var generator = fc.data.random.walk()
    .steps(11);

// some formatters
var dateFormatter = d3.time.format('%b');

// randomly generated sales data starting at one
var data = generator(1).map(function(d, i) {
    return {
        month: dateFormatter(new Date(0, i + 1, 0)),
        sales: d + i / 2
    };
});

// let's see what the data looks like
d3.select('#sales-data')
    .text(JSON.stringify(data.slice(0, 3), null, 2));
