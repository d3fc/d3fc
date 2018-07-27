/* globals customElements */
import Canvas from './src/canvas';
import Group from './src/group';
import Svg from './src/svg';
import './src/css';

if (typeof customElements !== 'object' || typeof customElements.define !== 'function') {
    throw new Error('d3fc-element depends on Custom Elements (v1). Make sure that you load a polyfill in older browsers. See README.');
}

customElements.define('d3fc-canvas', Canvas);
customElements.define('d3fc-group', Group);
customElements.define('d3fc-svg', Svg);
