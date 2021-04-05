import { TStore } from './store'

export type Functor<T> = ((...args: any[]) => T);
type TypeOrFunctor<T> = T | Functor<T>;

type XOrient = 'top' | 'bottom' | 'none';
type YOrient = 'left' | 'right' | 'none';

type WebglPlotArea = {
    (d: any): any
    context(canvas: HTMLCanvasElement): WebglPlotArea
    pixelRatio(pixelRatio: number): WebglPlotArea,
    xScale(scale: any): WebglPlotArea,
    yScale(scale: any): WebglPlotArea,
};

type CanvasPlotArea = {
    (d: any): any,
    context(canvas: HTMLCanvasElement): CanvasPlotArea,
    xScale(scale: any): CanvasPlotArea,
    yScale(scale: any): CanvasPlotArea,
};

type SvgPlotArea = {
    (d: any): any,
    xScale(scale: any): SvgPlotArea,
    yScale(scale: any): SvgPlotArea,
};

type Decorator = (container: d3.Selection<any, any, any, any>, data: any, index: number) => void

type StoreProperties = 'tickFormat' | 'ticks' | 'tickArguments' | 'tickSize' | 'tickSizeInner' | 'tickSizeOuter' | 'tickValues' | 'tickPadding' | 'tickCenterLabel';

type XAxisStore = TStore<`x${Capitalize<StoreProperties>}`>;
type YAxisStore = TStore<`y${Capitalize<StoreProperties>}`>;

type GetterSetter<TThis, TValue, TSetValue> = {
    (): TValue
    (value: TSetValue): TThis,
}

type CartesianChartScale<Scale, XScale, YScale, Prefix extends string> = {
    [Property in keyof Scale as `${Prefix}${Capitalize<string & Property>}`]: Scale[Property] extends GetterSetter<any, infer U, infer V>
    ? GetterSetter<CartesianChart<XScale, YScale>, U, V>
    : Scale[Property]
}

export type CartesianChartArgs<XScale, YScale> = [xScale: XScale, yScale?: YScale] | [{
    xScale?: XScale,
    yScale?: YScale,
    xAxis: {
        top: any
        bottom: any
    },
    yAxis: {
        left: any
        right: any
    }
}]

type TCartesianChart = typeof Cartesian;

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
    & XAxisStore
    & YAxisStore
    & CartesianChartScale<XScale, XScale, YScale, 'x'>
    & CartesianChartScale<YScale, XScale, YScale, 'y'>

export default function Cartesian<XScale, YScale>(...args: CartesianChartArgs<XScale, YScale>): CartesianChart<XScale, YScale>
