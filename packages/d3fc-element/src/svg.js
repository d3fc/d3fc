import element from './element';

export default element(
    () => document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    (element, node, { width, height }) => {
        node.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
);
