import { mean, max } from 'd3-array';
import { rebind } from '@d3fc/d3fc-rebind';
import bucket from './bucket';

export default function() {

    var x = (d) => d;
    var y = (d) => d;
    var dataBucketer = bucket();

    const largestTriangleThreeBucket = (data) => {

        if (dataBucketer.bucketSize() >= data.length) {
            return data;
        }

        var buckets = dataBucketer(data.slice(1, data.length - 1));
        var firstBucket = data[0];
        var lastBucket = data[data.length - 1];

        // Keep track of the last selected bucket info and all buckets
        // (for the next bucket average)
        var allBuckets = [].concat([firstBucket], buckets, [lastBucket]);

        var lastSelectedX = x(firstBucket);
        var lastSelectedY = y(firstBucket);

        var subsampledData = buckets.map((thisBucket, i) => {

            var nextAvgX = mean(allBuckets[i + 1], x);
            var nextAvgY = mean(allBuckets[i + 1], y);

            var xyData = thisBucket.map((item) => [x(item), y(item)]);

            var areas = xyData.map((item) => 0.5 * Math.abs((lastSelectedX - nextAvgX) * (item[1] - lastSelectedY) -
                    (lastSelectedX - item[0]) * (nextAvgY - lastSelectedY)));

            var highestIndex = areas.indexOf(max(areas));
            var highestXY = xyData[highestIndex];

            lastSelectedX = highestXY[0];
            lastSelectedY = highestXY[1];

            return thisBucket[highestIndex];
        });

        // First and last data points are their own buckets.
        return [].concat([data[0]], subsampledData, [data[data.length - 1]]);
    };

    rebind(largestTriangleThreeBucket, dataBucketer, 'bucketSize');

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
