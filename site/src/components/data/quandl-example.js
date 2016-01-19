var feed = fc.data.feed.quandl()
  .database('WIKI')
  .dataset('AAPL')
  .rows(10)
  .descending(true)
  .collapse('weekly');

// fetch some data!
feed(function(error, data) {
    d3.select('#quandl')
      .text(JSON.stringify(error ? error : data, null, 2));
});
