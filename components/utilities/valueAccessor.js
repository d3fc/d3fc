(function (d3, fc) {
    'use strict';

    fc.utilities.valueAccessor = function(propertyName) {
        return function (d) {
           if(d.hasOwnProperty(propertyName)) { 
              return d[propertyName];
           } else {
              if (typeof console === "object") {
                  console.warn("The property with name " + propertyName + " was not found on the data object");
              }
              return 0;
           }
        };
    };
}(d3, fc));