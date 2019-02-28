// Adapted from https://github.com/substack/insert-css
export const css = `d3fc-canvas,d3fc-svg{position:relative;display:block}\
d3fc-canvas>canvas,d3fc-svg>svg{position:absolute;height:100%;width:100%}\
d3fc-svg>svg{overflow:visible}`;

export const insertCss = (node, css, id) => {
    const root = node.getRootNode();
    const head = root.querySelector('head') || root;

    if (!head.querySelector(`#${id}`)) {
        var styleElement = document.createElement('style');
        styleElement.setAttribute('type', 'text/css');
        styleElement.setAttribute('id', id);
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText += css;
        } else {
            styleElement.textContent += css;
        }

        head.appendChild(styleElement);
    }
};
