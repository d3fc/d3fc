import d3 from 'd3';
import {identity} from '../../util/fn';
import bucket from './bucket';

export default function() {

    var x = identity,
        y = identity,
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

        var lastSelectedX = x(firstBucket),
            lastSelectedY = y(firstBucket);

        var subsampledData = buckets.map(function(thisBucket, i) {

            var highestArea = -Infinity;
            var highestItem;
            var nextAvgX = d3.mean(allBuckets[i + 1], x);
            var nextAvgY = d3.mean(allBuckets[i + 1], y);

            for (var j = 0; j < thisBucket.length; j++) {
                var thisX = x(thisBucket[j]),
                    thisY = y(thisBucket[j]);

                var base = (lastSelectedX - nextAvgX) * (thisY - lastSelectedY);
                var height = (lastSelectedX - thisX) * (nextAvgY - lastSelectedY);

                var area = Math.abs(0.5 * base * height);

                if (area > highestArea) {
                    highestArea = area;
                    highestItem = thisBucket[j];
                }
            }

            lastSelectedX = x(highestItem);
            lastSelectedY = y(highestItem);

            return highestItem;
        });

        // First and last data points are their own buckets.
        return [].concat(data[0], subsampledData, data[data.length - 1]);
    };

    d3.rebind(largestTriangleThreeBucket, dataBucketer, 'bucketSize');

    largestTriangleThreeBucket.x = function(d) {
        if (!arguments.length) {
            return x;
        }

        x = d;

        return largestTriangleThreeBucket;
    };

    largestTriangleThreeBucket.y = function(d) {
        if (!arguments.length) {
            return y;
        }

        y = d;

        return largestTriangleThreeBucket;
    };

    return largestTriangleThreeBucket;
}
