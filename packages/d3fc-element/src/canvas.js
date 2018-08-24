import element from './element';

export default element(
    () => document.createElement('canvas'),
    (node, { width, height }) => {
        node.setAttribute('width', width);
        node.setAttribute('height', height);
    }
);
