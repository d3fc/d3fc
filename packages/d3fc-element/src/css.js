// Adapted from https://github.com/substack/insert-css
export const css = `d3fc-canvas,d3fc-svg{position:relative;display:block}\
d3fc-canvas>canvas,d3fc-svg>svg{position:absolute;height:100%;width:100%}\
d3fc-svg>svg{overflow:visible}`;

const styleElement = document.createElement('style');
styleElement.setAttribute('type', 'text/css');

document.querySelector('head')
  .appendChild(styleElement);

if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText += css;
} else {
    styleElement.textContent += css;
}
