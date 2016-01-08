var feed = fc.data.feed.coinbase();

// fetch some data!
feed(function(error, data) {
  d3.select("#coinbase")
    .text(JSON.stringify(error ? error : data, null, 2));
});
