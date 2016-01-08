var data = [
  {'State': 'AL', 'Under 5 Years': '310', '5 to 13 Years': '552', '14 to 17 Years': '259', '18 to 24 Years': '450', '25 to 44 Years': '1215', '45 to 64 Years': '641'},
  {'State': 'AK', 'Under 5 Years': '52', '5 to 13 Years': '85', '14 to 17 Years': '42', '18 to 24 Years': '74', '25 to 44 Years': '183', '45 to 64 Years': '50'},
  {'State': 'AZ', 'Under 5 Years': '515', '5 to 13 Years': '828', '14 to 17 Years': '362', '18 to 24 Years': '601', '25 to 44 Years': '1804', '45 to 64 Years': '1523'}
];

var spread = fc.data.spread()
    .xValueKey('State');

var series = spread(data);

d3.select('#spread-vertical')
    .text(JSON.stringify(series, null, 2));
