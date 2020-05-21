import * as data from './data';

const find = (element) => element.tagName === 'D3FC-GROUP'
  ? [element, ...element.querySelectorAll('d3fc-canvas, d3fc-group, d3fc-svg')]
  : [element];

const measure = (element) => {
    const { width: previousWidth, height: previousHeight } = data.get(element);
    const pixelRatio = (element.useDevicePixelRatio && window.devicePixelRatio != null) ? window.devicePixelRatio : 1;
    const width = element.clientWidth * pixelRatio;
    const height = element.clientHeight * pixelRatio;
    const resized = width !== previousWidth || height !== previousHeight;
    const child = element.children[0];
    data.set(element, { pixelRatio, width, height, resized, child });
};

if (typeof CustomEvent !== 'function') {
    throw new Error('d3fc-element depends on CustomEvent. Make sure that you load a polyfill in older browsers. See README.');
}

const resize = (element) => {
    const detail = data.get(element);
    const event = new CustomEvent('measure', { detail });
    element.dispatchEvent(event);
};

const draw = (element) => {
    const detail = data.get(element);
    const event = new CustomEvent('draw', { detail });
    element.dispatchEvent(event);
};

export default (elements) => {
    const allElements = elements.map(find)
      .reduce((a, b) => a.concat(b));
    allElements.forEach(measure);
    allElements.forEach(resize);
    allElements.forEach(draw);
};
