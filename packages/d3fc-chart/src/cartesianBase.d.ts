import { CartesianChart, Functor, CartesianChartConfigurationObject, Scale } from "../src/cartesian";
import { ScaleIdentity } from "d3-scale";

export type CartesianBase<XScale, YScale> = Omit<CartesianChart<XScale, YScale>, 'webglPlotArea' | 'canvasPlotArea' | 'svgPlotArea' | 'useDevicePixelRatio'> & {
    plotArea(): Functor<any>;
    plotArea(plotArea: any): CartesianBase<XScale, YScale>;
}

type Fallback<T> = undefined extends T ? ScaleIdentity : T

export function CreateCartesianBase()
    : CartesianBase<ScaleIdentity, ScaleIdentity>;

export function CreateCartesianBase<XScale extends Scale>(xScale: XScale)
    : CartesianBase<XScale, ScaleIdentity>;

export function CreateCartesianBase<YScale extends Scale>(xScale: undefined, yScale: YScale)
    : CartesianBase<ScaleIdentity, YScale>;

export function CreateCartesianBase<XScale extends Scale, YScale extends Scale>(xScale: XScale, yScale: YScale)
    : CartesianBase<XScale, YScale>;

export function CreateCartesianBase<XScale extends Scale | undefined, YScale extends Scale | undefined>(configuration: CartesianChartConfigurationObject<XScale, YScale>)
    : CartesianBase<Fallback<XScale>, Fallback<YScale>>;


