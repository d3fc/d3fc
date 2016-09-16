const nodeSelector = 'd3fc-svg, d3fc-canvas';

const init = (instance, node) => {
    instance.__animationFrameRequestId__ = null;
    instance.__measure__ = true;
};

const redraw = (instance) => {
    const tasks = [];
    const nodes = instance.querySelectorAll(nodeSelector);
    for (const node of nodes) {
        node.requestRedraw({
            measure: instance.__measure__,
            immediate: true,
            next: (task) => void tasks.push(task)
        });
    }
    while (tasks.length > 0) {
        tasks.shift()();
    }
};

export default class extends HTMLElement {
    // https://github.com/WebReflection/document-register-element/tree/v1.0.10#skipping-the-caveat-through-extends
    // eslint-disable-next-line
    constructor(_) { return init((_ = super(_))), _; }

    requestRedraw({ measure = false }) {
        cancelAnimationFrame(this.__animationFrameRequestId__);
        this.__measure__ = this.__measure__ || measure;
        this.__animationFrameRequestId__ = requestAnimationFrame(() => redraw(this));
    }
    set __data__(data) {
        const nodes = this.querySelectorAll(nodeSelector);
        for (const node of nodes) {
            node.__data__ = data;
        }
    }
    get __data__() {
        const node = this.querySelector(nodeSelector);
        return node.__data__;
    }
    get autoResize() {
        return this.hasAttribute('auto-resize') && this.getAttribute('auto-resize') !== 'false';
    }
    set autoResize(autoResize) {
        if (autoResize && !this.autoResize) {
            this.setAttribute('auto-resize', '');
        } else if (!autoResize && this.autoResize) {
            this.removeAttribute('auto-resize');
        }
        this.updateAutoResize();
    }
    updateAutoResize() {
        if (this.autoResize) {
            if (this.__autoResizeListener__ == null) {
                this.__autoResizeListener__ = () => this.requestRedraw({ measure: true });
            }
            addEventListener('resize', this.__autoResizeListener__);
        } else {
            removeEventListener('resize', this.__autoResizeListener__);
        }
    }
    static get observedAttributes() {
        return ['auto-resize'];
    }
    attributeChangedCallback(name) {
        switch (name) {
        case 'auto-resize':
            this.updateAutoResize();
            break;
        }
    }
};
