const init = (instance, node) => {
    instance.onmeasure = null;
    instance.ondraw = null;

    instance.__node__ = node;
    instance.__animationFrameRequestId__ = null;
    instance.__measure__ = true;
    instance.__width__ = null;
    instance.__height__ = null;

    // Fill parent but allow parent to shrink
    instance.style.position = 'relative';
    instance.__node__.style.position = 'absolute';
    instance.__node__.style.top = '0';
    instance.__node__.style.right = '0';
    instance.__node__.style.bottom = '0';
    instance.__node__.style.left = '0';
};

const measureNode = (instance, next) => {
    instance.__width__ = instance.clientWidth;
    instance.__height__ = instance.clientHeight;
    next(() => applyMeasurements(instance, next));
};

const applyMeasurements = (instance, next) => {
    const width = instance.__width__;
    const height = instance.__height__;
    instance.__node__.setAttribute('width', width);
    instance.__node__.setAttribute('height', height);
    if (instance.onmeasure != null) {
        instance.onmeasure({
            width,
            height
        });
    }
    instance.__measure__ = false;
    next(() => draw(instance));
};

const draw = (instance) => {
    if (instance.ondraw != null) {
        instance.ondraw({
            width: instance.__width__,
            height: instance.__height__,
            node: instance.__node__,
            data: instance.__data__
        });
    }
};

export default (createNode) => class extends HTMLElement {

    // https://github.com/WebReflection/document-register-element/tree/v1.0.10#skipping-the-caveat-through-extends
    // eslint-disable-next-line
    constructor(_) { return init((_ = super(_)), createNode()), _; }

    connectedCallback() {
        this.appendChild(this.__node__);
        this.requestRedraw({ measure: true });
    }

    requestRedraw({ measure = false, immediate = false, next = ((task) => task()) }) {
        cancelAnimationFrame(this.__animationFrameRequestId__);
        this.__measure__ = this.__measure__ || measure;
        const action = this.__measure__ ? measureNode : draw;
        if (immediate) {
            action(this, next);
        } else {
            this.__animationFrameRequestId__ = requestAnimationFrame(() => action(this, next));
        }
    }

    get __data__() {
        return this.__node__.__data__;
    }

    set __data__(data) {
        this.__node__.__data__ = data;
    }
};
