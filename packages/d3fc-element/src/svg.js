import element from './element';

export default element(() => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.style.overflow = 'visible';
    return node;
});
