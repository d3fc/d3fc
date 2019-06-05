import {color} from 'd3-color';

const toGl = v => v / 255;
export default value => {
    const c = color(value);
    return [toGl(c.r), toGl(c.g), toGl(c.b), Math.sqrt(c.opacity)];
};
