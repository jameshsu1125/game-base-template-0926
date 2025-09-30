import { APP_COLORS, APP_SETTINGS, APP_SIZES, AppTheme } from "./app-constants";

// Generic template configuration - no game-specific logic
export interface TemplateConfig {
    // Application metadata
    app: {
        name: string;
        version: string;
        author: string;
    };

    // Display settings
    display: {
        width: number;
        height: number;
        backgroundColor: number;
        theme: AppTheme;
    };

    // UI configuration
    ui: {
        enableAnimations: boolean;
        animationSpeed: number;
        autoScale: boolean;
        showDebugInfo: boolean;
    };

    // Architecture demo settings
    demo: {
        showOnStart: boolean;
        autoCloseModal: boolean;
        autoCloseDelay: number;
        demoText: string;
        showEnemyCharacter: boolean;
    };
}

// Default template configuration
export const TEMPLATE_CONFIG: TemplateConfig = {
    app: {
        name: "Game Template",
        version: "1.0.0",
        author: "Template Creator",
    },

    display: {
        width: APP_SIZES.DEFAULT_WIDTH,
        height: APP_SIZES.DEFAULT_HEIGHT,
        backgroundColor: APP_COLORS[AppTheme.DARK].BACKGROUND,
        theme: APP_SETTINGS.DEFAULT_THEME,
    },

    ui: {
        enableAnimations: APP_SETTINGS.ENABLE_ANIMATIONS,
        animationSpeed: 1.0, // Multiplier for animation speeds
        autoScale: APP_SETTINGS.AUTO_SCALE,
        showDebugInfo: APP_SETTINGS.DEBUG_MODE,
    },

    demo: {
        showOnStart: true,
        autoCloseModal: false,
        autoCloseDelay: 3000, // ms
        demoText:
            "This template demonstrates clean architecture patterns for 2D games.",
        showEnemyCharacter: true,
    },
};

// Configuration validation
export function validateConfig(
    config: Partial<TemplateConfig>
): TemplateConfig {
    return {
        app: {
            name: config.app?.name || TEMPLATE_CONFIG.app.name,
            version: config.app?.version || TEMPLATE_CONFIG.app.version,
            author: config.app?.author || TEMPLATE_CONFIG.app.author,
        },

        display: {
            width: Math.max(
                config.display?.width || TEMPLATE_CONFIG.display.width,
                APP_SIZES.MIN_WIDTH
            ),
            height: Math.max(
                config.display?.height || TEMPLATE_CONFIG.display.height,
                APP_SIZES.MIN_HEIGHT
            ),
            backgroundColor:
                config.display?.backgroundColor ||
                TEMPLATE_CONFIG.display.backgroundColor,
            theme: config.display?.theme || TEMPLATE_CONFIG.display.theme,
        },

        ui: {
            enableAnimations:
                config.ui?.enableAnimations ??
                TEMPLATE_CONFIG.ui.enableAnimations,
            animationSpeed: Math.max(
                0.1,
                Math.min(
                    config.ui?.animationSpeed ||
                        TEMPLATE_CONFIG.ui.animationSpeed,
                    3.0
                )
            ),
            autoScale: config.ui?.autoScale ?? TEMPLATE_CONFIG.ui.autoScale,
            showDebugInfo:
                config.ui?.showDebugInfo ?? TEMPLATE_CONFIG.ui.showDebugInfo,
        },

        demo: {
            showOnStart:
                config.demo?.showOnStart ?? TEMPLATE_CONFIG.demo.showOnStart,
            autoCloseModal:
                config.demo?.autoCloseModal ??
                TEMPLATE_CONFIG.demo.autoCloseModal,
            autoCloseDelay: Math.max(
                1000,
                config.demo?.autoCloseDelay ||
                    TEMPLATE_CONFIG.demo.autoCloseDelay
            ),
            demoText: config.demo?.demoText || TEMPLATE_CONFIG.demo.demoText,
            showEnemyCharacter:
                config.demo?.showEnemyCharacter ??
                TEMPLATE_CONFIG.demo.showEnemyCharacter,
        },
    };
}

// Helper function to get current theme colors
export function getCurrentThemeColors(theme: AppTheme = AppTheme.DARK) {
    return APP_COLORS[theme];
}

// Helper function to create custom config
export function createCustomConfig(
    overrides: Partial<TemplateConfig>
): TemplateConfig {
    return validateConfig({
        ...TEMPLATE_CONFIG,
        ...overrides,
    });
}

