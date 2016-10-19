/* eslint-env browser */

import requestRedraw from './requestRedraw';

const init = (instance, node) => {
    instance.__node__ = node;
    // Fill parent but allow parent to shrink
    if (instance.__node__.offsetParent !== instance) {
        instance.style.position = 'relative';
    }
    instance.__node__.style.position = 'absolute';
    instance.__node__.style.top = instance.__node__.style.right = instance.__node__.style.bottom = instance.__node__.style.left = 0;
};

export default (createNode) => class extends HTMLElement {

    // https://github.com/WebReflection/document-register-element/tree/v1.0.10#skipping-the-caveat-through-extends
    // eslint-disable-next-line
    constructor(_) { return init((_ = super(_)), createNode()), _; }

    connectedCallback() {
        this.appendChild(this.__node__);
        requestRedraw(this);
    }

    requestRedraw() {
        requestRedraw(this);
    }
};
