This is a dependency injection implementation

1. init the all objects in `system-manager`
2. use the required object where ever you want

##### 1. Your Systems Don't Need to Know About Each Other

This is the biggest win.

-   **Problem Before:** Imagine your `CombatSystem` suddenly needs to create a visual effect. In your old code, you would have to go into `MainScene`, find the line where you create `CombatSystem`, and manually pass your `visualEffectsManager` into its constructor. This is tedious and couples them together inside the scene.
-   **Solution Now:** The `CombatSystem` itself can simply ask for the `VisualEffectsManager` whenever it needs it:
    TypeScript
    ```
    // Inside any method in CombatSystem.ts
    const vfx = ServiceLocator.get<VisualEffectsManager>('vfx');
    vfx.playExplosionEffect();
    ```
    Your `MainScene` is completely untouched. It doesn't need to know or care that `CombatSystem` now uses `vfx`.

---

##### 2. Adding a New System is Trivial

Let's say you want to add an `AudioManager` to your template.

-   **Before:** You would have to add a new property in `MainScene` (`private audioManager!: AudioManager;`), create it in `initializeSystems()`, and then manually pass it to every other manager that needs to play a sound.
-   **Now:**
    1. You create `AudioManager.ts`.
    2. You add one line in `SystemManager.ts`: `ServiceLocator.register('audio', new AudioManager());`.
       That's it. Now **any other system** in your entire game can get access to it with `ServiceLocator.get('audio')`. This makes your template incredibly plug-and-play.

---

##### 3. It Makes Testing Possible

While maybe not a priority now, this is crucial for a robust template. If you wanted to test your `TurnManager` to see if it correctly processes matches, you don't want to run the _entire_ visual effects and collision systems.

With the Service Locator, you can create a "mock" or "fake" service for testing purposes.

```typescript
// In a test file
import ServiceLocator from "../services/ServiceLocator";

// Create a fake VFX manager that does nothing
const fakeVFX = { playEffect: () => console.log("Fake effect played") };

// Register the fake one before the test runs
ServiceLocator.register("vfx", fakeVFX);

// Now when you test your TurnManager, it will use the fake service instead of the real one.
```

In short, you've traded a small amount of initial setup complexity for a massive gain in **flexibility, scalability, and organization**. Your `MainScene` is now clean, your systems are truly independent, and your template is prepared to handle any new feature you can dream up without becoming a tangled mess.

