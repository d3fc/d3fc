import d3 from 'd3';

// the D3 CSV loader / parser converts each row into an object with property names
// derived from the headings in the CSV. The transpose function converts this into an
// array of series, one per 'heading'
export default function transposeCsv() {

    var xValueKey = '',
        stacked = false,
        stackLayout = d3.layout.stack();

    var transpose = function(data) {
        var series = Object.keys(data[0])
            .filter(function(key) {
                return key !== xValueKey;
            })
            .map(function(key) {
                return {
                    name: key,
                    data: data.map(function(row) {
                        return {
                            x: row[xValueKey],
                            y: Number(row[key])
                        };
                    })
                };
            });

        if (stacked) {
            series = stackLayout(series.map(function(d) { return d.data; }));
        }

        return series;
    };

    transpose.stacked = function(x) {
        if (!arguments.length) {
            return stacked;
        }
        stacked = x;
        return transpose;
    };

    transpose.xValueKey = function(x) {
        if (!arguments.length) {
            return xValueKey;
        }
        xValueKey = x;
        return transpose;
    };

    d3.rebind(transpose, stackLayout, 'order', 'offset', 'out');

    return transpose;
}
