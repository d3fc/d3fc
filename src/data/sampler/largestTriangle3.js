import d3 from 'd3';
import {identity, noop} from '../../util/fn';

export default function() {

    var bucketSize = 10,
        xValue = identity,
        yValue = identity;

    var largestTriangle3 = function(data) {

        if (bucketSize >= data.length) {
            return data;
        }

        var buckets = getBuckets(data);
        var firstBucket = data[0];
        var lastBucket = data[data.length - 1];

        // Keep track of the last selected bucket info and all buckets
        // (for the next bucket average)
        var allBuckets = [].concat(firstBucket, buckets, lastBucket);

        var lastSelectedX = xValue(firstBucket),
            lastSelectedY = yValue(firstBucket);

        var subsampledData = buckets.map(function(bucket, i) {

            var highestArea = -Infinity;
            var highestItem;
            var nextAvgX = d3.mean(allBuckets[i + 1], xValue);
            var nextAvgY = d3.mean(allBuckets[i + 1], yValue);

            for (var j = 0; j < bucket.length; j++) {
                var x = xValue(bucket[j]),
                    y = yValue(bucket[j]);

                var base = (lastSelectedX - nextAvgX) * (y - lastSelectedY);
                var height = (lastSelectedX - x) * (nextAvgY - lastSelectedY);

                var area = Math.abs(0.5 * base * height);

                if (area > highestArea) {
                    highestArea = area;
                    highestItem = bucket[j];
                }
            }

            lastSelectedX = xValue(highestItem);
            lastSelectedY = yValue(highestItem);

            return highestItem;
        });

        // First and last data points are their own buckets.
        return [].concat(data[0], subsampledData, data[data.length - 1]);
    };

    function getBuckets(data) {
        var numberOfBuckets = (data.length - 2) / bucketSize;

        // Use all but the first and last data points, as they are their own buckets.
        var trimmedData = data.slice(1, data.length - 1);

        var buckets = [];
        for (var i = 0; i < numberOfBuckets; i++) {
            buckets.push(trimmedData.slice(i * bucketSize, (i + 1) * bucketSize));
        }
        return buckets;
    }

    largestTriangle3.bucketSize = function(x) {
        if (!arguments.length) {
            return bucketSize;
        }
        bucketSize = x;
        return largestTriangle3;
    };

    largestTriangle3.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }

        xValue = x;

        return largestTriangle3;
    };

    largestTriangle3.yValue = function(y) {
        if (!arguments.length) {
            return yValue;
        }

        yValue = y;

        return largestTriangle3;
    };

    return largestTriangle3;
}
