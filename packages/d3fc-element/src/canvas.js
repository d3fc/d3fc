import element from './element';

export default class extends element(
    () => document.createElement('canvas'),
    (element, node, { width, height }) => {
        node.setAttribute('width', width);
        node.setAttribute('height', height);
        if (element.setWebglViewport) {
            const context = node.getContext('webgl');
            context.viewport(0, 0, width, height);
        }
    }
) {
    get setWebglViewport() {
        return this.hasAttribute('set-webgl-viewport') && this.getAttribute('set-webgl-viewport') !== 'false';
    }

    set setWebglViewport(setWebglViewport) {
        if (setWebglViewport && !this.setWebglViewport) {
            this.setAttribute('set-webgl-viewport', '');
        } else if (!setWebglViewport && this.setWebglViewport) {
            this.removeAttribute('set-webgl-viewport');
        }
        this.requestRedraw();
    }
}
