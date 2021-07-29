/* globals customElements */
import Canvas from './src/canvas';
import Group from './src/group';
import Svg from './src/svg';
import './src/css';

if (
    typeof customElements !== 'object' ||
    typeof customElements.define !== 'function'
) {
    throw new Error(
        'd3fc-element depends on Custom Elements (v1). Make sure that you load a polyfill in older browsers. See README.'
    );
}

const registerElement = (name, element) =>
    customElements.get(name) || customElements.define(name, element);

registerElement('d3fc-canvas', Canvas);
registerElement('d3fc-group', Group);
registerElement('d3fc-svg', Svg);
