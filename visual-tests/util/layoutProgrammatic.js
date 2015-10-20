(function(d3, fc) {
    'use strict';

    // programmatically mimicking the following structure:
    // http://www.scottlogic.com/blog/2015/02/02/svg-layout-flexbox.html

    /*
    <svg id="chart" style="height: 100%; width: 100%; margin: 10px">
      <g layout-style="height: 30; justifyContent: center; flexDirection: row">
      </g>
      <g layout-style="flex: 1; flexDirection: row; marginLeft: 20">
        <g layout-style="flex: 1;" class="plotArea"></g>
        <g layout-style="width: 50;" class="axis right"></g>
        <g layout-style="width: 30; justifyContent: center;">
        </g>
      </g>
      <g layout-style="height: 30; flexDirection: row">
        <g layout-style="flex: 1; marginRight: 80; marginLeft: 20" class="axis bottom">
        </g>
      </g>
      <g layout-style="height: 30; justifyContent: center; flexDirection: row">
      </g>
    </svg>
    */

    // Create the structure
    var svg = d3.select('#layout-programmatic')
        .append('svg')
        .style({
            'width': '800px',
            'height': '400px',
            'margin': '10px'
        });

    var rows = [
        svg.append('g')
            .layout({
                'height': 30,
                'justifyContent': 'center',
                'flexDirection': 'row'
            }),
        svg.append('g')
            .layout({
                'flex': 1,
                'flexDirection': 'row',
                'marginLeft': 20
            }),
        svg.append('g')
            .layout({
                'height': 30,
                'justifyContent': 'center',
                'flexDirection': 'row'
            })
    ];

    rows[1].append('g')
        .layout('flex', 1)
        .classed('plotArea', true);

    rows[1].append('g')
        .layout('width', 50)
        .classed('axis right', true);

    rows[1].append('g')
        .layout({
            'width': 30,
            'justifyContent': 'center'
        });

    // Perform the layout
    svg.layout();

    // add rect elements so that we can visualise the layout
    var c10 = d3.scale.category10();

    svg.selectAll('g').filter(function(d) {
        return this.childElementCount === 0;
    })
    .append('rect')
    .attr('stroke', function(d, i) { return c10(i); })
    .attr('fill', function(d, i) { return c10(i); })
    .attr('width', function() {
        return d3.select(this.parentNode).layout('width');
    })
    .attr('height', function() {
        return d3.select(this.parentNode).layout('height');
    });

})(d3, fc);
