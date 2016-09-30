var data = [{
  'date': '20130603',
  'sales': 41
}, {
  'date': '20130604',
  'sales': 70
}, {
  'date': '20130605',
  'sales': 84
}, {
  'date': '20130606',
  'sales': 63
}, {
  'date': '20130607',
  'sales': 63
}, {
  'date': '20130608',
  'sales': 32
}, {
  'date': '20130609',
  'sales': 34
}, {
  'date': '20130610',
  'sales': 46
}, {
  'date': '20130611',
  'sales': 68
}, {
  'date': '20130612',
  'sales': 84
}, {
  'date': '20130613',
  'sales': 61
}, {
  'date': '20130614',
  'sales': 61
}, {
  'date': '20130615',
  'sales': 34
}, {
  'date': '20130616',
  'sales': 32
}, {
  'date': '20130617',
  'sales': 48
}, {
  'date': '20130618',
  'sales': 66
}, {
  'date': '20130619',
  'sales': 86
}, {
  'date': '20130620',
  'sales': 65
}, {
  'date': '20130621',
  'sales': 65
}, {
  'date': '20130622',
  'sales': 37
}, {
  'date': '20130623',
  'sales': 35
}, {
  'date': '20130624',
  'sales': 49
}, {
  'date': '20130625',
  'sales': 65
}, {
  'date': '20130626',
  'sales': 89
}, {
  'date': '20130627',
  'sales': 60
}, {
  'date': '20130628',
  'sales': 63
}, {
  'date': '20130629',
  'sales': 39
}, {
  'date': '20130630',
  'sales': 32
}, {
  'date': '20130701',
  'sales': 54
}, {
  'date': '20130702',
  'sales': 64
}, {
  'date': '20130703',
  'sales': 92
}, {
  'date': '20130704',
  'sales': 66
}, {
  'date': '20130705',
  'sales': 59
}, {
  'date': '20130706',
  'sales': 33
}, {
  'date': '20130707',
  'sales': 34
}, {
  'date': '20130708',
  'sales': 56
}, {
  'date': '20130709',
  'sales': 63
}, {
  'date': '20130710',
  'sales': 95
}, {
  'date': '20130711',
  'sales': 60
}, {
  'date': '20130712',
  'sales': 66
}, {
  'date': '20130713',
  'sales': 34
}, {
  'date': '20130714',
  'sales': 37
}, {
  'date': '20130715',
  'sales': 62
}, {
  'date': '20130716',
  'sales': 58
}, {
  'date': '20130717',
  'sales': 104
}, {
  'date': '20130718',
  'sales': 65
}, {
  'date': '20130719',
  'sales': 65
}, {
  'date': '20130720',
  'sales': 37
}, {
  'date': '20130721',
  'sales': 33
}, {
  'date': '20130722',
  'sales': 70
}, {
  'date': '20130723',
  'sales': 57
}, {
  'date': '20130724',
  'sales': 112
}, {
  'date': '20130725',
  'sales': 64
}, {
  'date': '20130726',
  'sales': 63
}, {
  'date': '20130727',
  'sales': 34
}, {
  'date': '20130728',
  'sales': 34
}];

var parseDate = d3.time.format('%Y%m%d').parse;
data.forEach(function(d) {
  d.date = parseDate(d.date);
});

// START
// data is an array of objects with 'date' and 'sales' properties

var lineSeries = fc.series.line()
    .xValue(function(d) { return d.date; })
    .yValue(function(d) { return d.sales; });

var smallMultiples = fc.chart.smallMultiples(
        d3.time.scale(),
        d3.scale.linear())
    .yDomain(fc.util.extent().fields([function() { return 0; }, 'sales'])(data))
    .yNice()
    .xDomain(fc.util.extent().fields(['date'])(data))
    .xTicks(0)
    .margin({right: 30})
    .columns(7)
    .plotArea(lineSeries);

var nestedData = d3.nest()
    .key(function(d) { return d3.time.format('%A')(d.date); })
    .entries(data);

d3.select('#sales-multiples')
    .datum(nestedData)
    .call(smallMultiples);
// END
