export const core = {
    // Core system (UI structure)
    ink: {
        900: "#0C1C2E",
        700: "#3D5166",
        500: "#5E748A",
    },

    neutral: {
        white: "#FFFFFF",
        glass: "rgba(255,255,255,0.78)",
    },

    background: {
        sky: "#EAF5FC",
        glass: "rgba(255,255,255,0.80)",
    },

    border: "rgba(12, 28, 46, 0.10)",

    // ─────────────────────────────
    // TRANSPORT PALETTE
    // ─────────────────────────────

    transport: {
        metro: "#168388",

        t1: "#F99D1C",
        t2: "#0098CD",
        t3: "#F37021",
        t4: "#005AA3",
        t5: "#C4258F",
        t6: "#7C3E21",
        t7: "#6F818E",
        t8: "#00954C",
        t9: "#D11F2F",

        intercity: {
            blueMountains: "#F99D1C",
            centralCoast: "#D11F2F",
            hunter: "#833134",
            southCoast: "#005AA3",
            southernHighlands: "#00954C",
        },

        ferries: {
            f1: "#00774B",
            f2: "#144734",
            f3: "#648C3C",
            f4: "#BFD730",
            f5: "#286142",
            f6: "#00AB51",
            f7: "#00B189",
            f8: "#55622B",
            f9: "#65B32E",
            f10: "#5AB031",
        },

        lightRail: {
            l1: "#BE1622",
            l2: "#DD1E25",
            l3: "#781140",
            l4: "#BB2043",
            nlr: "#EE343F",
        },

        coaches: "#732A82",
        regional: "#F6891F",
    },
} as const;