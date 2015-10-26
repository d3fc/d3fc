(function (d3) {
    'use strict';

    var tests = d3.selectAll('article')
        .datum(function () {
            return this.dataset;
        });

    var seed = location.search.split('seed=')[1];
    if (seed) {
        // Sets Math.random to a PRNG initialised using the explicit seed
        Math.seedrandom(seed);
        // Update the links to the test fixtures to include the seed
        tests.each(function (d) {
            d.href += '?seed=' + seed;
        });
    }

    tests.select('h3')
      .text(function () { return d3.select(this).text(); })
      .append('a')
      .attr('href', function (d) { return d.href; })
      .append('span')
      .attr('class', 'glyphicon glyphicon-new-window')
      .style('padding-left', '10px');

    tests.append('iframe')
      .attr('src', function (d) { return d.href; })
      .on('load', function () {
          var newHeight = this.contentWindow.document.body.scrollHeight;
          if (newHeight < 1) {
              newHeight = 200;
          }
          d3.select(this)
            .attr('height', newHeight + 'px');
      });

}(d3));
