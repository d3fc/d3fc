var financial = fc.data.random.financial()
    .startDate(new Date(2016, 0, 1))
    .startPrice(100)
    .granularity(60 * 60 * 24);

var stream = financial.stream();
var data = [];

d3.select('#financial-stream-next').on('click', function() {
    data.push(stream.next());
    update();
});
d3.select('#financial-stream-take').on('click', function() {
    data = data.concat(stream.take(2));
    update();
});
d3.select('#financial-stream-until').on('click', function() {
    data = data.concat(stream.until(function(d) { return d.date >= new Date(2016, 0, 15); }));
    update();
});
d3.select('#financial-stream-reset').on('click', function() {
    reset();
    update();
});

function reset() {
    stream = financial.stream();
    data = [];
}

function update() {
    var text = 'data.length: ' + data.length + '\n';
    text += JSON.stringify(data, null, 2);
    d3.select('#financial-stream')
        .text(text);
}

update();
