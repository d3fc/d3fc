var dataGenerator = fc.data.random.financial();

// generate some data!
var data = dataGenerator(5);

d3.select('#financial')
  .text(JSON.stringify(data, null, 2));
