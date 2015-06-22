(function() {
    'use strict';

    var seed;
    seed = location.search.split('seed=')[1];
    if (seed) {
        // Sets Math.random to a PRNG initialised using the explicit seed
        Math.seedrandom(seed);
    }
}());
