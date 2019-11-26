import requestRedraw from './requestRedraw';

const updateAutoResize = (element) => {
    if (element.autoResize) {
        addAutoResizeListener(element);
    } else {
        removeAutoResizeListener(element);
    }
};

const addAutoResizeListener = (element) => {
    if (element.__autoResizeListener__ != null) {
        return;
    }
    element.__autoResizeListener__ = () => requestRedraw(element);
    addEventListener('resize', element.__autoResizeListener__);
};

const removeAutoResizeListener = (element) => {
    if (element.__autoResizeListener__ == null) {
        return;
    }
    removeEventListener('resize', element.__autoResizeListener__);
    element.__autoResizeListener__ = null;
};

export default class extends HTMLElement {
    connectedCallback() {
        updateAutoResize(this);
    }

    disconnectedCallback() {
        removeAutoResizeListener(this);
    }

    requestRedraw() {
        requestRedraw(this);
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
        updateAutoResize(this);
    }

    static get observedAttributes() {
        return ['auto-resize'];
    }

    attributeChangedCallback(name) {
        switch (name) {
        case 'auto-resize':
            updateAutoResize(this);
            break;
        }
    }
}
