import jsdom from 'jsdom';
import { select } from 'd3-selection';
import pointer from '../src/pointer';

describe('pointer', () => {

    let element;
    let pointSpy;

    beforeEach(() => {
        global.document = jsdom.jsdom('<div id="element"></div>');
        element = document.querySelector('#element');

        pointSpy = jasmine.createSpy('pointSpy');
        const pointerInstance = pointer()
            .on('point', pointSpy);

        select(element)
            .call(pointerInstance);
    });

    describe('mouseenter', () => {
        beforeEach(() => {
            element.dispatchEvent(new document.defaultView.MouseEvent('mouseenter'));
        });

        it('should call the callback', () => {
            expect(pointSpy.calls.count()).toEqual(1);
        });

        it('should call the callback with an array', () => {
            expect(pointSpy).toHaveBeenCalledWith(jasmine.any(Array));
            const point = pointSpy.calls.argsFor(0)[0][0];
            expect(point.x).not.toBeUndefined();
            expect(point.y).not.toBeUndefined();
        });

        it('should call the callback with the "this" context as the current DOM element', () => {
            expect(pointSpy.calls.mostRecent().object).toBe(element);
        });
    });

    describe('mousemove', () => {
        beforeEach(() => {
            element.dispatchEvent(new document.defaultView.MouseEvent('mousemove'));
        });

        it('should call the callback', () => {
            expect(pointSpy.calls.count()).toEqual(1);
        });

        it('should call the callback with an array', () => {
            expect(pointSpy).toHaveBeenCalledWith(jasmine.any(Array));
            const point = pointSpy.calls.argsFor(0)[0][0];
            expect(point.x).not.toBeUndefined();
            expect(point.y).not.toBeUndefined();
        });

        it('should call the callback with the "this" context as the current DOM element', () => {
            expect(pointSpy.calls.mostRecent().object).toBe(element);
        });
    });

    describe('mouseleave', () => {
        beforeEach(() => {
            element.dispatchEvent(new document.defaultView.MouseEvent('mouseleave'));
        });

        it('should call the callback', () => {
            expect(pointSpy.calls.count()).toEqual(1);
        });

        it('should call the callback with an empty array', () => {
            expect(pointSpy).toHaveBeenCalledWith([]);
        });

        it('should call the callback with the "this" context as the current DOM element', () => {
            expect(pointSpy.calls.mostRecent().object).toBe(element);
        });

    });

});
