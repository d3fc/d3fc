/* global global, require, d3:true, fc:true */
var jsdom = require('jsdom');
var d3 = require('d3');
var fc = require('../..');

global.document = jsdom.jsdom();
global.d3 = d3;
global.fc = fc;

beforeEach(function () {
    this.utils = {
        // verifies that each time a property accessor is called that the first arg is a datapoint
        // from the given array of data, and that the second arg is an integer
        verifyAccessorCalls: function (spy, data) {
            spy.calls.all()
                .forEach(function (call, i) {
                    // check that the first argument is always an element from the data array
                    expect(data.indexOf(call.args[0])).not.toEqual(-1);
                    // check that the second argument is always an integer
                    expect(call.args[1]).toEqual(Math.round(call.args[1]));
                });
        }
    };
});
