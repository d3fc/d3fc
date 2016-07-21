import { sum } from 'd3-array';
import { collisionArea } from './util/collision';
import intersect from './util/intersect';
import placements from './util/placements';
import layout from './util/layout';

const randomItem = (array) => array[randomIndex(array)];

const randomIndex = (array) => Math.floor(Math.random() * array.length);

export default () => {

    let temperature = 1000;
    let cooling = 1;
    let bounds;

    const orientationPenalty = (rectangle) => {
        switch (rectangle.location) {
        case 'bottom-right':
            return 0;
        case 'middle-right':
        case 'bottom-center':
            return rectangle.width * rectangle.height / 8;
        }
        return rectangle.width * rectangle.height / 4;
    };

    const containerPenalty = (rectangle) =>
        bounds ? rectangle.width * rectangle.height - intersect(rectangle, bounds) : 0;

    const penaltyForRectangle = (rectangles, index) =>
        collisionArea(rectangles, index) +
        containerPenalty(rectangles[index]) +
        orientationPenalty(rectangles[index]);

    const strategy = (data) => {
        let currentTemperature = temperature;

        // use annealing to allow a new score to be picked even if it is worse than the old
        const winningScore = (newScore, oldScore) =>
            Math.exp((oldScore - newScore) / currentTemperature) > Math.random();

        let rectangles = layout(data, penaltyForRectangle, winningScore);

        while (currentTemperature > 0) {
            const index = randomIndex(data);
            const randomNewPlacement = randomItem(placements(data[index]));
            rectangles = rectangles.tryLocation(randomNewPlacement, index);
            currentTemperature -= cooling;
        }
        return rectangles.data();
    };

    strategy.temperature = (...args) => {
        if (!args.length) {
            return temperature;
        }
        temperature = args[0];
        return strategy;
    };

    strategy.cooling = (...args) => {
        if (!args.length) {
            return cooling;
        }
        cooling = args[0];
        return strategy;
    };

    strategy.bounds = (...args) => {
        if (!args.length) {
            return bounds;
        }
        bounds = args[0];
        return strategy;
    };

    return strategy;
};
