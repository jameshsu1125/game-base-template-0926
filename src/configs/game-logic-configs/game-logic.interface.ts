/**
 * Generic configuration schema types for any 2D game
 * These interfaces provide a foundation for configuration-driven game development
 */

export type EnumSchema<T extends string> = {
    values: readonly T[];
    default: T;
};

export type BooleanSchema = {
    values: readonly boolean[];
    default: boolean;
};

export type NumericSchema = {
    min: number;
    max: number;
    default: number;
};

export type OptionalNumericSchema = {
    min: number;
    max: number;
    default: undefined;
};

export type StringSchema = {
    values: readonly string[];
    default: string;
};

/**
 * Base configuration schema that any game can extend
 */
export interface BaseGameConfig {
    // Core game settings
    gameTitle: StringSchema;
    gameVersion: StringSchema;

    // Basic game mechanics
    initialScore: NumericSchema;
    targetScore: NumericSchema;

    // UI/UX settings
    animationSpeed: NumericSchema;
    soundEnabled: BooleanSchema;

    // Performance settings
    targetFPS: NumericSchema;
    enableDebug: BooleanSchema;
}