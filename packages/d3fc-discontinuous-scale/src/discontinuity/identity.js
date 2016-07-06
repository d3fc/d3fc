export default function() {

    var identity = {};

    identity.distance = function(start, end) {
        return end - start;
    };

    identity.offset = function(start, offset) {
        return (start instanceof Date)
            ? new Date(start.getTime() + offset)
            : start + offset;
    };

    identity.clampUp = d => d;

    identity.clampDown = d => d;

    identity.copy = () => identity;

    return identity;
}
