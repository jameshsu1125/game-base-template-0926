import { emitAppEvent, AppEvents, onAppEvent } from "../services/event-bus/app-events.constants";

/**
 * Pure application state system - no game logic
 * Demonstrates: System pattern, Event handling, State management
 */
export default class AppStateSystem {
    private isInitialized: boolean = false;
    private currentScene: string = "";
    private appStartTime: number = 0;
    private eventUnsubscribers: Array<() => void> = [];

    constructor() {}

    public initialize(sceneName: string): void {
        if (this.isInitialized) {
            console.warn("[AppStateSystem] Already initialized");
            return;
        }

        this.currentScene = sceneName;
        this.appStartTime = Date.now();
        this.isInitialized = true;

        this.setupEventListeners();

        // Emit initialization event
        emitAppEvent(AppEvents.APP_INITIALIZED, {
            timestamp: this.appStartTime
        });

        console.log(`[AppStateSystem] Initialized for scene: ${sceneName}`);
    }

    private setupEventListeners(): void {
        // Listen to scene changes
        const unsubSceneReady = onAppEvent(AppEvents.SCENE_READY, (payload) => {
            this.currentScene = payload.sceneName;
            console.log(`[AppStateSystem] Scene ready: ${payload.sceneName}`);
        });

        // Listen to config loading
        const unsubConfigLoaded = onAppEvent(AppEvents.CONFIG_LOADED, (payload) => {
            console.log(`[AppStateSystem] Config loaded: ${payload.configName}`);
        });

        // Listen to UI interactions for app activity tracking
        const unsubButtonClick = onAppEvent(AppEvents.UI_BUTTON_CLICKED, (payload) => {
            console.log(`[AppStateSystem] Button clicked: ${payload.buttonId} at (${payload.position.x}, ${payload.position.y})`);
        });

        this.eventUnsubscribers.push(
            unsubSceneReady,
            unsubConfigLoaded,
            unsubButtonClick
        );
    }

    /**
     * Get current application state
     */
    public getAppState(): {
        isInitialized: boolean;
        currentScene: string;
        uptime: number;
    } {
        return {
            isInitialized: this.isInitialized,
            currentScene: this.currentScene,
            uptime: Date.now() - this.appStartTime
        };
    }

    /**
     * Check if app is ready for interactions
     */
    public isReady(): boolean {
        return this.isInitialized && this.currentScene !== "";
    }

    /**
     * Set current scene (for scene management)
     */
    public setCurrentScene(sceneName: string): void {
        this.currentScene = sceneName;
        emitAppEvent(AppEvents.SCENE_READY, { sceneName });
    }

    /**
     * Get app uptime in milliseconds
     */
    public getUptime(): number {
        return this.isInitialized ? Date.now() - this.appStartTime : 0;
    }

    /**
     * Clean up resources
     */
    public destroy(): void {
        this.eventUnsubscribers.forEach((unsubscribe) => unsubscribe());
        this.eventUnsubscribers = [];
        this.isInitialized = false;

        console.log("[AppStateSystem] Destroyed");
    }
}