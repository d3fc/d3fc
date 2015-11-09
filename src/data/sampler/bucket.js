export default function() {

    var bucketSize = 10;

    var bucket = function(data) {
        var numberOfBuckets = Math.ceil(data.length / bucketSize);

        var buckets = [];
        for (var i = 0; i < numberOfBuckets; i++) {
            buckets.push(data.slice(i * bucketSize, (i + 1) * bucketSize));
        }
        return buckets;
    };

    bucket.bucketSize = function(x) {
        if (!arguments.length) {
            return bucketSize;
        }

        bucketSize = x;
        return bucket;
    };

    return bucket;
}
