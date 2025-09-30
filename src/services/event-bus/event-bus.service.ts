// Generic Event Bus for decoupled communication between systems
// Maintains SOLID principles while reducing callback complexity

import { DebugOverlay } from "../../ui/debug-overlay";

export interface EventListener<T = any> {
    (payload: T): void;
}

/**
 * Generic event bus for system communication
 * Follows Observer pattern with strong typing
 *
 * Benefits:
 * - Multiple listeners per event
 * - Type-safe event handling with generics
 * - Easy debugging with event logging
 * - Automatic cleanup capabilities
 * - No direct dependencies between systems
 *
 * @template Events - Union type of event names
 * @template Payloads - Interface mapping event names to their payload types
 */
export default class EventBus<
    Events extends string,
    Payloads extends Record<Events, any>
> {
    private static instances: Map<string, EventBus<any, any>> = new Map();
    private listeners: Map<Events, Set<EventListener>> = new Map();
    private debugMode: boolean = true;
    private busId: string;

    private constructor(busId: string) {
        this.busId = busId;
    }

    /**
     * Get or create an EventBus instance with the given ID
     * @param busId - Unique identifier for this event bus instance
     */
    public static getInstance<E extends string, P extends Record<E, any>>(
        busId: string = "default"
    ): EventBus<E, P> {
        if (!this.instances.has(busId)) {
            this.instances.set(busId, new EventBus<E, P>(busId));
        }
        return this.instances.get(busId) as EventBus<E, P>;
    }

    /**
     * Subscribe to an event with type safety
     * @param eventType - The event to subscribe to
     * @param listener - Callback function that handles the event
     * @returns Unsubscribe function
     */
    public on<K extends Events>(
        eventType: K,
        listener: EventListener<Payloads[K]>
    ): () => void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }

        this.listeners.get(eventType)!.add(listener);

        if (this.debugMode) {
            console.log(
                `[EventBus:${this.busId}] Listener added for: ${eventType}`
            );
        }

        // Return unsubscribe function
        return () => this.off(eventType, listener);
    }

    /**
     * Unsubscribe from an event
     * @param eventType - The event to unsubscribe from
     * @param listener - The listener to remove
     */
    public off<K extends Events>(
        eventType: K,
        listener: EventListener<Payloads[K]>
    ): void {
        const eventListeners = this.listeners.get(eventType);
        if (eventListeners) {
            eventListeners.delete(listener);

            // Clean up empty event types
            if (eventListeners.size === 0) {
                this.listeners.delete(eventType);
            }

            if (this.debugMode) {
                console.log(
                    `[EventBus:${this.busId}] Listener removed for: ${eventType}`
                );
            }
        }
    }

    /**
     * Emit an event to all listeners
     * @param eventType - The event to emit
     * @param payload - Data to send with the event
     */
    public emit<K extends Events>(eventType: K, payload: Payloads[K]): void {
        const eventListeners = this.listeners.get(eventType);

        if (this.debugMode) {
            const msg = `[EventBus:${this.busId}] Emitting: ${eventType}`;
            console.log(msg, payload);

            if (typeof window !== "undefined") {
                DebugOverlay.getInstance().log(msg, payload);
            }
        }

        if (eventListeners) {
            const listenersArray = Array.from(eventListeners);
            listenersArray.forEach((listener) => {
                try {
                    listener(payload);
                } catch (error) {
                    console.error(
                        `[EventBus:${this.busId}] Error in listener for ${eventType}:`,
                        error
                    );
                }
            });
        }
    }

    /**
     * Enable or disable debug mode
     */
    public setDebugMode(enabled: boolean): void {
        this.debugMode = enabled;
    }

    /**
     * Clear all listeners for this event bus
     */
    public clear(): void {
        this.listeners.clear();
        if (this.debugMode) {
            console.log(`[EventBus:${this.busId}] All listeners cleared`);
        }
    }

    /**
     * Get the number of listeners for a specific event
     */
    public getListenerCount(eventType: Events): number {
        return this.listeners.get(eventType)?.size ?? 0;
    }
}

