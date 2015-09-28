
// the D3 CSV loader / parser converts each row into an object with property names
// derived from the headings in the CSV. The spreadCsv component converts this into an
// array of series, one per column
export default function spreadCsv() {

    var xValueKey = '';

    var spread = function(data) {
        var series = Object.keys(data[0])
            .filter(function(key) {
                return key !== xValueKey;
            })
            .map(function(key) {
                var series = data.map(function(row) {
                    return {
                        x: row[xValueKey],
                        y: Number(row[key])
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

    return spread;
}
