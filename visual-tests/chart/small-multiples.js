(function(d3, fc) {
    'use strict';

    var defaultMultiple = fc.chart.smallMultiples();

    var chartConfig = [
        {label: 'padding', value: defaultMultiple.padding()},
        {label: 'margin', value: JSON.stringify(defaultMultiple.margin())},
        {label: 'columns', value: defaultMultiple.columns()},
        {label: 'y orient', value: defaultMultiple.yOrient()},
        {label: 'x orient', value: defaultMultiple.xOrient()},
        {label: 'dataset', value: 'bottom', type: 'checkbox'}
    ];

    var temperatureSeries, populationSeries;

    var container = d3.select('#small-multiples');

    renderControls();

    function render() {
        renderControls();
        renderChart();
    }

    function updateModel(d) {
        d.value = this.type === 'checkbox' ? this.checked : this.value;
        renderChart();
    }

    function renderControls() {
        var container = d3.select('#controls');

        var yOrientationConfig = container.selectAll('tr')
            .data(chartConfig);

        var row = yOrientationConfig.enter()
            .append('tr');

        row.append('th')
            .append('span')
            .html(function(d) { return d.label; });

        row.append('td')
            .append('input')
            .attr('type', function(d) { return d.type || 'text'; })
            .on('blur', updateModel)
            .on('click', updateModel);

        yOrientationConfig.select('input')
            .attr('value', function(d) { return d.value; });
    }

    function renderChart() {
        var smallMultiples;
        container.selectAll('*').remove();
        if (chartConfig[5].value) {
            renderTemperatureChart();
        } else {
            renderPopulationChart();
        }
    }

    function renderPopulationChart() {
        if (!populationSeries) {
            return;
        }

        var bar = fc.series.bar()
            .orient('horizontal')
            .barWidth(fc.util.fractionalBarWidth(1))
            .xValue(function(d) { return d.y; })
            .yValue(function(d) { return d.x; });

        var smallMultiples = fc.chart.smallMultiples(
                d3.scale.linear(),
                d3.scale.ordinal())
            .padding(Number(chartConfig[0].value))
            .margin(JSON.parse(chartConfig[1].value))
            .columns(Number(chartConfig[2].value))
            .yOrient(chartConfig[3].value)
            .xOrient(chartConfig[4].value)
            .plotArea(bar)
            .xDomain(fc.util.extent(populationSeries.map(function(d) { return d.values; }), function() { return 0;}, 'y'))
            .yDomain(populationSeries[0].values.map(function(d) { return d.x; }));

        container.datum(populationSeries)
            .call(smallMultiples);
    }

    function renderTemperatureChart() {
        if (!temperatureSeries) {
            return;
        }

        var stationLine = fc.series.line()
            .xValue(function(d) { return d.MonthName; })
            .yValue(function(d) { return d.Station; });

        var landOceanLine = fc.series.line()
            .xValue(function(d) { return d.MonthName; })
            .yValue(function(d) { return d['Land+Ocean']; });

        var multi = fc.series.multi()
            .series([landOceanLine, stationLine]);

        var xDomain = temperatureSeries[0].values.map(function(d) { return d.MonthName; });
        var yDomain = fc.util.extent(temperatureSeries.map(function(d) { return d.values; }), function() { return 0;}, 'Station');

        var smallMultiples = fc.chart.smallMultiples(
                d3.scale.ordinal(),
                d3.scale.linear())
            .padding(Number(chartConfig[0].value))
            .margin(JSON.parse(chartConfig[1].value))
            .columns(Number(chartConfig[2].value))
            .yOrient(chartConfig[3].value)
            .xOrient(chartConfig[4].value)
            .xTickValues(xDomain.filter(function(d, i) { return (i % 3) === 0; }))
            .plotArea(multi)
            .yDomain(yDomain)
            .xDomain(xDomain);

        container.datum(temperatureSeries)
            .call(smallMultiples);
    }

    d3.csv('../series/stackedBarData.csv', function(error, data) {

        var spread = fc.data.spread()
            .orient('horizontal')
            .xValueKey('State')
            .yValue(function(row, key) {
                return Number(row[key]) / 100000;
            });
        populationSeries = spread(data);

        renderChart();
    });

    d3.csv('../series/cycle-nasa-temp-data.csv', function(error, nasa) {
        var monthFormat = d3.time.format('%b');
        nasa.forEach(function(d) {
            d.MonthName = monthFormat(new Date(2015, d.Month - 1, 1));
        });
        var nest = d3.nest()
            .key(function(d) { return d.Year; });

        temperatureSeries = nest.entries(nasa);
        renderChart();
    });

})(d3, fc);
