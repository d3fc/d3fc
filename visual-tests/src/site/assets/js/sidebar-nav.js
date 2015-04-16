/* global $ */
(function($) {
    'use strict';

    $('body').scrollspy({
        target: '.sidebar-nav'
    });

    $('window').on('load', function() {
        $('body').scrollspy('refresh');
    });

    $('.sidebar-nav').affix({
        offset: {
            top: function() {
                return (this.top = $('.navbar').outerHeight(true));
            },
            bottom: 0
        }
    });

}($));
