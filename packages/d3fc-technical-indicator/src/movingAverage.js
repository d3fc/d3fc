import { mean } from 'd3-array';
import { rebind } from '@d3fc/d3fc-rebind';
import _slidingWindow from './slidingWindow';

export default function() {

    const slidingWindow = _slidingWindow()
        .accumulator(values => values && mean(values));

    const movingAverage = data => slidingWindow(data);

    rebind(movingAverage, slidingWindow, 'period', 'value');

    return movingAverage;
}
