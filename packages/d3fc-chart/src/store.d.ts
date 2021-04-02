export type TStore<StoreProperty extends string> = Record<StoreProperty, any> & (<TTarget>(target: TTarget) => TTarget);

export default function <StoreProperty extends string>(...names: StoreProperty[]): TStore<StoreProperty>
