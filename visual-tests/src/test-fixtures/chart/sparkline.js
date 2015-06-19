(function(d3, fc) {
    'use strict';


    d3.selectAll('.sparkline')
        .each(function() {
            var sparkline = d3.select(this);

            // typically at this point you would fetch or look-up the
            // data for the specific sparkline - here we use dummy data instead

            // var stock = sparkline.attr('data-ticker');
            var data = fc.dataGenerator()(50);

            var chart = fc.charts.sparkline()
                .xDomain(fc.util.extent(data, 'date'))
                .yDomain(fc.util.extent(data, 'low'))
                .radius(2)
                .yValue(function(d) { return d.low; });

            sparkline
                .append('svg')
                .style({
                    height: '15px',
                    width: '80px'
                })
                .datum(data)
                .call(chart);
        });


})(d3, fc);
