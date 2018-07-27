import jsdom from 'jsdom';
global.document = jsdom.jsdom();
global.CustomEvent = () => {};
