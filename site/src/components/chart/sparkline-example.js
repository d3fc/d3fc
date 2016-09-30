d3.selectAll('.sparkline')
    .each(function() {
      var sparkline = d3.select(this);

        // typically at this point you would fetch or look-up the
        // data for the specific sparkline - here we use dummy data instead

        // var stock = sparkline.attr('data-ticker');
      var data = fc.data.random.financial()(50);

      var chart = fc.chart.sparkline()
            .xDomain(fc.util.extent().fields(['date'])(data))
            .yDomain(fc.util.extent().fields(['low'])(data))
            .radius(2)
            .xValue(function(d) { return d.date; })
            .yValue(function(d) { return d.low; });

      sparkline
            .append('svg')
            .style({
              height: '15px',
              width: '80px',
              display: 'inline'
            })
            .datum(data)
            .call(chart);
    });
