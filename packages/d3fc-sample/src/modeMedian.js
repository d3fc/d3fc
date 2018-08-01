import { extent } from 'd3-array';
import { rebind } from '@d3fc/d3fc-rebind';
import bucket from './bucket';

export default function() {

    var dataBucketer = bucket();
    var value = (d) => d;

    const modeMedian = (data) => {

        if (dataBucketer.bucketSize() > data.length) {
            return data;
        }

        var minMax = extent(data, value);
        var buckets = dataBucketer(data.slice(1, data.length - 1));

        var subsampledData = buckets.map((thisBucket, i) => {

            var frequencies = {};
            var mostFrequent;
            var mostFrequentIndex;
            var singleMostFrequent = true;

            var values = thisBucket.map(value);

            var globalMinMax = values.filter((value) => value === minMax[0] || value === minMax[1])
                                    .map((value) => values.indexOf(value))[0];

            if (globalMinMax !== undefined) {
                return thisBucket[globalMinMax];
            }

            values.forEach((item, i) => {
                if (frequencies[item] === undefined) {
                    frequencies[item] = 0;
                }
                frequencies[item]++;

                if (frequencies[item] > frequencies[mostFrequent] || mostFrequent === undefined) {
                    mostFrequent = item;
                    mostFrequentIndex = i;
                    singleMostFrequent = true;
                } else if (frequencies[item] === frequencies[mostFrequent]) {
                    singleMostFrequent = false;
                }
            });

            if (singleMostFrequent) {
                return thisBucket[mostFrequentIndex];
            } else {
                return thisBucket[Math.floor(thisBucket.length / 2)];
            }
        });

        // First and last data points are their own buckets.
        return [].concat([data[0]], subsampledData, [data[data.length - 1]]);
    };

    rebind(modeMedian, dataBucketer, 'bucketSize');

    modeMedian.value = function(x) {
        if (!arguments.length) {
            return value;
        }

        value = x;

        return modeMedian;
    };

    return modeMedian;
}
