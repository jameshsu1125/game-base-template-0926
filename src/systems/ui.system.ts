import { emitAppEvent, AppEvents, onAppEvent } from "../services/event-bus/app-events.constants";
import ServiceLocator from "../services/service-locator/service-locator.service";
import UIManager from "../managers/ui.manager";

export interface UIElement {
    elementId: string;
    elementType: string;
    isVisible: boolean;
    createdAt: number;
}

/**
 * Pure UI coordination system - no game logic
 * Demonstrates: System pattern, UI state tracking, Event coordination
 */
export default class UISystem {
    private uiElements: Map<string, UIElement> = new Map();
    private eventUnsubscribers: Array<() => void> = [];
    private isInitialized: boolean = false;

    constructor() {}

    public initialize(): void {
        if (this.isInitialized) {
            console.warn("[UISystem] Already initialized");
            return;
        }

        this.setupEventListeners();
        this.isInitialized = true;

        console.log("[UISystem] Initialized");
    }

    private setupEventListeners(): void {
        // Track UI element creation
        const unsubUICreated = onAppEvent(AppEvents.UI_ELEMENT_CREATED, (payload) => {
            this.registerUIElement(payload.elementId, payload.elementType);
        });

        // Handle button clicks
        const unsubButtonClick = onAppEvent(AppEvents.UI_BUTTON_CLICKED, (payload) => {
            this.handleButtonClick(payload.buttonId, payload.position);
        });

        // Handle UI element clicks (character avatars, etc.)
        const unsubElementClick = onAppEvent(AppEvents.UI_ELEMENT_CLICKED, (payload) => {
            this.handleElementClick(payload.elementId, payload.elementType, payload.position, payload);
        });

        // Track modal events
        const unsubModalOpened = onAppEvent(AppEvents.MODAL_OPENED, (payload) => {
            console.log(`[UISystem] Modal opened: ${payload.modalType}`);
        });

        const unsubModalClosed = onAppEvent(AppEvents.MODAL_CLOSED, (payload) => {
            console.log(`[UISystem] Modal closed: ${payload.modalType}`);
        });

        // Track layout updates
        const unsubLayoutUpdated = onAppEvent(AppEvents.LAYOUT_UPDATED, (payload) => {
            this.handleLayoutUpdate(payload.width, payload.height);
        });

        this.eventUnsubscribers.push(
            unsubUICreated,
            unsubButtonClick,
            unsubElementClick,
            unsubModalOpened,
            unsubModalClosed,
            unsubLayoutUpdated
        );
    }

    private registerUIElement(elementId: string, elementType: string): void {
        const element: UIElement = {
            elementId,
            elementType,
            isVisible: true,
            createdAt: Date.now()
        };

        this.uiElements.set(elementId, element);
        console.log(`[UISystem] Registered UI element: ${elementType} (${elementId})`);
    }

    private handleButtonClick(buttonId: string, position: { x: number; y: number }): void {
        console.log(`[UISystem] 🖱️  Button click received: ${buttonId} at (${position.x}, ${position.y})`);
        console.log(`[UISystem] 🔄 Processing button action...`);

        // Example: Different behaviors for different buttons
        switch (buttonId) {
            case "demo-button":
                console.log(`[UISystem] 🎯 Routing to demo button handler`);
                this.handleDemoButtonClick();
                break;
            case "config-button":
                console.log(`[UISystem] ⚙️  Routing to config button handler`);
                this.handleConfigButtonClick();
                break;
            default:
                console.log(`[UISystem] 🔧 Routing to generic button handler`);
                this.handleGenericButtonClick(buttonId);
                break;
        }
    }

    private handleDemoButtonClick(): void {
        console.log("[UISystem] 🎯 Demo button handler executing");
        console.log("[UISystem] 🔍 Looking up UIManager via ServiceLocator...");

        // Get UIManager and show the demo modal
        try {
            const uiManager = ServiceLocator.get<UIManager>("uiManager");
            console.log("[UISystem] ✅ UIManager found, calling showDemoModal()");
            uiManager.showDemoModal();
            console.log("[UISystem] 🎊 Modal show request sent to UIManager");
        } catch (error) {
            console.error("[UISystem] ❌ Error showing demo modal:", error);
        }
    }

    private handleConfigButtonClick(): void {
        console.log("[UISystem] Config button clicked - loading config");
        emitAppEvent(AppEvents.CONFIG_LOADED, { configName: "demo-config" });
    }

    private handleGenericButtonClick(buttonId: string): void {
        console.log(`[UISystem] Generic button clicked: ${buttonId}`);
    }

    private handleLayoutUpdate(width: number, height: number): void {
        console.log(`[UISystem] Layout updated to ${width}x${height}`);
        // Could reposition UI elements based on new dimensions
    }

    private handleElementClick(elementId: string, elementType: string, position: { x: number; y: number }, payload: any): void {
        console.log(`[UISystem] 🖱️  UI Element clicked: ${elementType} (${elementId}) at (${position.x}, ${position.y})`);

        switch (elementType) {
            case 'character-avatar':
                this.handleCharacterAvatarClick(elementId, payload);
                break;
            case 'game-board':
                this.handleGameBoardClick(elementId, payload);
                break;
            default:
                console.log(`[UISystem] 🔧 Generic element click handler for: ${elementType}`);
                break;
        }
    }

    private handleCharacterAvatarClick(elementId: string, payload: any): void {
        console.log(`[UISystem] 👤 Character avatar clicked: ${payload.characterName || elementId}`);

        // Example: Show character info modal
        try {
            const uiManager = ServiceLocator.get<UIManager>("uiManager");
            console.log(`[UISystem] 📝 Showing character info for ${payload.characterName}`);

            // You could create a character-specific modal here
            // For now, just update some demo text
            uiManager.updateDemoText("status-text",
                `Character Selected: ${payload.characterName || elementId}`,
                true // animated
            );
        } catch (error) {
            console.error("[UISystem] ❌ Error handling character click:", error);
        }
    }

    private handleGameBoardClick(elementId: string, payload: any): void {
        console.log(`[UISystem] 🎮 Game board element clicked: ${elementId}`);
        // Handle board interactions (tiles, game pieces, etc.)
    }

    /**
     * Get UI element information
     */
    public getUIElement(elementId: string): UIElement | undefined {
        return this.uiElements.get(elementId);
    }

    /**
     * Get all registered UI elements
     */
    public getAllUIElements(): UIElement[] {
        return Array.from(this.uiElements.values());
    }

    /**
     * Get UI elements by type
     */
    public getUIElementsByType(elementType: string): UIElement[] {
        return this.getAllUIElements().filter(element => element.elementType === elementType);
    }

    /**
     * Mark UI element as hidden
     */
    public hideUIElement(elementId: string): void {
        const element = this.uiElements.get(elementId);
        if (element) {
            element.isVisible = false;
            console.log(`[UISystem] UI element hidden: ${elementId}`);
        }
    }

    /**
     * Mark UI element as visible
     */
    public showUIElement(elementId: string): void {
        const element = this.uiElements.get(elementId);
        if (element) {
            element.isVisible = true;
            console.log(`[UISystem] UI element shown: ${elementId}`);
        }
    }

    /**
     * Get statistics about UI elements
     */
    public getUIStats(): {
        totalElements: number;
        visibleElements: number;
        elementTypes: string[];
    } {
        const elements = this.getAllUIElements();
        const visibleElements = elements.filter(e => e.isVisible);
        const elementTypes = [...new Set(elements.map(e => e.elementType))];

        return {
            totalElements: elements.length,
            visibleElements: visibleElements.length,
            elementTypes
        };
    }

    /**
     * Clean up resources
     */
    public destroy(): void {
        this.eventUnsubscribers.forEach((unsubscribe) => unsubscribe());
        this.eventUnsubscribers = [];
        this.uiElements.clear();
        this.isInitialized = false;

        console.log("[UISystem] Destroyed");
    }
}