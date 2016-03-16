import label from './label';
import { boundingBox, greedy, annealing, removeOverlaps, textLabel } from 'd3fc-label-layout';

export default {
    label: label,
    textLabel: textLabel,
    strategy: {
        boundingBox: boundingBox,
        greedy: greedy,
        annealing: annealing,
        removeOverlaps: removeOverlaps
    }
};
