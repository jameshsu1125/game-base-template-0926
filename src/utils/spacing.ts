// utils/spacing.ts
export const SPACING = {
    // Percentage-based spacing relative to screen dimensions
    NONE: 0,
    MICRO: 0.005, // 0.5% of screen
    SMALL: 0.01, // 1% of screen
    MEDIUM: 0.02, // 2% of screen
    LARGE: 0.04, // 4% of screen
    XLARGE: 0.08, // 8% of screen
} as const;

/**
 * Calculate spacing in pixels based on screen dimensions
 * @param scene - Phaser scene to get screen dimensions from
 * @param spacingType - Spacing constant from SPACING object
 * @returns Spacing value in pixels
 */
export function calculateSpacing(
    scene: Phaser.Scene,
    spacingType: number
): number {
    return Math.min(scene.scale.width, scene.scale.height) * spacingType;
}

/**
 * Calculate horizontal spacing based on screen width
 * @param scene - Phaser scene to get screen dimensions from
 * @param spacingType - Spacing constant from SPACING object
 * @returns Horizontal spacing value in pixels
 */
export function calculateHorizontalSpacing(
    scene: Phaser.Scene,
    spacingType: number
): number {
    return scene.scale.width * spacingType;
}

/**
 * Calculate vertical spacing based on screen height
 * @param scene - Phaser scene to get screen dimensions from
 * @param spacingType - Spacing constant from SPACING object
 * @returns Vertical spacing value in pixels
 */
export function calculateVerticalSpacing(
    scene: Phaser.Scene,
    spacingType: number
): number {
    return scene.scale.height * spacingType;
}
