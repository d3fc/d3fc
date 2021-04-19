import { CartesianChart, CartesianChartConfigurationParameter, Scale, Fallback } from "./cartesian";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type StartsWith<K, TPrefix extends string> = K extends `${TPrefix}${infer _}` ? K : never;

type PickXYProperties<T> = {
    [K in keyof T as StartsWith<K, 'x' | 'y'> ]: T[K]
};

export type CartesianBaseChart<XScale, YScale> = 
    PickXYProperties<CartesianChart<XScale, YScale>> & 
    Pick<CartesianChart<XScale, YScale>, 'chartLabel'> & 
    {
        /**
         * Returns the existing component.
         */
        plotArea(): any;

        /**
         * Sets the component to render and returns the Cartesian chart. 
         * @param component
         */
        plotArea(component: any): CartesianBaseChart<XScale, YScale>;
    };

/**
 * Constructs a new Cartesian chart with the given scales and axis components.
 * If xAxis is specified, it must be an object with the required x-axis factory function (top if xOrient="top" or bottom if xOrient="bottom").
 * If yAxis is specified, it must be an object with the required y-axis factory function (left if yOrient="left" or right if yOrient="right").
 * @param configuration 
 */
export function CartesianBase<XScale extends Scale | undefined, YScale extends Scale | undefined>(configuration: CartesianChartConfigurationParameter<XScale, YScale>)
    : CartesianBaseChart<Fallback<XScale>, Fallback<YScale>>;

/**
 * Constructs a new Cartesian chart with the given scales.
 * @param xScale 
 * @param yScale 
 */
export function CartesianBase<XScale extends Scale | undefined, YScale extends Scale | undefined>(xScale?: XScale, yScale?: YScale)
    : CartesianBaseChart<Fallback<XScale>, Fallback<YScale>>;

export type CartesianBase = typeof CartesianBase;

export { };
