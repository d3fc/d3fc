export default function() {

    var identity = {};

    identity.distance = function(startDate, endDate) {
        return endDate.getTime() - startDate.getTime();
    };

    identity.offset = function(startDate, ms) {
        return new Date(startDate.getTime() + ms);
    };

    identity.clampUp = d => d;

    identity.clampDown = d => d;

    identity.copy = function() { return identity; };

    return identity;
}
