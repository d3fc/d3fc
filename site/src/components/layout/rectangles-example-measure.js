var data = [
    {
        'language': 'JavaScript',
        'orgs': 500,
        'users': 1119
    },
    {
        'language': 'Java',
        'orgs': 240,
        'users': 899
    },
    {
        'language': 'Python',
        'orgs': 151,
        'users': 402
    },
    {
        'language': 'Objective-C',
        'orgs': 99,
        'users': 508
    },
    {
        'language': 'Swift',
        'orgs': 100,
        'users': 383
    },
    {
        'language': 'Go',
        'orgs': 157,
        'users': 248
    },
    {
        'language': 'PHP',
        'orgs': 96,
        'users': 137
    },
    {
        'language': 'HTML',
        'orgs': 70,
        'users': 124
    },
    {
        'language': 'CSS',
        'orgs': 63,
        'users': 132
    },
    {
        'language': 'Ruby',
        'orgs': 67,
        'users': 96
    },
    {
        'language': 'C++',
        'orgs': 124,
        'users': 107
    },
    {
        'language': 'C',
        'orgs': 76,
        'users': 136
    },
    {
        'language': 'C#',
        'orgs': 78,
        'users': 64
    },
    {
        'language': 'Shell',
        'orgs': 36,
        'users': 94
    },
    {
        'language': 'Scala',
        'orgs': 23,
        'users': 25
    },
    {
        'language': 'Clojure',
        'orgs': 9,
        'users': 24
    },
    {
        'language': 'Haskell',
        'orgs': 8,
        'users': 16
    },
    {
        'language': 'CoffeeScript',
        'orgs': 11,
        'users': 21
    },
    {
        'language': 'Lua',
        'orgs': 10,
        'users': 19
    },
    {
        'language': 'R',
        'orgs': 1,
        'users': 6
    },
    {
        'language': 'VimL',
        'orgs': 4,
        'users': 20
    },
    {
        'language': 'Perl',
        'orgs': 1,
        'users': 5
    }
];

//START
var labelPadding = 2;

// the container component is used to add padding around a text label
var label = fc.tool.container()
    .padding(labelPadding)
    .component(function(sel) {
        // rather than using a component, a text element is appended directly
        sel.append('text')
            .text(function(d) { return d.language; })
            .attr('dy', '0.7em');
    });

var yScale = d3.scale.linear(),
    xScale = d3.scale.linear();

var chart = fc.chart.cartesian(
              xScale,
              yScale)
    .yDomain(fc.util.extent().pad(0.2).fields('users')(data))
    .xDomain(fc.util.extent().pad(0.2).fields('orgs')(data))
    .xLabel('GitHub Organizations')
    .yLabel('GitHub Users')
    .chartLabel('GitHub User to Organization Ratio')
    .margin({right: 50, bottom: 50, top: 30})
    .plotArea(multi);

// construct a strategy that uses the 'greedy' algorithm for layout, wrapped
// by a strategy that removes overlapping rectangles.
var strategy = fc.layout.strategy.removeOverlaps(fc.layout.strategy.greedy());

// create the layout that positions the labels
var labels = fc.layout.rectangles(strategy)
        .size(function(d) {
            // measure the label and add the required padding
            var textSize = d3.select(this)
                    .select('text')
                    .node()
                    .getBBox();
            return [textSize.width + labelPadding * 2, textSize.height + labelPadding * 2];
        })
        .position(function(d) { return [xScale(d.orgs), yScale(d.users)]; })
        .component(label);

// render them together with a point series
var points = fc.series.point()
    .size(12)
    .xValue(function(d) { return d.orgs; })
    .yValue(function(d) { return d.users; });
var multi = fc.series.multi()
        .series([labels, points]);

chart.plotArea(multi);

// bind the data and render
d3.select('#rectangles-measure')
    .datum(data)
    .call(chart);
//END
