import type { ScaleIdentity, ScaleLinear } from 'd3-scale'
import type { TStore, IStoreProperty } from './store'

export type Functor<T> = ((...args: any[]) => T);
type TypeOrFunctor<T> = T | Functor<T>;

type XOrient = 'top' | 'bottom' | 'none';
type YOrient = 'left' | 'right' | 'none';

interface WebglPlotArea {
    (d: any): any
    context(canvas: HTMLCanvasElement): this
    pixelRatio(pixelRatio: number): this,
    xScale(scale: any): this,
    yScale(scale: any): this,
}

interface CanvasPlotArea {
    (d: any): any,
    context(canvas: HTMLCanvasElement): this,
    xScale(scale: any): this,
    yScale(scale: any): this,
}

interface SvgPlotArea {
    (d: any): any,
    xScale(scale: any): this,
    yScale(scale: any): this,
}

type Decorator = (container: d3.Selection<any, any, any, any>, data: any, index: number) => void

export type CartesianChartArgs<XScale, YScale> = [xScale?: XScale, yScale?: YScale] | [{
    xScale?: XScale,
    yScale?: YScale,
    xAxis?: {
        top: any
        bottom: any
    },
    yAxis?: {
        left: any
        right: any
    }
}]

type Function = (...args: any[]) => any;

type PrefixProperties<T, Prefix extends string> = {
    [Property in keyof T as `${Prefix}${Capitalize<string & Property>}`]: T[Property]
}

type AnyMethods<T> = {
    [Property in keyof T]: T[Property] extends Function ? Function : T[Property]
}

type Store = TStore<'tickFormat' | 'ticks' | 'tickArguments' | 'tickSize' | 'tickSizeInner' | 'tickSizeOuter' | 'tickValues' | 'tickPadding' | 'tickCenterLabel'>;

export type CartesianChart<XScale, YScale> = {
    (selection: d3.Selection<any, any, any, any>): void;

    canvasPlotArea(): CanvasPlotArea;
    canvasPlotArea(plotArea: CanvasPlotArea): CartesianChart<XScale, YScale>;

    chartLabel(): Functor<string>;
    chartLabel(label: TypeOrFunctor<string>): CartesianChart<XScale, YScale>;

    decorate(): Decorator;
    decorate(decorate: Decorator): CartesianChart<XScale, YScale>;

    svgPlotArea(): SvgPlotArea;
    svgPlotArea(plotArea: SvgPlotArea): CartesianChart<XScale, YScale>;

    useDevicePixelRatio(): boolean;
    useDevicePixelRatio(useDevicePixelRatio: boolean): CartesianChart<XScale, YScale>;

    webglPlotArea(): WebglPlotArea;
    webglPlotArea(plotArea: WebglPlotArea): CartesianChart<XScale, YScale>;

    xAxisHeight(): Functor<string>;
    xAxisHeight(height: TypeOrFunctor<string>): CartesianChart<XScale, YScale>;

    xDecorate(): Decorator;
    xDecorate(decorate: Decorator): CartesianChart<XScale, YScale>;

    xLabel(): Functor<string>;
    xLabel(label: TypeOrFunctor<string>): CartesianChart<XScale, YScale>;

    xOrient(): Functor<XOrient>;
    xOrient(orient: XOrient): CartesianChart<XScale, YScale>;

    yAxisWidth(): Functor<string>;
    yAxisWidth(height: TypeOrFunctor<string>): CartesianChart<XScale, YScale>;

    yDecorate(): Decorator;
    yDecorate(decorate: Decorator): CartesianChart<XScale, YScale>;

    yLabel(): Functor<string>;
    yLabel(label: TypeOrFunctor<string>): CartesianChart<XScale, YScale>;

    yOrient(): Functor<YOrient>;
    yOrient(orient: YOrient): CartesianChart<XScale, YScale>;
}
    & AnyMethods<PrefixProperties<XScale, 'x'>>
    & AnyMethods<PrefixProperties<YScale, 'y'>>
    & AnyMethods<PrefixProperties<Store, 'x'>>
    & AnyMethods<PrefixProperties<Store, 'y'>>

export default function Cartesian<XScale, YScale>(...args: CartesianChartArgs<XScale, YScale>):
    CartesianChart<
        (unknown & undefined) extends XScale ? ScaleIdentity : XScale,
        (unknown & undefined) extends YScale ? ScaleIdentity : YScale
    >

