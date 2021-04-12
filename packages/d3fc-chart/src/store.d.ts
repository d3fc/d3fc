export interface IStoreProperty<TThis> {
    (): any[]
    (...args: any[]): TThis
}


export type TStore<StoreProperty extends string> = Record<
    StoreProperty,
    IStoreProperty<TStore<StoreProperty>>
> & (
        <TTarget>(target: TTarget) => TTarget
    );

export default function <StoreProperty extends string>(...names: StoreProperty[]): TStore<StoreProperty>
