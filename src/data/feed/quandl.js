import d3 from 'd3';

//  https://www.quandl.com/docs/api#datasets
export default function() {

    var _columnNameMap = function(colName) {
        colName = colName.replace(/[\s()-.]/g, '');
        return colName.substr(0, 1) + colName.substr(1);
    };

    var database = 'YAHOO',
        dataset = 'GOOG',
        apiKey = null,
        start = null,
        end = null,
        rows = null,
        descending = false,
        collapse = null,
        columnNameMap = _columnNameMap;

    var quandl = function(cb) {
        var params = [];
        if (apiKey != null) {
            params.push('api_key=' + apiKey);
        }
        if (start != null) {
            params.push('start_date=' + start.toISOString().substring(0, 10));
        }
        if (end != null) {
            params.push('end_date=' + end.toISOString().substring(0, 10));
        }
        if (rows != null) {
            params.push('rows=' + rows);
        }
        if (!descending) {
            params.push('order=asc');
        }
        if (collapse != null) {
            params.push('collapse=' + collapse);
        }

        var url = 'https://www.quandl.com/api/v3/datasets';
        url += ('/' + database + '/' + dataset + '/').replace(/\/\//g, '');
        url += 'data.json?' + params.join('&');

        d3.json(url, function(error, data) {
            if (error) {
                cb(error);
                return;
            }

            var colNames = data.columnNames.map(function(c) {
                return [c, columnNameMap(c)];
            });

            data = data.data.map(function(d) {
                var output = {};

                output[colNames[0][1]] = new Date(d[colNames[0][0]]);
                for (var i = 1; i < colNames.length; i++) {
                    if (colNames[i][1] != null) {
                        output[colNames[i][1]] = new Date(d[colNames[i][0]]);
                    }
                }

                return output;
            });

            cb(error, data);
        });
    };

    // Unique Database Code (e.g. WIKI)
    quandl.database = function(x) {
        if (!arguments.length) {
            return database;
        }
        database = x;
        return quandl;
    };
    // Unique Dataset Code (e.g. AAPL)
    quandl.dataset = function(x) {
        if (!arguments.length) {
            return dataset;
        }
        dataset = x;
        return quandl;
    };
    // Set To Use API Key In Request (needed for premium set or high frequency requests)
    quandl.apiKey = function(x) {
        if (!arguments.length) {
            return apiKey;
        }
        apiKey = x;
        return quandl;
    };
    // Start Date of Data Series
    quandl.start = function(x) {
        if (!arguments.length) {
            return start;
        }
        start = x;
        return quandl;
    };
    // End Date of Data Series
    quandl.end = function(x) {
        if (!arguments.length) {
            return end;
        }
        end = x;
        return quandl;
    };
    // Limit Number of Rows
    quandl.rows = function(x) {
        if (!arguments.length) {
            return rows;
        }
        rows = x;
        return quandl;
    };
    // Return Results In Descending Order (true) or Ascending (false)
    quandl.descending = function(x) {
        if (!arguments.length) {
            return descending;
        }
        descending = x;
        return quandl;
    };
    // Periodicity of Data (daily | weekly | monthly | quarterly | annual)
    quandl.collapse = function(x) {
        if (!arguments.length) {
            return collapse;
        }
        collapse = x;
        return quandl;
    };
    // Function Used to Normalise the Quandl Column Name To Field Name, Return Null To Skip Field
    quandl.columnNameMap = function(x) {
        if (!arguments.length) {
            return columnNameMap;
        }
        columnNameMap = x || _columnNameMap;
        return quandl;
    };

    return quandl;
}
