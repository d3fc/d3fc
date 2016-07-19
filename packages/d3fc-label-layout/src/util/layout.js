import intersect from './intersect';
import { sum } from 'd3-array';

const substitute = (array, index, substitution) =>
    [
        ...array.slice(0, index),
        substitution,
        ...array.slice(index + 1)
    ];

const lessThan = (a, b) => a < b;

// a layout takes an array of rectangles and allows their locations to be optimised.
// it is constructed using two functions, locationScore, which score the placement of and
// individual rectangle, and winningScore which takes the scores for a rectangle
// at two different locations and assigns a winningScore.
const layout = (rectangles, locationScore, winningScore, score) => {

    score = score || sum(
        rectangles.map((_, i) => locationScore(rectangles, i))
    );

    winningScore = winningScore || lessThan;

    const evaluatePlacement = (placement, index) =>
        score -
        locationScore(rectangles, index) +
        locationScore(substitute(rectangles, index, placement), index);

    const tryLocation = (rectangle, index) => {
        const newScore = evaluatePlacement(rectangle, index);
        return winningScore(newScore, score)
            ? layout(substitute(rectangles, index, rectangle), locationScore, winningScore, newScore)
            : self;
    };

    const self = {
        data: () => rectangles,
        score: () => score,
        tryLocation
    };
    return self;
};

export default layout;
