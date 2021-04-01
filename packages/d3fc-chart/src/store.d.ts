export default function <StoreProperty extends string>(...names: StoreProperty[]):
    Record<StoreProperty, any> &
    (<TTarget>(target: TTarget) => TTarget);
