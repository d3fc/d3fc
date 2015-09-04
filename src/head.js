(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['d3', 'css-layout'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('d3'), require('css-layout'));
    } else {
        root.fc = factory(root.d3, root.computeLayout);
    }
}(this, function (d3, computeLayout) {
  'use strict';

  // Needs to be defined like this so that the grunt task can update it
  var version = 'development';

  var fc = {
      annotation: {},
      chart: {},
      data: {
          feed: {},
          random: {}
      },
      indicator: {
          algorithm: {
              calculator: {}
          },
          renderer: {}
      },
      scale: {
          discontinuity: {}
      },
      series: {
          stacked: {}
      },
      svg: {},
      tool: {},
      util: {},
      version: version
  };
