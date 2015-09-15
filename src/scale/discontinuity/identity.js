import {identity as _identity} from '../../util/fn';

export default function() {

    var identity = {};

    identity.distance = function(startDate, endDate) {
        return endDate.getTime() - startDate.getTime();
    };

    identity.offset = function(startDate, ms) {
        return new Date(startDate.getTime() + ms);
    };

    identity.clampUp = _identity;

    identity.clampDown = _identity;

    identity.copy = function() { return identity; };

    return identity;
}
