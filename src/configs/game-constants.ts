/**
 * Generic Game Constants Template
 *
 * This file demonstrates how to structure game-specific constants.
 * Replace these example constants with your actual game elements.
 */

// Example: Game element types (customize for your game)
export enum GameElementTypes {
    ELEMENT_A = "ELEMENT_A",
    ELEMENT_B = "ELEMENT_B",
    ELEMENT_C = "ELEMENT_C",
    ELEMENT_D = "ELEMENT_D",
}

// Example: Color schemes for game elements
export const ELEMENT_COLORS: Record<GameElementTypes, number> = {
    [GameElementTypes.ELEMENT_A]: 0x3498db, // Blue
    [GameElementTypes.ELEMENT_B]: 0x2ecc71, // Green
    [GameElementTypes.ELEMENT_C]: 0xe74c3c, // Red
    [GameElementTypes.ELEMENT_D]: 0xf1c40f, // Yellow
} as const;

export type ElementColor = (typeof ELEMENT_COLORS)[keyof typeof ELEMENT_COLORS];

// Example: Game state constants
export enum GameStates {
    MENU = "MENU",
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
    GAME_OVER = "GAME_OVER",
    VICTORY = "VICTORY",
}

// Example: Animation constants
export const ANIMATION_DURATIONS = {
    FAST: 200,
    NORMAL: 500,
    SLOW: 1000,
    EXTRA_SLOW: 2000,
} as const;

// Example: Physics constants
export const PHYSICS_CONFIG = {
    GRAVITY: 300,
    BOUNCE: 0.8,
    FRICTION: 0.95,
} as const;

