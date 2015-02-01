(function(d3, fc) {
    'use strict';

    fc.utilities.fn = {
        identity: function(d) { return d; },
        index: function(d, i) { return i; },
        noop: function(d) {  }
    };
}(d3, fc));