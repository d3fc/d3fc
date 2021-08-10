import type { ScaleIdentity } from 'd3-scale';
import type { Axis } from 'd3-axis';
import type { Selection } from 'd3-selection';

// To be eventually replaced by type from @d3fc/d3fc-axis
interface AxisD3fc<Domain> extends Axis<Domain> {
    tickCenterLabel(): boolean;
    tickCenterLabel(tickCenterLabel: boolean): this;
}

export type Functor<T> = ((...args: any[]) => T);

type TypeOrFunctor<T> = T | Functor<T>;

type AnyFunction = (...args: any[]) => any;

export interface WebglPlotAreaComponent {
    (d: any): any;
    context(canvas: HTMLCanvasElement): this;
    pixelRatio(pixelRatio: number): this;
    xScale(scale: any): this;
    yScale(scale: any): this;
}

export interface CanvasPlotAreaComponent {
    (d: any): any;
    context(canvas: HTMLCanvasElement): this;
    xScale(scale: any): this;
    yScale(scale: any): this;
}

export interface SvgPlotAreaComponent {
    (d: any): any;
    xScale(scale: any): this;
    yScale(scale: any): this;
}

type Decorator = (container: Selection<any, any, any, any>, data: any, index: number) => void;

type PrefixProperties<T, Prefix extends string> = {
    [Property in keyof T as `${Prefix}${Capitalize<string & Property>}`]: T[Property]
};

type AnyMethods<T> = {
    [Property in keyof T]: T[Property] extends AnyFunction ? AnyFunction : T[Property]
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type NotStartsWith<K, TPrefix extends string> = K extends `${TPrefix}${infer _}` ? never : K;

type OmitPrefixes<T> = {[K in keyof T as NotStartsWith<K, 'range' | 'tickFormat'> ]: T[K]};

type XOrient = 'top' | 'bottom' | 'none';
type YOrient = 'left' | 'right' | 'none';

/**
 * Cartesian Chart
 */
export type CartesianChart<XScale, YScale> = {
    (selection: Selection<any, any, any, any>): void;

    /**
     * Returns the existing component.
     */
    canvasPlotArea(): CanvasPlotAreaComponent | null;

    /**
     * Sets the component to render onto the canvas, and returns the Cartesian chart. 
     * For series that contain a very high number of data-points, rendering to canvas can reduce the rendering time and improve performance. 
     * For `canvasPlotArea` and `webglPlotArea`, the relevant context is automatically applied to the chart.
     * @param component
     */
    canvasPlotArea(component: CanvasPlotAreaComponent): CartesianChart<XScale, YScale>;

    /**
     * Returns a function that returns chartLabel.
     */
    chartLabel(): Functor<string>;

    /**
      * If `label` is specified, sets the text for the given label, and returns the Cartesian chart. 
      * The `label` value can either be a string, or a function that returns a string. 
      * If it is a function, it will be invoked with the data that is 'bound' to the chart. 
      * This can be useful if you are rendering multiple charts using a data join.
      * @param label 
      */
    chartLabel(label: TypeOrFunctor<string>): CartesianChart<XScale, YScale>;

    /**
     * Returns the current decorator function.
     */   
    decorate(): Decorator;

    /**
     * Sets the decorator function to the specified, and returns the Cartesian chart. 
     * @param decorateFunc 
     */
    decorate(decorateFunc: Decorator): CartesianChart<XScale, YScale>;

    /**
     * Returns the existing component.
     */
    svgPlotArea(): SvgPlotAreaComponent | null;

    /**
     * Sets the component to render onto the SVG, and returns the Cartesian chart. 
     * For components that require user-interaction, rendering to SVG can simplify their implementation.
     * @param component
     */
    svgPlotArea(component: SvgPlotAreaComponent): CartesianChart<XScale, YScale>;

    /**
     * Returns the current useDevicePixelRatio value.
     */
    useDevicePixelRatio(): boolean;

    /**
     * Sets whether the Canvas / WebGL should be scaled based on the resolution of the display device, and returns the Cartesian chart. 
     * @param useDevicePixelRatio 
     */
    useDevicePixelRatio(useDevicePixelRatio: boolean): CartesianChart<XScale, YScale>;

    /**
     * Returns the existing component.
     */
    webglPlotArea(): WebglPlotAreaComponent | null;

    /**
     * Sets the component to render, and returns the Cartesian chart. 
     * For `canvasPlotArea` and `webglPlotArea`, the relevant context is automatically applied to the chart.
     * @param component
     */
    webglPlotArea(component: WebglPlotAreaComponent): CartesianChart<XScale, YScale>;

    /**
     * Returns the x-axis height or null if not set. 
     */
    xAxisHeight(): Functor<string>;

    /**
     * If `height` is specified, sets the height for the x-axis, and returns the Cartesian chart. 
     * The value should be a string with units (e.g. "2em"). 
     * 
     * The `height` value can either be a string, or a function that returns a string. 
     * If it is a function, it will be invoked with the data that is 'bound' to the chart. 
     * 
     * This can be useful if you are rendering multiple charts using a data join.
     * @param height 
     */
    xAxisHeight(height: TypeOrFunctor<string>): CartesianChart<XScale, YScale>;

    /**
     * Returns the current decorator function.
     */   
    xDecorate(): Decorator;

    /**
     * Sets the decorator function to the specified, and returns the Cartesian chart. 
     * @param decorateFunc 
     */
    xDecorate(decorateFunc: Decorator): CartesianChart<XScale, YScale>;

    /**
     * Returns a function that returns xLabel.
     */
    xLabel(): Functor<string>;

    /**
     * If `label` is specified, sets the text for the given label, and returns the Cartesian chart. 
     * The `label` value can either be a string, or a function that returns a string. 
     * If it is a function, it will be invoked with the data that is 'bound' to the chart. 
     * This can be useful if you are rendering multiple charts using a data join.
     * @param label 
     */
    xLabel(label: TypeOrFunctor<string>): CartesianChart<XScale, YScale>;

    /**
     * Returns a function that returns the orientation. 
     */
    xOrient(): Functor<XOrient>;

    /**
      * Sets the orientation for the axis in the given direction, and returns the Cartesian chart. 
      * Valid values for `xOrient` are `"top"`, `"bottom"` or `"none"`.
      * The value can either be a string, or a function that returns a string. 
      * If it is a function, it will be invoked with the data that is 'bound' to the chart. 
      * This can be useful if you are rendering multiple charts using a data join.
      * @param orient 
      */
    xOrient(orient: TypeOrFunctor<XOrient>): CartesianChart<XScale, YScale>;

    /**
     * Returns the y-axis width or null if not set. 
     */
    yAxisWidth(): Functor<string>;

    /**
      * If `width` is specified, sets the width for the y-axis, and returns the Cartesian chart. 
      * The value should be a string with units (e.g. "2em"). 
      * 
      * The `width` value can either be a string, or a function that returns a string. 
      * If it is a function, it will be invoked with the data that is 'bound' to the chart. 
      * 
      * This can be useful if you are rendering multiple charts using a data join.
      * @param width 
      */
    yAxisWidth(width: TypeOrFunctor<string>): CartesianChart<XScale, YScale>;

    /**
     * Returns the current decorator function.
     */   
    yDecorate(): Decorator;

    /**
     * Sets the decorator function to the specified, and returns the Cartesian chart. 
     * @param decorateFunc 
     */
    yDecorate(decorateFunc: Decorator): CartesianChart<XScale, YScale>;

    /**
     * Returns a function that returns yLabel.
     */
    yLabel(): Functor<string>;

     /**
      * If `label` is specified, sets the text for the given label, and returns the Cartesian chart. 
      * The `label` value can either be a string, or a function that returns a string. 
      * If it is a function, it will be invoked with the data that is 'bound' to the chart. 
      * This can be useful if you are rendering multiple charts using a data join.
      * @param label 
      */
    yLabel(label: TypeOrFunctor<string>): CartesianChart<XScale, YScale>;

    /**
     * Returns a function that returns the orientation. 
     */
    yOrient(): Functor<YOrient>;

    /**
      * Sets the orientation for the axis in the given direction, and returns the Cartesian chart. 
      * Valid values for `yOrient` are `"left"`, `"right"` or `"none"`.
      * The value can either be a string, or a function that returns a string. 
      * If it is a function, it will be invoked with the data that is 'bound' to the chart. 
      * This can be useful if you are rendering multiple charts using a data join.
      * @param orient 
      */
    yOrient(orient: TypeOrFunctor<YOrient>): CartesianChart<XScale, YScale>;
}
    & AnyMethods<PrefixProperties<OmitPrefixes<XScale>, 'x'>>
    & AnyMethods<PrefixProperties<OmitPrefixes<YScale>, 'y'>>
    & AnyMethods<PrefixProperties<AxisD3fc<any>, 'x'>>
    & AnyMethods<PrefixProperties<AxisD3fc<any>, 'y'>>;

export type Fallback<T> = T extends undefined ? ScaleIdentity : T;

export interface Scale {
    range: any;
    domain: any;
}

export interface CartesianChartConfigurationParameter<XScale, YScale> {
    xScale?: XScale;
    yScale?: YScale;
    xAxis?: {
        top?: any;
        bottom?: any;
    };
    yAxis?: {
        left?: any;
        right?: any;
    };
}

// -------------------------------------------------------------------------------
// Cartesian Chart Factory
// -------------------------------------------------------------------------------

/**
 * Constructs a new Cartesian chart with the given scales and axis components.
 * If xAxis is specified, it must be an object with the required x-axis factory function (top if xOrient="top" or bottom if xOrient="bottom").
 * If yAxis is specified, it must be an object with the required y-axis factory function (left if yOrient="left" or right if yOrient="right").
 * @param configuration 
 */
export default function Cartesian<XScale extends Scale | undefined, YScale extends Scale | undefined>(configuration: CartesianChartConfigurationParameter<XScale, YScale>)
    : CartesianChart<Fallback<XScale>, Fallback<YScale>>;

/**
 * Constructs a new Cartesian chart with the given scales.
 * @param xScale 
 * @param yScale 
 */
export default function Cartesian<XScale extends Scale | undefined, YScale extends Scale | undefined>(xScale?: XScale, yScale?: YScale)
    : CartesianChart<Fallback<XScale>, Fallback<YScale>>;

export { };
