/* eslint-env browser */

import requestRedraw from './requestRedraw';

const init = (instance, node) => {
    instance.__node__ = node;
};

export default (createNode) => class extends HTMLElement {

    // https://github.com/WebReflection/document-register-element/tree/v1.0.10#skipping-the-caveat-through-extends
    // eslint-disable-next-line
    constructor(_) { return init((_ = super(_)), createNode()), _; }

    connectedCallback() {
        this.appendChild(this.__node__);
    }

    requestRedraw() {
        requestRedraw(this);
    }
};
