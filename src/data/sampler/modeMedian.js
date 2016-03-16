import d3 from 'd3';
import {identity} from '../../util/fn';
import bucket from './bucket';

export default function() {

    var dataBucketer = bucket(),
        value = identity;

    var modeMedian = function(data) {

        if (dataBucketer.bucketSize() > data.length) {
            return data;
        }

        var minMax = d3.extent(data);
        var buckets = dataBucketer(data.slice(1, data.length - 1));

        var subsampledData = buckets.map(function(thisBucket, i) {

            var frequencies = {};
            var mostFrequent;
            var mostFrequentIndex;
            var singleMostFrequent = true;

            for (var j = 0; j < thisBucket.length; j++) {
                var item = value(thisBucket[j]);
                if (item === minMax[0] || item === minMax[1]) {
                    return thisBucket[j];
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
                return thisBucket[mostFrequentIndex];
            } else {
                return thisBucket[Math.floor(thisBucket.length / 2)];
            }
        });

        // First and last data points are their own buckets.
        return [].concat(data[0], subsampledData, data[data.length - 1]);
    };

    modeMedian.bucketSize = function() {
        dataBucketer.bucketSize.apply(this, arguments);
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
