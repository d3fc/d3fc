import { CartesianChart, Functor, CartesianChartConfigurationObject, Scale, Fallback } from "../src/cartesian";
import { ScaleIdentity } from "d3-scale";

export type CartesianBaseChart<XScale, YScale> = Omit<CartesianChart<XScale, YScale>, 'webglPlotArea' | 'canvasPlotArea' | 'svgPlotArea' | 'useDevicePixelRatio'> & {
    plotArea(): Functor<any>;
    plotArea(plotArea: any): CartesianBaseChart<XScale, YScale>;
}

export function CartesianBase()
    : CartesianBaseChart<ScaleIdentity, ScaleIdentity>;

export function CartesianBase<XScale extends Scale>(xScale: XScale)
    : CartesianBaseChart<XScale, ScaleIdentity>;

export function CartesianBase<YScale extends Scale>(xScale: undefined, yScale: YScale)
    : CartesianBaseChart<ScaleIdentity, YScale>;

export function CartesianBase<XScale extends Scale, YScale extends Scale>(xScale: XScale, yScale: YScale)
    : CartesianBaseChart<XScale, YScale>;

export function CartesianBase<XScale extends Scale | undefined, YScale extends Scale | undefined>(configuration: CartesianChartConfigurationObject<XScale, YScale>)
    : CartesianBaseChart<Fallback<XScale>, Fallback<YScale>>;

export type CartesianBase = typeof CartesianBase;