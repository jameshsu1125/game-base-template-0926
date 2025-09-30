// utils/anchors.ts
export const ANCHORS = {
    CENTER: { x: 0.5, y: 0.5 },
    TOP_LEFT: { x: 0, y: 0 },
    TOP_CENTER: { x: 0.5, y: 0 },
    TOP_RIGHT: { x: 1, y: 0 },
    MIDDLE_LEFT: { x: 0, y: 0.5 },
    MIDDLE_RIGHT: { x: 1, y: 0.5 },
    BOTTOM_LEFT: { x: 0, y: 1 },
    BOTTOM_CENTER: { x: 0.5, y: 1 },
    BOTTOM_RIGHT: { x: 1, y: 1 },

    // Extended anchors for complex layouts
    TOP_QUARTER: { x: 0.5, y: 0.25 },
    BOTTOM_QUARTER: { x: 0.5, y: 0.75 },
    LEFT_QUARTER: { x: 0.25, y: 0.5 },
    RIGHT_QUARTER: { x: 0.75, y: 0.5 },
} as const;
