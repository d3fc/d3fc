import d3 from 'd3';
import {identity, noop} from '../../util/fn';

export default function() {

    var undefinedValue = d3.functor(undefined),
        number = d3.functor(10),
        accumulator = noop,
        field = identity;

    var modeMedian = function(data) {

        if (number() > data.length) {
            return data;
        }

        var minMax = getGlobalMinMax(data);
        var buckets = getBuckets(data);

        var subsampledData = buckets.map(function(bucket, i) {

            var frequencies = {};
            var mostFrequent;
            var mostFrequentIndex;
            var singleMostFrequent = true;

            for (var j = 0; j < bucket.length; j++) {
                var item = field(bucket[j]);
                if (item === minMax[0] || item === minMax[1]) {
                    return bucket[j];
                }

                if (frequencies[item] === undefined) {
                    frequencies[item] = 0;
                }
                frequencies[item]++;

                if (frequencies[item] > frequencies[mostFrequent] || mostFrequent === undefined) {
                    mostFrequent = item;
                    mostFrequentIndex = j;
                    singleMostFrequent = true;
                } else if (frequencies[item] === frequencies[mostFrequent]) {
                    singleMostFrequent = false;
                }
            }

            if (singleMostFrequent) {
                return bucket[mostFrequentIndex];
            } else {
                return bucket[Math.floor(bucket.length / 2)];
            }
        });

        // First and last data points are their own buckets.
        return [].concat(data[0], subsampledData, data[data.length - 1]);
    };

    var getGlobalMinMax = function(data) {
        var min = Infinity;
        var max = -Infinity;

        min = d3.min(data, field);
        max = d3.max(data, field);

        return [min, max];
    };

    var getBuckets = function(data) {
        var numberOfBuckets = number.apply(this, arguments) - 2;
        var dataPointsPerBucket = (data.length - 2) / numberOfBuckets;

        // Use all but the first and last data points, as they are their own buckets.
        var trimmedData = data.slice(1, data.length - 1);

        var buckets = [];
        for (var i = 0; i < numberOfBuckets; i++) {
            buckets.push(data.slice(1 + i * dataPointsPerBucket, 1 + (i + 1) * dataPointsPerBucket));
        }
        return buckets;
    };

    modeMedian.number = function(x) {
        if (!arguments.length) {
            return number;
        }
        number = d3.functor(x);
        return modeMedian;
    };

    modeMedian.field = function(x) {
        if (!arguments.length) {
            return field;
        }

        if (typeof x === 'string') {
            field = function(d) {
                return d[x];
            };
        } else {
            field = x;
        }

        return modeMedian;
    };

    return modeMedian;
}
