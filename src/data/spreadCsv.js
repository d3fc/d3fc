
// the D3 CSV loader / parser converts each row into an object with property names
// derived from the headings in the CSV. The spreadCsv component converts this into an
// array of series, one per column
export default function spreadCsv() {

    var xValueKey = '';
    var yValue = function(row, key) {
        // D3 CSV returns all keys as strings, this converts them to numbers
        // by default.
        return row[key] ? Number(row[key]) : 0;
    };

    var spread = function(data) {
        var series = Object.keys(data[0])
            .filter(function(key) {
                return key !== xValueKey;
            })
            .map(function(key) {
                var series = data.map(function(row) {
                    return {
                        x: row[xValueKey],
                        y: yValue(row, key)
                    };
                });
                series.name = key;
                return series;
            });
        return series;
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

    return spread;
}
