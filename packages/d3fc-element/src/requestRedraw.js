import * as data from './data';
import redraw from './redraw';

const getQueue = (element) => data.get(element.ownerDocument).queue || [];

const setQueue = (element, queue) => {
    let { requestId } = data.get(element.ownerDocument);
    if (requestId == null) {
        requestId = requestAnimationFrame(() => {
            // This seems like a weak way of retrieving the queue
            // but I can't see an edge case at the minute...
            const queue = getQueue(element);
            redraw(queue);
            clearQueue(element);
        });
    }
    data.set(element.ownerDocument, { queue, requestId });
};

const clearQueue = (element) => data.clear(element.ownerDocument);

const isDescendentOf = (element, ancestor) => {
    let node = element;
    do {
        if (node.parentNode === ancestor) {
            return true;
        }
    // eslint-disable-next-line no-cond-assign
    } while (node = node.parentNode);
    return false;
};

export default (element) => {
    const queue = getQueue(element);
    const queueContainsElement = queue.indexOf(element) > -1;
    if (queueContainsElement) {
        return;
    }
    const queueContainsAncestor = queue.some(queuedElement => isDescendentOf(element, queuedElement));
    if (queueContainsAncestor) {
        return;
    }
    const queueExcludingDescendents = queue.filter(queuedElement => !isDescendentOf(queuedElement, element));
    queueExcludingDescendents.push(element);
    setQueue(element, queueExcludingDescendents);
};
