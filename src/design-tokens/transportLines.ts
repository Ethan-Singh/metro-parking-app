import { core } from "./core.ts";

export type LineKey =
    | "T1"
    | "T2"
    | "T3"
    | "T4"
    | "T5"
    | "T6"
    | "T7"
    | "T8"
    | "T9"
    | "M1"
    | "F1";

export const LINE_COLOURS: Record<LineKey, string> = {
    M1: core.transport.metro,

    T1: core.transport.t1,
    T2: core.transport.t2,
    T3: core.transport.t3,
    T4: core.transport.t4,
    T5: core.transport.t5,
    T6: core.transport.t6,
    T7: core.transport.t7,
    T8: core.transport.t8,
    T9: core.transport.t9,

    F1: core.transport.ferries.f1,
};