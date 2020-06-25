import requestRedraw from '../src/requestRedraw';

describe('document', () => {

    beforeEach(() => {
        global.requestAnimationFrame = () => {};
    });

    afterEach(() => {
        delete global.requestAnimationFrame;

        // Jest triggers test environment setup/teardown per test suite,
        // not per test, so we reset '__d3fc-elements__' after each test here.
        delete document['__d3fc-elements__'];
    });

    it('should enqueue a single element', () => {
        document.body.innerHTML = '<div></div>';
        const element = document.querySelector('div');
        requestRedraw(element);
        expect(document['__d3fc-elements__'].queue).toEqual([element]);
    });

    it('should not enqueue a duplicate element', () => {
        document.body.innerHTML = '<div></div>';
        const element = document.querySelector('div');
        requestRedraw(element);
        requestRedraw(element);
        expect(document['__d3fc-elements__'].queue).toEqual([element]);
    });

    it('should enqueue an ancestor and drop the original element', () => {
        document.body.innerHTML = '<div><a></a></div>';
        let element = document.querySelector('a');
        requestRedraw(element);
        expect(document['__d3fc-elements__'].queue).toEqual([element]);
        element = document.querySelector('div');
        requestRedraw(element);
        expect(document['__d3fc-elements__'].queue).toEqual([element]);
    });

    it('should not enqueue element if an ancestor is enqueued', () => {
        document.body.innerHTML = '<div><a></a></div>';
        let element = document.querySelector('div');
        requestRedraw(element);
        expect(document['__d3fc-elements__'].queue).toEqual([element]);
        requestRedraw(document.querySelector('a'));
        expect(document['__d3fc-elements__'].queue).toEqual([element]);
    });
});
