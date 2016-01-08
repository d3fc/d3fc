var dataGenerator = fc.data.random.walk()
  .period(2)   // Projection period, by default = 1
  .steps(30)   // Number of points to generate, by default = 20
  .mu(0.3)     // Drift component, by default = 0.1
  .sigma(0.2); // Volatility, by default = 0.1

// data is generated here
var data = dataGenerator(100); // The series starts at 100

d3.select("#walk")
  .text(JSON.stringify(data, null, 2));
