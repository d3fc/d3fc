(function (d3, fc) {
    'use strict';

    function renderLegendTwo() {
        var series = ['Under 5 Years', '5 to 13 Years', '14 to 17 Years',
            '18 to 24 Years', '25 to 44 Years', '45 to 64 Years', '65 Years'];

        var color = d3.scale.category10();

        function swatch(i) {
            return '<span class="swatch" style="background-color: ' +
                color(i) + '">&nbsp;</span>';
        }

        var legend = fc.chart.legend()
            .items(series.map(function (d, i) {
                return [swatch(i), d];
            }));

        d3.select('#legend2')
            .data([0])
            .call(legend);
    }

    function renderLegendOne() {

        var datum = {
            close: 45.67,
            open: 45.67,
            high: 45.67,
            low: 45.67
        };

        var priceFormat = d3.format('.2f');
        var legend = fc.chart.legend()
            .items([
                ['open', function (d) { return priceFormat(d.open); }],
                ['high', function (d) { return priceFormat(d.high); }],
                ['low', function (d) { return priceFormat(d.low); }],
                ['close', function (d) { return priceFormat(d.close); }]
            ])
            .rowDecorate(function (sel) {
                sel.select('td')
                    .style('color', function (d, i) {
                        return (d.datum.close - Math.floor(d.datum.close)) > 0.5 ? 'green' : 'red';
                    });
            })
            .tableDecorate(function (sel) {
                sel.enter()
                    .insert('tr', ':first-child')
                    .append('th')
                    .attr('colspan', 2)
                    .text('I am Legend');
            });

        function renderLegend() {
            function updateField(datum, fieldName) {
                datum[fieldName] = datum[fieldName] + Math.random() * 4 - 2;
            }
            updateField(datum, 'open');
            updateField(datum, 'close');
            updateField(datum, 'high');
            updateField(datum, 'low');

            d3.select('#legend')
                .data([datum])
                .call(legend);
        }

        renderLegend();
        setInterval(function () {
            renderLegend();
        }, 1000);
    }

    renderLegendOne();
    renderLegendTwo();
})(d3, fc);
