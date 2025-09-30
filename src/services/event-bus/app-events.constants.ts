import EventBus, { EventListener } from "./event-bus.service";

// Pure application events - no game logic
export interface AppEventPayloads {
    [AppEvents.APP_INITIALIZED]: { timestamp: number };
    [AppEvents.UI_BUTTON_CLICKED]: { buttonId: string; position: { x: number; y: number } };
    [AppEvents.UI_ELEMENT_CLICKED]: { elementId: string; elementType: string; position: { x: number; y: number }; [key: string]: any };
    [AppEvents.MODAL_OPENED]: { modalType: string };
    [AppEvents.MODAL_CLOSED]: { modalType: string };
    [AppEvents.CONFIG_LOADED]: { configName: string };
    [AppEvents.SCENE_READY]: { sceneName: string };
    [AppEvents.UI_ELEMENT_CREATED]: { elementType: string; elementId: string };
    [AppEvents.LAYOUT_UPDATED]: { width: number; height: number };
}

export const AppEvents = {
    // Core application lifecycle
    APP_INITIALIZED: "app_initialized",
    CONFIG_LOADED: "config_loaded",
    SCENE_READY: "scene_ready",

    // Generic UI events
    UI_BUTTON_CLICKED: "ui_button_clicked",
    UI_ELEMENT_CLICKED: "ui_element_clicked",
    UI_ELEMENT_CREATED: "ui_element_created",

    // Modal system
    MODAL_OPENED: "modal_opened",
    MODAL_CLOSED: "modal_closed",

    // Layout system
    LAYOUT_UPDATED: "layout_updated",
} as const;

export const appEventBus = EventBus.getInstance<
    AppEventType,
    AppEventPayloads
>("app");

// Helper type to extract event names from AppEvents
type AppEventType = (typeof AppEvents)[keyof typeof AppEvents];

// Type-safe helper functions for app events
export function onAppEvent<K extends AppEventType>(
    eventType: K,
    listener: EventListener<AppEventPayloads[K]>
): () => void {
    // Enhanced logging for debug overlay
    const enhancedListener = (payload: AppEventPayloads[K]) => {
        console.log(`🎯 App Event Received: ${eventType}`, payload);
        listener(payload);
    };

    return appEventBus.on(eventType, enhancedListener);
}

export function emitAppEvent<K extends AppEventType>(
    eventType: K,
    payload: AppEventPayloads[K]
): void {
    console.log(`📡 App Event Emitted: ${eventType}`, payload);
    appEventBus.emit(eventType, payload);
}