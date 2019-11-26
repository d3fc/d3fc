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
const layoutComponent = () => {
    let score = null;

    let winningScore = lessThan;

    let locationScore = () => 0;

    let rectangles;

    const evaluatePlacement = (placement, index) =>
        score -
        locationScore(rectangles[index], index, rectangles) +
        locationScore(placement, index, substitute(rectangles, index, placement));

    const layout = (placement, index) => {
        if (!score) {
            score = sum(
                rectangles.map((r, i) => locationScore(r, i, rectangles))
            );
        }

        const newScore = evaluatePlacement(placement, index);

        if (winningScore(newScore, score)) {
            return layoutComponent()
                .locationScore(locationScore)
                .winningScore(winningScore)
                .score(newScore)
                .rectangles(substitute(rectangles, index, placement));
        } else {
            return layout;
        }
    };

    layout.rectangles = (...args) => {
        if (!args.length) {
            return rectangles;
        }
        rectangles = args[0];
        return layout;
    };
    layout.score = (...args) => {
        if (!args.length) {
            return score;
        }
        score = args[0];
        return layout;
    };
    layout.winningScore = (...args) => {
        if (!args.length) {
            return winningScore;
        }
        winningScore = args[0];
        return layout;
    };
    layout.locationScore = (...args) => {
        if (!args.length) {
            return locationScore;
        }
        locationScore = args[0];
        return layout;
    };

    return layout;
};

export default layoutComponent;
