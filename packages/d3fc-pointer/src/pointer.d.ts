import type {Selection, BaseType} from "d3-selection";

export default function Pointer <
    GElement extends BaseType,
    Datum,
    PElement extends BaseType,
    PDatum
>(selection: Selection<GElement, Datum, PElement, PDatum>): void;
