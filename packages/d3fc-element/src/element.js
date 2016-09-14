const init = (instance, node) => {
    instance.onmeasure = null;
    instance.ondraw = null;

    instance.__node__ = node;
    instance.__redrawRequestId__ = null;
    instance.__measure__ = false;

    // Fill parent but allow parent to shrink
    instance.style.position = 'relative';
    instance.__node__.style.position = 'absolute';
    instance.__node__.style.top = '0';
    instance.__node__.style.right = '0';
    instance.__node__.style.bottom = '0';
    instance.__node__.style.left = '0';
};

const measure = (instance) => {
    instance.__measure__ = false;
    const width = instance.clientWidth;
    const height = instance.clientHeight;
    instance.__node__.setAttribute('width', width);
    instance.__node__.setAttribute('height', height);
    if (instance.onmeasure != null) {
        instance.onmeasure({
            width,
            height
        });
    }
    instance.__redrawRequestId__ = requestAnimationFrame(() => redraw(instance));
};

const draw = (instance) => {
    if (instance.ondraw != null) {
        instance.ondraw({
            node: instance.__node__,
            data: instance.__data__
        });
    }
};

const redraw = (instance) => {
    instance.__redrawRequestId__ = null;
    const action = instance.__measure__ ? measure : draw;
    action(instance);
};

export default (createNode) => class extends HTMLElement {

    // https://github.com/WebReflection/document-register-element/tree/v1.0.10#skipping-the-caveat-through-extends
    // eslint-disable-next-line
    constructor(_) { return init((_ = super(_)), createNode()), _; }

    connectedCallback() {
        this.appendChild(this.__node__);
        this.requestRedraw({ measure: true });
    }

    requestRedraw({ measure = false }) {
        this.__measure__ = this.__measure__ || measure;
        if (this.__redrawRequestId__ == null) {
            this.__redrawRequestId__ = requestAnimationFrame(() => redraw(this));
        }
    }

    get __data__() {
        return this.__node__.__data__;
    }

    set __data__(data) {
        this.__node__.__data__ = data;
    }
};
