import store from '../src/store';

interface ComponentInstance {
    ticks(...args: any): any;
    ticksValue: any[];
}

const component = () => {
    const instance: any = {};
    instance.ticks = (...args: any[]) => {
        instance.ticksValue = args;
    };
    return instance as ComponentInstance;
};

describe('store', () => {

    it('Should re-apply stored property values', function () {
        // store values for 'ticks' property
        let myStore = store('ticks');
        myStore.ticks(22);

        // re-apply these to a new component
        const componentInstance = component();
        myStore(componentInstance);

        expect(componentInstance.ticksValue).toEqual([22]);
    });

    it('Should re-apply multiple argument values', function () {
        // store values for 'ticks' property
        let myStore = store('ticks');
        myStore.ticks(22, 's');

        // re-apply these to a new component
        const componentInstance = component();
        myStore(componentInstance);

        expect(componentInstance.ticksValue).toEqual([22, 's']);
    });

    it('should throw when target is missing required method', function () {
        // store values for 'ticks' property
        let myStore = store('ticks', 'anotherTicks');
        myStore.ticks(22, 's');
        myStore.anotherTicks(23, 't');

        // re-apply these to a new component
        const componentInstance = component();

        expect(() => myStore(componentInstance)).toThrow();
    })
});
