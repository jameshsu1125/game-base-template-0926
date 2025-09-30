// Generic application constants - no game logic
export enum AppTheme {
    DARK = "DARK",
    LIGHT = "LIGHT",
}

export const APP_COLORS: Record<AppTheme, Record<string, number>> = {
    [AppTheme.DARK]: {
        PRIMARY: 0x3498db,
        SECONDARY: 0x2c3e50,
        SUCCESS: 0x27ae60,
        WARNING: 0xf39c12,
        DANGER: 0xe74c3c,
        BACKGROUND: 0x2c3e50,
        TEXT_BACKGROUND: 0x34495e,
        MODAL_OVERLAY: 0x000000,
    },
    [AppTheme.LIGHT]: {
        PRIMARY: 0x2980b9,
        SECONDARY: 0xecf0f1,
        SUCCESS: 0x2ecc71,
        WARNING: 0xe67e22,
        DANGER: 0xc0392b,
        BACKGROUND: 0xecf0f1,
        TEXT_BACKGROUND: 0xbdc3c7,
        MODAL_OVERLAY: 0x7f8c8d,
    },
} as const;

export const APP_SIZES = {
    // Screen dimensions
    DEFAULT_WIDTH: 800,
    DEFAULT_HEIGHT: 600,
    MIN_WIDTH: 320,
    MIN_HEIGHT: 240,

    // UI component sizes
    BUTTON_WIDTH: 200,
    BUTTON_HEIGHT: 50,
    BUTTON_PADDING: 10,

    MODAL_MIN_WIDTH: 300,
    MODAL_MIN_HEIGHT: 200,
    MODAL_PADDING: 20,

    TEXT_PADDING: 15,
    TEXT_MIN_SIZE: 12,
    TEXT_MAX_SIZE: 32,

    // Layout spacing
    LAYOUT_MARGIN: 20,
    COMPONENT_SPACING: 15,
} as const;

// Layout positioning constants (percentage-based)
export const LAYOUT_POSITIONS = {
    // Character positioning and sizing
    PLAYER_CHARACTER: {
        X_PERCENT: 0.1, // 10% from left edge
        Y_PERCENT: 0.15, // 15% from top edge
        SIZE_PERCENT: 0.08, // 8% of screen height
        FONT_SIZE_PERCENT: 0.014, // 1.4% of screen height for character names
    },
    ENEMY_CHARACTER: {
        X_PERCENT: 0.9, // 90% from left edge (right side)
        Y_PERCENT: 0.15, // 15% from top edge
        SIZE_PERCENT: 0.08, // 8% of screen height
        FONT_SIZE_PERCENT: 0.014, // 1.4% of screen height for character names
    },

    // UI element positioning and text sizing
    TITLE: {
        Y_OFFSET_PERCENT: -0.15, // 15% above center
        FONT_SIZE_PERCENT: 0.025, // 2.5% of screen height
    },
    DESCRIPTION: {
        Y_OFFSET_PERCENT: -0.05, // 5% above center
        FONT_SIZE_PERCENT: 0.018, // 1.8% of screen height
    },
    BUTTON: {
        Y_OFFSET_PERCENT: 0.05, // 5% below center
        FONT_SIZE_PERCENT: 0.018, // 1.8% of screen height
        WIDTH_PERCENT: 0.2, // 13% of screen width
        HEIGHT_PERCENT: 0.045, // 4.5% of screen height
    },
    STATUS: {
        Y_OFFSET_PERCENT: 0.15, // 15% below center
        FONT_SIZE_PERCENT: 0.018, // 1.8% of screen height
    },
    INSTRUCTIONS: {
        Y_OFFSET_PERCENT: 0.25, // 25% below center
        FONT_SIZE_PERCENT: 0.016, // 1.6% of screen height
    },
    // Modal sizing and typography (percentage-based)
    MODAL: {
        WIDTH_PERCENT: 0.5, // 50% of screen width
        HEIGHT_PERCENT: 0.4, // 40% of screen height
        PADDING_PERCENT: 0.02, // 2% of screen height as internal padding

        TITLE_FONT_SIZE_PERCENT: 0.025, // ~2.5% of screen height
        MESSAGE_FONT_SIZE_PERCENT: 0.018, // ~1.8% of screen height
        BUTTON_FONT_SIZE_PERCENT: 0.018, // ~1.8% of screen height

        BUTTON_WIDTH_PERCENT: 0.13, // 13% of screen width
        BUTTON_HEIGHT_PERCENT: 0.045, // 4.5% of screen height
    },
} as const;

export const APP_FONTS = {
    PRIMARY: "Arial",
    SECONDARY: "Helvetica",
    MONOSPACE: "monospace",
} as const;

export const APP_ANIMATIONS = {
    // Duration in milliseconds
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,

    // Easing functions
    EASE_IN: "Power2.easeIn",
    EASE_OUT: "Power2.easeOut",
    EASE_BOUNCE: "Back.easeOut",
    EASE_ELASTIC: "Elastic.easeOut",
} as const;

// Z-index layers for proper rendering order
export const APP_LAYERS = {
    BACKGROUND: 0,
    UI_BACKGROUND: 100,
    UI_COMPONENTS: 200,
    UI_TEXT: 300,
    MODAL_OVERLAY: 900,
    MODAL_CONTENT: 950,
    DEBUG_OVERLAY: 9999,
} as const;

// Generic application settings
export const APP_SETTINGS = {
    // Debug
    DEBUG_MODE: false,
    SHOW_FPS: false,
    LOG_EVENTS: true,

    // UI
    DEFAULT_THEME: AppTheme.DARK,
    ENABLE_ANIMATIONS: true,
    AUTO_SCALE: true,

    // Performance
    MAX_UI_ELEMENTS: 100,
    EVENT_THROTTLE_MS: 16, // ~60fps

    // Accessibility
    HIGH_CONTRAST: false,
    LARGE_TEXT: false,
} as const;

// Common sprite scale presets (portion of screen width)
export const SPRITE_SCALES = {
    // When set to 1, sprite width equals screen width.
    // Example: 0.1 => sprite width is 10% of screen width.
    NEUTRAL_ATLAS: 0.1,
} as const;

export type AppColor = (typeof APP_COLORS)[keyof typeof APP_COLORS];
export type AppSize = (typeof APP_SIZES)[keyof typeof APP_SIZES];
export type AppFont = (typeof APP_FONTS)[keyof typeof APP_FONTS];
export type AppAnimation = (typeof APP_ANIMATIONS)[keyof typeof APP_ANIMATIONS];
export type AppLayer = (typeof APP_LAYERS)[keyof typeof APP_LAYERS];
export type AppSetting = (typeof APP_SETTINGS)[keyof typeof APP_SETTINGS];
export type SpriteScalePreset =
    (typeof SPRITE_SCALES)[keyof typeof SPRITE_SCALES];

