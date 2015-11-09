import d3 from 'd3';
import {identity, noop} from '../../util/fn';
import bucket from './bucket';

export default function() {

    var xValue = identity,
        yValue = identity,
        dataBucketer = bucket();

    var largestTriangleThreeBucket = function(data) {

        if (dataBucketer.bucketSize() >= data.length) {
            return data;
        }

        var buckets = dataBucketer(data.slice(1, data.length - 1));
        var firstBucket = data[0];
        var lastBucket = data[data.length - 1];

        // Keep track of the last selected bucket info and all buckets
        // (for the next bucket average)
        var allBuckets = [].concat(firstBucket, buckets, lastBucket);

        var lastSelectedX = xValue(firstBucket),
            lastSelectedY = yValue(firstBucket);

        var subsampledData = buckets.map(function(thisBucket, i) {

            var highestArea = -Infinity;
            var highestItem;
            var nextAvgX = d3.mean(allBuckets[i + 1], xValue);
            var nextAvgY = d3.mean(allBuckets[i + 1], yValue);

            for (var j = 0; j < thisBucket.length; j++) {
                var x = xValue(thisBucket[j]),
                    y = yValue(thisBucket[j]);

                var base = (lastSelectedX - nextAvgX) * (y - lastSelectedY);
                var height = (lastSelectedX - x) * (nextAvgY - lastSelectedY);

                var area = Math.abs(0.5 * base * height);

                if (area > highestArea) {
                    highestArea = area;
                    highestItem = thisBucket[j];
                }
            }

            lastSelectedX = xValue(highestItem);
            lastSelectedY = yValue(highestItem);

            return highestItem;
        });

        // First and last data points are their own buckets.
        return [].concat(data[0], subsampledData, data[data.length - 1]);
    };

    largestTriangleThreeBucket.bucketSize = function() {
        dataBucketer.bucketSize.apply(this, arguments);
        return largestTriangleThreeBucket;
    };

    largestTriangleThreeBucket.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }

        xValue = x;

        return largestTriangleThreeBucket;
    };

    largestTriangleThreeBucket.yValue = function(y) {
        if (!arguments.length) {
            return yValue;
        }

        yValue = y;

        return largestTriangleThreeBucket;
    };

    return largestTriangleThreeBucket;
}
