/* eslint-env browser */

import requestRedraw from './requestRedraw';

if (typeof HTMLElement !== 'function') {
    throw new Error('d3fc-element depends on Custom Elements (v1). Make sure that you load a polyfill in older browsers. See README.');
}

export default (createNode) => class extends HTMLElement {

    connectedCallback() {
        if (this.childNodes.length === 0) {
            this.appendChild(createNode());
        }
    }

    requestRedraw() {
        requestRedraw(this);
    }
};
