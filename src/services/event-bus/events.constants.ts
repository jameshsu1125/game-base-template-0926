import EventBus, { EventListener } from "./event-bus.service";

/**
 * Generic Game Events Template
 *
 * This file demonstrates how to structure game-specific events.
 * Replace these example events with your actual game events.
 *
 * Benefits:
 * - Type-safe event handling
 * - Clear separation from app-level events
 * - Easy to extend for different game mechanics
 * - Centralized event documentation
 */

// Example game event payloads (customize for your game)
export interface GameEventPayloads {
    // Core game events
    [GameEvents.GAME_STARTED]: {
        gameMode: string;
        difficulty: number;
    };
    [GameEvents.GAME_PAUSED]: {
        currentScore: number;
        timeElapsed: number;
    };
    [GameEvents.GAME_RESUMED]: {
        timeRemaining: number;
    };
    [GameEvents.GAME_ENDED]: {
        isVictory: boolean;
        finalScore: number;
        duration: number;
    };

    // Player events
    [GameEvents.PLAYER_ACTION]: {
        actionType: string;
        position: { x: number; y: number };
        timestamp: number;
    };
    [GameEvents.SCORE_CHANGED]: {
        previousScore: number;
        newScore: number;
        scoreIncrease: number;
    };

    // Game state events
    [GameEvents.LEVEL_STARTED]: {
        levelNumber: number;
        levelName: string;
    };
    [GameEvents.LEVEL_COMPLETED]: {
        levelNumber: number;
        completionTime: number;
        starsEarned: number;
    };

    // Example game-specific events (customize as needed)
    [GameEvents.ITEM_COLLECTED]: {
        itemType: string;
        itemValue: number;
        collectorId: string;
    };
    [GameEvents.POWER_UP_ACTIVATED]: {
        powerUpType: string;
        duration: number;
        effectStrength: number;
    };
}

// Game event constants
export const GameEvents = {
    // Core game flow events
    GAME_STARTED: "game_started",
    GAME_PAUSED: "game_paused",
    GAME_RESUMED: "game_resumed",
    GAME_ENDED: "game_ended",

    // Player interaction events
    PLAYER_ACTION: "player_action",
    SCORE_CHANGED: "score_changed",

    // Level progression events
    LEVEL_STARTED: "level_started",
    LEVEL_COMPLETED: "level_completed",

    // Game-specific events (customize as needed)
    ITEM_COLLECTED: "item_collected",
    POWER_UP_ACTIVATED: "power_up_activated",
} as const;

// Create game event bus instance
export const gameEventBus = EventBus.getInstance<
    GameEventType,
    GameEventPayloads
>("game");

// Helper type to extract event names from GameEvents
type GameEventType = (typeof GameEvents)[keyof typeof GameEvents];

// Helper functions for type-safe event handling
export function onGameEvent<K extends GameEventType>(
    eventType: K,
    listener: EventListener<GameEventPayloads[K]>
): () => void {
    return gameEventBus.on(eventType, listener);
}

export function emitGameEvent<K extends GameEventType>(
    eventType: K,
    payload: GameEventPayloads[K]
): void {
    gameEventBus.emit(eventType, payload);
}

// Example usage:
// emitGameEvent(GameEvents.GAME_STARTED, { gameMode: "classic", difficulty: 3 });
// onGameEvent(GameEvents.SCORE_CHANGED, (payload) => {
//     console.log(`Score changed from ${payload.previousScore} to ${payload.newScore}`);
// });