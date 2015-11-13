import d3 from 'd3';
import {identity, noop} from '../../util/fn';
import bucket from './bucket';

export default function() {

    var dataBucketer = bucket(),
        xValue = identity,
        yValue = identity;

    var largestTriangleOneBucket = function(data) {

        if (dataBucketer.bucketSize() >= data.length) {
            return data;
        }

        var pointAreas = calculateAreaOfPoints(data);
        var pointAreaBuckets = dataBucketer(pointAreas);

        var buckets = dataBucketer(data.slice(1, data.length - 1));

        var subsampledData = buckets.map(function(thisBucket, i) {

            var pointAreaBucket = pointAreaBuckets[i];
            var maxArea = d3.max(pointAreaBucket);
            var currentMaxIndex = pointAreaBucket.indexOf(maxArea);

            return thisBucket[currentMaxIndex];
        });

        // First and last data points are their own buckets.
        return [].concat(data[0], subsampledData, data[data.length - 1]);
    };

    function calculateAreaOfPoints(data) {

        var pointAreas = [];

        for (var i = 1; i < data.length - 1; i++) {
            var lastPoint = getXY(data[i - 1]);
            var thisPoint = getXY(data[i]);
            var nextPoint = getXY(data[i + 1]);

            var base = (lastPoint[0] - nextPoint[0]) * (thisPoint[1] - lastPoint[1]);
            var height = (lastPoint[0] - thisPoint[0]) * (nextPoint[1] - lastPoint[1]);

            var area = Math.abs(0.5 * base * height);

            pointAreas.push(area);
        }

        return pointAreas;
    }

    function getXY(point) {
        return [xValue(point), yValue(point)];
    }

    d3.rebind(largestTriangleOneBucket, dataBucketer, 'bucketSize');

    largestTriangleOneBucket.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }

        xValue = x;

        return largestTriangleOneBucket;
    };

    largestTriangleOneBucket.yValue = function(y) {
        if (!arguments.length) {
            return yValue;
        }

        yValue = y;

        return largestTriangleOneBucket;
    };

    return largestTriangleOneBucket;
}
