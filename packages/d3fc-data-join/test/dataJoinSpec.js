import { select, selection } from 'd3-selection';
import 'd3-transition';
import { easeLinear } from 'd3-ease';
import dataJoin from '../src/dataJoin';

describe('dataJoin', () => {
    const selectionTransition = selection.prototype.transition;

    const data = [null];
    let element;
    let container;

    beforeEach(() => {
        element = document.createElement('svg');
        container = select(element);
        delete selection.prototype.transition;
    });

    afterEach(() => {
        selection.prototype.transition = selectionTransition;
    });

    it('should allow element to be specified when created', () => {
        const join = dataJoin('rect');
        join(container, data);
        expect(element.childNodes).toHaveLength(1);
        expect(element.childNodes[0].nodeName.toLowerCase()).toBe('rect');
        expect(element.childNodes[0].className).toBe('');
    });

    it('should allow element and className to be specified when created', () => {
        const join = dataJoin('rect', 'rectangle');
        join(container, data);
        expect(element.childNodes).toHaveLength(1);
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
        expect(element.childNodes).toHaveLength(1);
        expect(element.childNodes[0].childNodes).toHaveLength(1);
        join(container, data);
        expect(element.childNodes).toHaveLength(1);
        expect(element.childNodes[0].childNodes).toHaveLength(1);
    });

    it('should use key if specified', () => {
        const join = dataJoin()
            .key(d => d);
        join(container, [1]);
        const exit = join(container, [2, 3]).exit();
        expect(exit.nodes()).toHaveLength(1);
    });

    it('should insert specified element w/ className', () => {
        const join = dataJoin()
            .element('rect')
            .className('rectangle');
        join(container, data);
        expect(element.childNodes).toHaveLength(1);
        expect(element.childNodes[0].nodeName.toLowerCase()).toBe('rect');
        expect(element.childNodes[0].className).toBe('rectangle');
    });

    it('should insert specified element w/o className', () => {
        const join = dataJoin()
            .element('rect');
        join(container, data);
        expect(element.childNodes).toHaveLength(1);
        expect(element.childNodes[0].nodeName.toLowerCase()).toBe('rect');
        expect(element.childNodes[0].className).toBe('');
    });

    it('should automatically merge the enter/update containers', () => {
        const join = dataJoin();
        const update = join(container, data);
        expect(update.nodes()).toHaveLength(1);
    });

    it('should remove elements', () => {
        const join = dataJoin();
        join(container, data);
        expect(element.childNodes).toHaveLength(1);
        join(container, []);
        expect(element.childNodes).toHaveLength(0);
    });

    it('should insert new elements in an order consistent with the data', () => {
        const join = dataJoin()
            .key(d => d);
        let data = [1, 2, 3];

        join(container, data);
        expect(element.childNodes).toHaveLength(3);
        expect(element.childNodes[0].__data__).toBe(1);
        expect(element.childNodes[1].__data__).toBe(2);
        expect(element.childNodes[2].__data__).toBe(3);

        data = [1, 4, 2];
        join(container, data);
        expect(element.childNodes).toHaveLength(3);
        expect(element.childNodes[0].__data__).toBe(1);
        expect(element.childNodes[1].__data__).toBe(4);
        expect(element.childNodes[2].__data__).toBe(2);
    });

    describe('when d3-transition included and a custom transition is specified', () => {
        const timeout = 20;
        let join;

        beforeEach(() => {
            selection.prototype.transition = selectionTransition;
            join = dataJoin();
            container = container.transition()
                .duration(1);
        });

        it('should apply a fade in transition', (done) => {
            const update = join(container, data);
            const node = update.enter().node();

            expect(Number(node.style.opacity)).toBeCloseTo(0.000001, 6);
            expect(node.parentNode).not.toBe(null);

            setTimeout(() => {
                expect(node.style.opacity).toBe('1');
                expect(node.parentNode).not.toBe(null);
                done();
            }, timeout);
        });

        it('should apply transitions to the update selection', (done) => {
            const update = join(container, [1]);
            const node = update.node();

            update.style('opacity', (d) => d);
            expect(Number(node.style.opacity)).toBeCloseTo(0.000001, 6);

            setTimeout(() => {
                expect(node.style.opacity).toBe('1');
                done();
            }, timeout);
        });

        it('should apply a fade out transition', (done) => {
            container.selection()
                .append('g')
                .style('opacity', '1');
            const update = join(container, []);
            const node = update.exit().node();

            expect(node.style.opacity).toBe('1');
            expect(node.parentNode).not.toBe(null);

            setTimeout(() => {
                expect(Number(node.style.opacity)).toBeCloseTo(0.000001, 6);
                expect(node.parentNode).toBe(null);
                done();
            }, timeout);
        });

        it('should return the untransitioned exit selection', () => {
            container.selection()
                .append('g')
                .style('opacity', '1');
            const update = join(container, []);

            update.exit()
              .remove();

            const node = update.exit().node();
            expect(node.style.opacity).toBe('1');
            expect(node.parentNode).not.toBe(null);
        });

        it('should allow the transition to be disabled', () => {
            container = container.selection();

            const update = join(container, data);
            const node = update.enter().node();

            expect(node.style.opacity).toBe('');
            expect(node.parentNode).not.toBe(null);
        });

        it('should use explicit transition', (done) => {
            join.transition(container);
            container = container.selection();

            const update = join(container, data);
            const node = update.enter().node();

            expect(Number(node.style.opacity)).toBeCloseTo(0.000001, 6);
            expect(node.parentNode).not.toBe(null);

            setTimeout(() => {
                expect(node.style.opacity).toBe('1');
                expect(node.parentNode).not.toBe(null);
                done();
            }, timeout);
        });

        it('should use implicit rather than explicit transition', (done) => {
            const explicit = container
                .transition()
                .duration(timeout * 10)
                .ease(easeLinear);

            join.transition(explicit);

            const update = join(container, data);
            const node = update.enter().node();

            expect(Number(node.style.opacity)).toBeCloseTo(0.000001, 6);
            expect(node.parentNode).not.toBe(null);

            setTimeout(() => {
                expect(node.style.opacity).toBe('1');
                expect(node.parentNode).not.toBe(null);
                done();
            }, timeout);
        });
    });
});
