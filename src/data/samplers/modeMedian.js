import d3 from 'd3';
import {identity, noop} from '../../util/fn';

export default function() {

    var bucketSize = 10,
        value = identity;

    var modeMedian = function(data) {

        if (bucketSize > data.length) {
            return data;
        }

        var minMax = d3.extent(data);
        var buckets = getBuckets(data);

        var subsampledData = buckets.map(function(bucket, i) {

            var frequencies = {};
            var mostFrequent;
            var mostFrequentIndex;
            var singleMostFrequent = true;

            for (var j = 0; j < bucket.length; j++) {
                var item = value(bucket[j]);
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

    function getBuckets(data) {
        var numberOfBuckets = Math.ceil((data.length - 2) / bucketSize);
        var dataPointsPerBucket = (data.length - 2) / numberOfBuckets;

        // Use all but the first and last data points, as they are their own buckets.
        var trimmedData = data.slice(1, data.length - 1);

        var buckets = [];
        for (var i = 0; i < numberOfBuckets; i++) {
            buckets.push(trimmedData.slice(i * dataPointsPerBucket, (i + 1) * dataPointsPerBucket));
        }
        return buckets;
    }

    modeMedian.bucketSize = function(x) {
        if (!arguments.length) {
            return bucketSize;
        }
        bucketSize = x;
        return modeMedian;
    };

    modeMedian.value = function(x) {
        if (!arguments.length) {
            return value;
        }

        value = x;

        return modeMedian;
    };

    return modeMedian;
}
