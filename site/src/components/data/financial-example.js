var financial = fc.data.random.financial()
  .startDate(new Date(2016, 0, 1))
  .startPrice(100)
  .interval(d3.time.day)     // d3 time interval function, d3.time.day by default.
  .intervalStep(1)           // Integer number of intervals that points should have dates offset by. Default 1.
  .steps(10)                 // Steps provided to random.walk. Higher = slower, more accurate simulation.
  .mu(0.1)                   // Drift provided to random.walk.
  .sigma(0.1)                // Volatility provided to random.walk.
  .unitInterval(d3.time.day) // Unit choice for mu and sigma (d3 time interval). d3.time.year by default.
  .unitIntervalStep(252)     // Unit choice for mu and sigma (integer number of intervals), by default 1.
  .volume(100)               // Volume of each point. Can be either a number or function(datum).
  .filter(function(d) {      // Include points satisfying a condition, by default include all.
      return true;
  });


// generate some data!
var data = financial(2);

d3.select('#financial')
  .text(JSON.stringify(data, null, 2));
