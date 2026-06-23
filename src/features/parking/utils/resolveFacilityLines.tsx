import type {LineKey} from "../../../design-tokens/transportLines.ts";

export function resolveFacilityLines(slug: string): LineKey[] {
    // ── Metro
    if (slug.includes("bella-vista") || slug.includes("cherrybrook")) {
        return ["M1"];
    }

    // ── T1 corridor
    if (
        slug.includes("ashfield") ||
        slug.includes("brookvale") ||
        slug.includes("emu-plains")
    ) {
        return ["T1"];
    }

    // ── T2 / T8 overlaps (example interchange)
    if (slug.includes("kogarah") || slug.includes("riverwood")) {
        return ["T2"];
    }

    if (slug.includes("campbelltown")) {
        return ["T8", "T2"]; // INTERCHANGE EXAMPLE
    }

    // ── Fallback
    return [];
}