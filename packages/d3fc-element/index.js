/* globals customElements */
import 'document-register-element';
import Canvas from './src/canvas';
import Group from './src/group';
import Svg from './src/svg';

customElements.define('d3fc-canvas', Canvas);
customElements.define('d3fc-group', Group);
customElements.define('d3fc-svg', Svg);
