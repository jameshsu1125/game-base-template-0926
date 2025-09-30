# Component Architecture Rules

## Core Principle: Separation of Concerns via Manager Pattern

### Rule 1: Component Creation and Management

-   **Don't create singleton instances for components**
    -   Create them on Managers (e.g., GameAreaManager)
    -   If GameAreaManager gets bigger, create standalone Managers for each component group
-   **Systems can manipulate components ONLY via Managers**
    -   ❌ FORBIDDEN: `System` → `ServiceLocator.get<Component>()` → `Component.method()`
    -   ✅ REQUIRED: `System` → `ServiceLocator.get<Manager>()` → `Manager.method()`

### Rule 2: Direct Component Access Violations

**Systems MUST NOT directly access UI components through ServiceLocator:**

```typescript
// ❌ ARCHITECTURAL VIOLATION:
export default class GameStateSystem {
    private endGameModal!: EndGameModal;

    public initialize(): void {
        this.endGameModal = ServiceLocator.get<EndGameModal>("endGameModal"); // WRONG!
    }

    private showModal(): void {
        this.endGameModal.showEndGame(message); // WRONG!
    }
}
```

**Instead, Systems should use Manager methods:**

```typescript
// ✅ CORRECT ARCHITECTURE:
export default class GameStateSystem {
    private gameAreaManager!: GameAreaManager;

    public initialize(): void {
        this.gameAreaManager =
            ServiceLocator.get<GameAreaManager>("gameAreaManager"); // CORRECT
    }

    private showModal(message: string, isVictory: boolean): void {
        if (isVictory) {
            this.gameAreaManager.showVictoryModal(() => this.restart()); // CORRECT
        } else {
            this.gameAreaManager.showGameOverModal("Game Over", message, () =>
                this.restart()
            ); // CORRECT
        }
    }
}
```

### Rule 3: Scene Responsibilities

**MainScene MUST NOT directly manage UI component composition:**

```typescript
// ❌ ARCHITECTURAL VIOLATION:
export default class MainScene {
    private endGameModal!: EndGameModal;

    private initializeSystems(): void {
        const modalContentArea = gameAreas.modal.getContentArea();
        this.endGameModal.initialize(modalContentArea); // WRONG! Scene managing UI composition
    }
}
```

**Managers should handle all UI component lifecycle:**

```typescript
// ✅ CORRECT ARCHITECTURE:
export default class GameAreaManager {
    private createModal(): void {
        const modal = new Modal(this.scene, { width: 350, height: 250 });
        // Manager handles all modal composition internally
        this.gameAreas.modal = modal;
    }

    public showGameOverModal(
        title: string,
        message: string,
        onRestart?: () => void
    ): void {
        // Manager creates content dynamically as needed
        this.gameAreas.modal.clearContent();
        this.gameAreas.modal.createTitle(title);
        this.gameAreas.modal.createMessage(message);
        if (onRestart) {
            this.gameAreas.modal.createButton("Play Again", onRestart);
        }
        this.gameAreas.modal.show();
    }
}
```

### Benefits of This Architecture:

1. **Clear Separation**: Systems handle logic, Managers handle UI
2. **Maintainability**: UI changes don't affect System code
3. **Testability**: Systems can be tested with mock Managers
4. **Scalability**: Easy to add new UI components without touching Systems
5. **Consistency**: All UI access follows the same pattern

