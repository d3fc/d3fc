export default function (element?: string, className?: string): {
    <TContainer extends d3.Selection<any, any, any, any>>(container: TContainer, data: any): TContainer;
    element(...args: any[]): any;
    className(...args: any[]): any;
    key(...args: any[]): (_: any, i: any) => any;
    transition(...args: any[]): any;
}

export const effectivelyZero: number;

export function isTransition(selectionOrTransition: any): boolean;