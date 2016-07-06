const provider = (...ranges) => {

    const inRange = (number, range) =>
        number > range[0] && number < range[1];

    const surroundsRange = (inner, outer) =>
        inner[0] >= outer[0] &&  inner[1] <= outer[1];

    var identity = {};

    identity.distance = (start, end) => {
        start = identity.clampUp(start);
        end = identity.clampDown(end);

        const surroundedRanges = ranges.filter(r => surroundsRange(r, [start, end]));
        const rangeSizes = surroundedRanges.map(r => r[1] - r[0]);

        return end - start - rangeSizes.reduce((total, current) => total + current, 0);
    };

    const add = (value, offset) =>
        (value instanceof Date) ? new Date(value.getTime() + offset) : value + offset;

    identity.offset = (location, offset) => {
        if (offset > 0) {
            let currentLocation = identity.clampUp(location);
            let offsetRemaining = offset;
            while (offsetRemaining > 0) {
                const futureRanges = ranges.filter(r => r[0] > currentLocation)
                    .sort((a, b) => a[0] - b[0]);
                if (futureRanges.length) {
                    const nextRange = futureRanges[0];
                    const delta = nextRange[0] - currentLocation;
                    if (delta > offsetRemaining) {
                        currentLocation = add(currentLocation, offsetRemaining);
                        offsetRemaining = 0;
                    } else {
                        currentLocation = nextRange[1];
                        offsetRemaining -= delta;
                    }
                } else {
                    currentLocation = add(currentLocation, offsetRemaining);
                    offsetRemaining = 0;
                }
            }
            return currentLocation;
        } else {
            let currentLocation = identity.clampDown(location);
            let offsetRemaining = offset;
            while (offsetRemaining < 0) {
                const futureRanges = ranges.filter(r => r[1] < currentLocation)
                    .sort((a, b) => b[0] - a[0]);
                if (futureRanges.length) {
                    const nextRange = futureRanges[0];
                    const delta = nextRange[1] - currentLocation;
                    if (delta < offsetRemaining) {
                        currentLocation = add(currentLocation, offsetRemaining);
                        offsetRemaining = 0;
                    } else {
                        currentLocation = nextRange[0];
                        offsetRemaining -= delta;
                    }
                } else {
                    currentLocation = add(currentLocation, offsetRemaining);
                    offsetRemaining = 0;
                }
            }
            return currentLocation;
        }
    };

    identity.clampUp = d =>
        ranges.reduce((value, range) => inRange(value, range) ? range[1] : value, d);

    identity.clampDown = d =>
        ranges.reduce((value, range) => inRange(value, range) ? range[0] : value, d);

    identity.copy = () => identity;

    return identity;
};

export default provider;
