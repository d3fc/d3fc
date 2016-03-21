import d3 from 'd3';

export default function() {

    var bucketSize = 10;

    var bucket = (data) => d3.range(0, Math.ceil(data.length / bucketSize))
                            .map((i) => data.slice(i * bucketSize, (i + 1) * bucketSize));

    bucket.bucketSize = function(x) {
        if (!arguments.length) {
            return bucketSize;
        }

        bucketSize = x;
        return bucket;
    };

    return bucket;
}
