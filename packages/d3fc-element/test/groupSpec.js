describe('group', () => {
    let Group;

    beforeAll(() => {
        global.HTMLElement = class {
            getAttribute() { }
            hasAttribute() { }
            removeAttribute() { }
            setAttribute() { }
        };
        Group = require('../src/group').default;
    });

    afterAll(() => {
        delete global.HTMLElement;
    });

    let addEventListener;
    let removeEventListener;
    let group;

    beforeEach(() => {
        addEventListener = jasmine.createSpy('addEventListener');
        global.addEventListener = addEventListener;
        removeEventListener = jasmine.createSpy('removeEventListener');
        global.removeEventListener = removeEventListener;
        group = new Group();
    });

    afterEach(() => {
        delete global.addEventListener;
        delete global.removeEventListener;
    });

    it('should not add a listener if no auto-resize attribute present when connected', () => {
        spyOn(group, 'hasAttribute').and.returnValue(false);
        group.connectedCallback();
        expect(addEventListener.calls.any()).toEqual(false);
    });

    it('should not add a listener if no auto-resize attribute is false when connected', () => {
        spyOn(group, 'hasAttribute').and.returnValue(true);
        spyOn(group, 'getAttribute').and.returnValue('false');
        group.connectedCallback();
        expect(addEventListener.calls.any()).toEqual(false);
    });

    it('should add a listener if auto-resize attribute is present when connected', () => {
        spyOn(group, 'hasAttribute').and.returnValue(true);
        spyOn(group, 'getAttribute').and.returnValue('');
        group.connectedCallback();
        expect(addEventListener).toHaveBeenCalledWith('resize', group.__autoResizeListener__);
    });

    it('should add a listener if auto-resize attribute has a non false value when connected', () => {
        spyOn(group, 'hasAttribute').and.returnValue(true);
        spyOn(group, 'getAttribute').and.returnValue('true');
        group.connectedCallback();
        expect(addEventListener).toHaveBeenCalledWith('resize', group.__autoResizeListener__);
    });

    it('should remove a listener when disconnected', () => {
        spyOn(group, 'hasAttribute').and.returnValue(true);
        spyOn(group, 'getAttribute').and.returnValue('true');
        group.connectedCallback();
        const listener = group.__autoResizeListener__;
        expect(addEventListener).toHaveBeenCalledWith('resize', listener);
        group.disconnectedCallback();
        expect(removeEventListener).toHaveBeenCalledWith('resize', listener);
        expect(group.__autoResizeListener__).toEqual(null);
        group.disconnectedCallback();
        expect(removeEventListener.calls.count()).toEqual(1);
    });
});
