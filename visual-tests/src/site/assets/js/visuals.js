(function(d3) {
    'use strict';

    var tests = d3.select('#tests')
        .selectAll('.test-fixture')
        .datum(function() { return this.dataset; });

    // When an iframe is loaded, hide the loading message and automatically adjust its height for its content
    tests.selectAll('.panel-body').select('iframe').on('load', function() {
        d3.select(this.parentNode)
            .select('.loading-message')
            .style('display', 'none');
        var newHeight = this.contentWindow.document.body.scrollHeight;
        if (newHeight < 1) {
            newHeight = 200;
        }
        d3.select(this).attr('height', newHeight + 'px');
    });

    var showTestVisuals = function() {
        tests.each(function(d) {
            var test = d3.select(this);
            test.select('.loading-message')
                .style('display', 'block');
            test.select('iframe')
                .attr('height', 0)
                .style('display', 'block')
                .attr('src', d.visuals);
        });
    };

    var hideTestVisuals = function() {
        tests.each(function() {
            var test = d3.select(this);
            test.select('iframe')
                .style('display', 'none')
                .attr('src', 'about:blank');
        });
    };

    // Use local storage to track if the iframes should be shown
    var visualsDisplay = localStorage.getItem('visuals-display');
    if (visualsDisplay === null) {
        localStorage.setItem('visuals-display', 'true');
        visualsDisplay = 'true';
    }

    // Init checkbox and iframes
    var visualsCheckbox = d3.select('#visuals-toggle-check');
    if (visualsDisplay === 'true') {
        showTestVisuals();
        visualsCheckbox.property('checked', 'checked');
    } else {
        hideTestVisuals();
        visualsCheckbox.property('checked', '');
    }

    // Allow the test visuals to be toggled on/off
    visualsCheckbox.on('change', function() {
        var show = this.checked ? 'true' : 'false';
        localStorage.setItem('visuals-display', show);
        if (show === 'true') {
            showTestVisuals();
        } else {
            hideTestVisuals();
        }
    });

    // Only show the option to toggle the iframes display when this script has loaded
    d3.select('#visuals-toggle').style('visibility', 'visible');

}(d3));
