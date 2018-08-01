import { max, range } from 'd3-array';
import { rebind } from '@d3fc/d3fc-rebind';
import bucket from './bucket';

export default function() {

    var dataBucketer = bucket();
    var x = (d) => d;
    var y = (d) => d;

    const largestTriangleOneBucket = (data) => {

        if (dataBucketer.bucketSize() >= data.length) {
            return data;
        }

        var pointAreas = calculateAreaOfPoints(data);
        var pointAreaBuckets = dataBucketer(pointAreas);

        var buckets = dataBucketer(data.slice(1, data.length - 1));

        var subsampledData = buckets.map((thisBucket, i) => {

            var pointAreaBucket = pointAreaBuckets[i];
            var maxArea = max(pointAreaBucket);
            var currentMaxIndex = pointAreaBucket.indexOf(maxArea);

            return thisBucket[currentMaxIndex];
        });

        // First and last data points are their own buckets.
        return [].concat([data[0]], subsampledData, [data[data.length - 1]]);
    };

    function calculateAreaOfPoints(data) {

        var xyData = data.map((point) => [x(point), y(point)]);

        var pointAreas = range(1, xyData.length - 1).map((i) => {
            var lastPoint = xyData[i - 1];
            var thisPoint = xyData[i];
            var nextPoint = xyData[i + 1];

            return 0.5 * Math.abs((lastPoint[0] - nextPoint[0]) * (thisPoint[1] - lastPoint[1]) -
                (lastPoint[0] - thisPoint[0]) * (nextPoint[1] - lastPoint[1]));
        });

        return pointAreas;
    }

    rebind(largestTriangleOneBucket, dataBucketer, 'bucketSize');

    largestTriangleOneBucket.x = function(d) {
        if (!arguments.length) {
            return x;
        }

        x = d;

        return largestTriangleOneBucket;
    };

    largestTriangleOneBucket.y = function(d) {
        if (!arguments.length) {
            return y;
        }

        y = d;

        return largestTriangleOneBucket;
    };

    return largestTriangleOneBucket;
}
