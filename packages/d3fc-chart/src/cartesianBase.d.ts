import { CartesianChartArgs } from './cartesian';


declare function _default<XScale, YScale>(setPlotArea: any, defaultPlotArea: any): (...args: CartesianChartArgs<XScale, YScale>) => {
    (selection: any): void;
    yLabel(...args: any[]): any;
    plotArea(...args: any[]): any;
    decorate(...args: any[]): any | (() => void);
}
export default _default;
