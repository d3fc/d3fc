var financial = fc.data.random.financial()
  .startDate(new Date(2016, 0, 1))
  .startPrice(100)
  .granularity(60 * 60 * 24) // Period in seconds between dates, by default 86400 (1 day).
  .steps(10)                 // Steps provided to random.walk. Higher = slower, more accurate simulation.
  .mu(0.1)                   // Drift provided to random.walk (calendar year units)
  .sigma(0.1)                // Volatility provided to random.walk (calendar year units).
  .volume(100)               // Volume of each point. Can be either a number or function(datum).
  .filter(function(d) {      // Include points satisfying a condition, by default include all.
      return true;
  });


// generate some data!
var data = financial(2);

d3.select('#financial')
  .text(JSON.stringify(data, null, 2));
