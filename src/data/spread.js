
// the D3 CSV loader / parser converts each row into an object with property names
// derived from the headings in the CSV. The spread component converts this into an
// array of series; one per column (vertical spread), or one per row (horizontal spread).
export default function() {

    var xValueKey = '',
        orient = 'vertical',
        yValue = function(row, key) {
            // D3 CSV returns all values as strings, this converts them to numbers
            // by default.
            return Number(row[key]);
        };

    function verticalSpread(data) {
        var series = Object.keys(data[0])
            .filter(function(key) {
                return key !== xValueKey;
            })
            .map(function(key) {
                var values = data.filter(function(row) {
                    return row[key];
                }).map(function(row) {
                    return {
                        x: row[xValueKey],
                        y: yValue(row, key)
                    };
                });
                return {
                    key: key,
                    values: values
                };
            });

        return series;
    }

    function horizontalSpread(data) {

        var series = data.map(function(row) {
            var keys = Object.keys(row).filter(function(d) {
                return d !== xValueKey;
            });

            return {
                key: row[xValueKey],
                values: keys.map(function(key) {
                    return {
                        x: key,
                        y: yValue(row, key)
                    };
                })
            };
        });

        return series;
    }

    var spread = function(data) {
        return orient === 'vertical' ? verticalSpread(data) : horizontalSpread(data);
    };

    spread.xValueKey = function(x) {
        if (!arguments.length) {
            return xValueKey;
        }
        xValueKey = x;
        return spread;
    };

    spread.yValue = function(x) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = x;
        return spread;
    };

    spread.orient = function(x) {
        if (!arguments.length) {
            return orient;
        }
        orient = x;
        return spread;
    };

    return spread;
}
