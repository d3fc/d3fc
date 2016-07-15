import { select, selection } from 'd3-selection';
import 'd3-transition';
import dataJoin from '../src/dataJoin';

describe('dataJoin', () => {
    const data = [null];
    let element;
    let container;

    beforeEach(() => {
        element = document.createElement('svg');
        container = select(element);
    });

    it('should allow element to be specified when created', () => {
        const join = dataJoin('rect');
        join(container, data);
        expect(element.childNodes.length).toBe(1);
        expect(element.childNodes[0].nodeName.toLowerCase()).toBe('rect');
        expect(element.childNodes[0].className).toBe('');
    });

    it('should allow element and className to be specified when created', () => {
        const join = dataJoin('rect', 'rectangle');
        join(container, data);
        expect(element.childNodes.length).toBe(1);
        expect(element.childNodes[0].nodeName.toLowerCase()).toBe('rect');
        expect(element.childNodes[0].className).toBe('rectangle');
    });

    it('should use identity for data if not specified', () => {
        const join = dataJoin();
        container.datum(data);
        join(container)
            .each(d => expect(d).toBe(data[0]));
    });

    it('should only select children', () => {
        const join = dataJoin();
        join(container, data)
            .append('g');
        expect(element.childNodes.length).toBe(1);
        expect(element.childNodes[0].childNodes.length).toBe(1);
        join(container, data);
        expect(element.childNodes.length).toBe(1);
        expect(element.childNodes[0].childNodes.length).toBe(1);
    });

    it('should use key if specified', () => {
        const join = dataJoin()
            .key(d => d);
        join(container, [1]);
        const exit = join(container, [2, 3]).exit();
        expect(exit.nodes().length).toBe(1);
    });

    it('should insert specified element w/ className', () => {
        const join = dataJoin()
            .element('rect')
            .className('rectangle');
        join(container, data);
        expect(element.childNodes.length).toBe(1);
        expect(element.childNodes[0].nodeName.toLowerCase()).toBe('rect');
        expect(element.childNodes[0].className).toBe('rectangle');
    });

    it('should insert specified element w/o className', () => {
        const join = dataJoin()
            .element('rect');
        join(container, data);
        expect(element.childNodes.length).toBe(1);
        expect(element.childNodes[0].nodeName.toLowerCase()).toBe('rect');
        expect(element.childNodes[0].className).toBe('');
    });

    it('should automatically merge the enter/update containers', () => {
        const join = dataJoin();
        const update = join(container, data);
        expect(update.nodes().length).toBe(1);
    });

    it('should remove elments', () => {
        const join = dataJoin();
        join(container, data);
        expect(element.childNodes.length).toBe(1);
        join(container, []);
        expect(element.childNodes.length).toBe(0);
    });

    it('should only set a transition when transitions available', () => {
        const transition = selection.prototype.transition;
        delete selection.prototype.transition;

        const join = dataJoin();
        join(container, data);

        selection.prototype.transition = transition;
    });

    it('should insert new elements in an order consistent with the data', () => {
        const join = dataJoin();
        let data = [1, 2, 3];

        join(container, data);
        expect(element.childNodes.length).toBe(3);
        expect(element.childNodes[0].__data__).toBe(1);
        expect(element.childNodes[1].__data__).toBe(2);
        expect(element.childNodes[2].__data__).toBe(3);

        data = [1, 4, 2];
        join(container, data);
        expect(element.childNodes.length).toBe(3);
        expect(element.childNodes[0].__data__).toBe(1);
        expect(element.childNodes[1].__data__).toBe(4);
        expect(element.childNodes[2].__data__).toBe(2);
    });
});
