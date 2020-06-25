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
        addEventListener = jest.spyOn(global, 'addEventListener');
        removeEventListener = jest.spyOn(global, 'removeEventListener');
        group = new Group();
    });

    afterEach(() => {
        addEventListener.mockRestore();
        removeEventListener.mockRestore();
    });

    it('should not add a listener if no auto-resize attribute present when connected', () => {
        jest.spyOn(group, 'hasAttribute').mockImplementation(() => false);
        group.connectedCallback();
        expect(addEventListener).not.toHaveBeenCalled();
    });

    it('should not add a listener if no auto-resize attribute is false when connected', () => {
        jest.spyOn(group, 'hasAttribute').mockImplementation(() => true);
        jest.spyOn(group, 'getAttribute').mockImplementation(() => 'false');
        group.connectedCallback();
        expect(addEventListener).not.toHaveBeenCalled();
    });

    it('should add a listener if auto-resize attribute is present when connected', () => {
        jest.spyOn(group, 'hasAttribute').mockImplementation(() => true);
        jest.spyOn(group, 'getAttribute').mockImplementation(() => '');
        group.connectedCallback();
        expect(addEventListener).toHaveBeenCalledWith('resize', group.__autoResizeListener__);
    });

    it('should add a listener if auto-resize attribute has a non false value when connected', () => {
        jest.spyOn(group, 'hasAttribute').mockImplementation(() => true);
        jest.spyOn(group, 'getAttribute').mockImplementation(() => 'true');
        group.connectedCallback();
        expect(addEventListener).toHaveBeenCalledWith('resize', group.__autoResizeListener__);
    });

    it('should remove a listener when disconnected', () => {
        jest.spyOn(group, 'hasAttribute').mockImplementation(() => true);
        jest.spyOn(group, 'getAttribute').mockImplementation(() => 'true');
        group.connectedCallback();
        const listener = group.__autoResizeListener__;
        expect(addEventListener).toHaveBeenCalledWith('resize', listener);
        group.disconnectedCallback();
        expect(removeEventListener).toHaveBeenCalledWith('resize', listener);
        expect(group.__autoResizeListener__).toEqual(null);
        group.disconnectedCallback();
        expect(removeEventListener).toHaveBeenCalledTimes(1);
    });
});
