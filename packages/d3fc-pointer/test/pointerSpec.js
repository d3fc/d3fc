import { select } from 'd3-selection';
import pointer from '../src/pointer';

describe('pointer', () => {

    let element;
    let pointSpy;

    beforeEach(() => {
        document.body.innerHTML = '<div id="element"></div>';
        element = document.querySelector('#element');

        pointSpy = jest.fn();
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
            expect(pointSpy).toHaveBeenCalledTimes(1);
        });

        it('should call the callback with an array', () => {
            expect(pointSpy).toHaveBeenCalledWith([{
                x: expect.any(Number),
                y: expect.any(Number)
            }]);
        });

        it('should call the callback with the "this" context as the current DOM element', () => {
            expect(pointSpy.mock.instances[0]).toBe(element);
        });
    });

    describe('mousemove', () => {
        beforeEach(() => {
            element.dispatchEvent(new document.defaultView.MouseEvent('mousemove'));
        });

        it('should call the callback', () => {
            expect(pointSpy).toHaveBeenCalledTimes(1);
        });

        it('should call the callback with an array', () => {
            expect(pointSpy).toHaveBeenCalledWith([{
                x: expect.any(Number),
                y: expect.any(Number)
            }]);
        });

        it('should call the callback with the "this" context as the current DOM element', () => {
            expect(pointSpy.mock.instances[0]).toBe(element);
        });
    });

    describe('mouseleave', () => {
        beforeEach(() => {
            element.dispatchEvent(new document.defaultView.MouseEvent('mouseleave'));
        });

        it('should call the callback', () => {
            expect(pointSpy).toHaveBeenCalledTimes(1);
        });

        it('should call the callback with an empty array', () => {
            expect(pointSpy).toHaveBeenCalledWith([]);
        });

        it('should call the callback with the "this" context as the current DOM element', () => {
            expect(pointSpy.mock.instances[0]).toBe(element);
        });

    });

});
