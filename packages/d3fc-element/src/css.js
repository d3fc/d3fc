// Adapted from https://github.com/substack/insert-css
const css = `d3fc-canvas,d3fc-svg{position:relative}\
d3fc-canvas>canvas,d3fc-svg>svg{position:absolute;top:0;right:0;left:0;bottom: 0}\
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
