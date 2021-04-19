export interface GetterSetter<TThis> {
    (): any[];
    (...args: any[]): TThis;
}

export type Store<StoreProperty extends string> = (
    Record<StoreProperty, GetterSetter<Store<StoreProperty>>> &
    (<TTarget>(target: TTarget) => TTarget)
);

export default function <StoreProperty extends string>(...names: StoreProperty[]): Store<StoreProperty>;
