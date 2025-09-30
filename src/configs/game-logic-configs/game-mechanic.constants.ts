import { BooleanSchema, NumericSchema, StringSchema } from "./game-logic.interface";

/**
 * Generic Game Configuration Template
 *
 * This file demonstrates how to structure game configurations using schema validation.
 * Replace these example configs with your actual game mechanics.
 *
 * Benefits:
 * - Runtime validation of config values
 * - Type-safe configuration access
 * - Easy to extend for different game types
 * - Clear separation between schema and values
 */

// Example game configuration schema
type TemplateGameConfigSchema = {
    // Core game settings
    gameTitle: StringSchema;
    gameVersion: StringSchema;

    // Basic game mechanics (customize for your game type)
    initialScore: NumericSchema;
    targetScore: NumericSchema;
    timeLimit: NumericSchema;

    // UI/UX settings
    animationSpeed: NumericSchema;
    soundEnabled: BooleanSchema;
    showTutorial: BooleanSchema;

    // Performance settings
    targetFPS: NumericSchema;
    enableDebug: BooleanSchema;

    // Example additional settings (customize as needed)
    difficultyLevel: NumericSchema;
    autoSave: BooleanSchema;
};

// Configuration Schema Definition
export const TEMPLATE_GAME_CONFIG_SCHEMA: TemplateGameConfigSchema = {
    // Core game settings
    gameTitle: {
        values: ["My Game", "Game Template"] as const,
        default: "Game Template",
    },
    gameVersion: {
        values: ["1.0.0", "1.0.1", "1.1.0"] as const,
        default: "1.0.0",
    },

    // Basic game mechanics
    initialScore: {
        min: 0,
        max: 1000,
        default: 0,
    },
    targetScore: {
        min: 100,
        max: 10000,
        default: 1000,
    },
    timeLimit: {
        min: 30,
        max: 600,
        default: 180, // 3 minutes
    },

    // UI/UX settings
    animationSpeed: {
        min: 0.5,
        max: 2.0,
        default: 1.0,
    },
    soundEnabled: {
        values: [true, false] as const,
        default: true,
    },
    showTutorial: {
        values: [true, false] as const,
        default: true,
    },

    // Performance settings
    targetFPS: {
        min: 30,
        max: 120,
        default: 60,
    },
    enableDebug: {
        values: [true, false] as const,
        default: false,
    },

    // Example additional settings
    difficultyLevel: {
        min: 1,
        max: 5,
        default: 3,
    },
    autoSave: {
        values: [true, false] as const,
        default: true,
    },
};

// Additional configuration constants
export const TEMPLATE_ADDITIONAL_CONFIGS = {
    ui: {
        fadeInDuration: 500,
        fadeOutDuration: 300,
        buttonHoverScale: 1.1,
    },
    animations: {
        defaultEasing: "ease-out",
        bounceStrength: 0.8,
    },
    audio: {
        masterVolume: 0.7,
        sfxVolume: 0.8,
        musicVolume: 0.6,
    },
};

// Generate the actual configuration values from schema
export const TEMPLATE_GAME_CONFIGS = Object.entries(
    TEMPLATE_GAME_CONFIG_SCHEMA
).reduce(
    (configs, [key, value]) => ({
        ...configs,
        [key]: value.default,
    }),
    {} as {
        [K in keyof typeof TEMPLATE_GAME_CONFIG_SCHEMA]: (typeof TEMPLATE_GAME_CONFIG_SCHEMA)[K]["default"];
    }
);

// Export types for type-safe usage
export type TemplateGameConfig = typeof TEMPLATE_GAME_CONFIGS;
export type ConfigKey = keyof TemplateGameConfig;
export type ConfigValue<K extends ConfigKey> = TemplateGameConfig[K];

// Helper function to validate a config value against its schema
export function validateConfigValue<K extends ConfigKey>(
    key: K,
    value: any
): value is ConfigValue<K> {
    const schema = TEMPLATE_GAME_CONFIG_SCHEMA[key];

    if ('min' in schema && 'max' in schema) {
        // NumericSchema validation
        return typeof value === 'number' && value >= schema.min && value <= schema.max;
    } else if ('values' in schema) {
        // EnumSchema or BooleanSchema validation
        return (schema.values as readonly any[]).includes(value);
    }

    return false;
}

// Helper function to get a config value with type safety
export function getConfigValue<K extends ConfigKey>(key: K): ConfigValue<K> {
    return TEMPLATE_GAME_CONFIGS[key];
}