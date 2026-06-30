export const facilityLines = {
    "park-ride-ashfield": ["T1", "T2", "T3"],
    "park-ride-beverly-hills": ["T8"],
    "park-ride-brookvale": ["B1"],
    "park-ride-bella-vista": ["M1"],
    "park-ride-campbelltown-farrow-rd-north": ["T8"],
    "park-ride-campbelltown-hurley-st": ["T8"],
    "park-ride-tallawong-p1": ["M1"],
    "park-ride-tallawong-p2": ["M1"],
    "park-ride-tallawong-p3": ["M1"],
} as const;

export type FacilitySlug = keyof typeof facilityLines;
