Modal Component — Manager Pattern Demo

Purpose
- Encapsulates a reusable modal UI (overlay, background, title, message, button) with simple animation.
- Stays rendering-focused; no orchestration logic inside.

How It Demonstrates the Manager Pattern
- System (src/systems/ui.system.ts)
  - Listens to app/UI events (e.g., a demo button click).
  - Delegates to a manager to perform UI actions; never constructs UI directly.
- Manager (src/managers/ui.manager.ts)
  - Owns the modal’s lifecycle (create, show, hide, destroy).
  - Composes content by calling component methods: createTitle, createMessage, createButton.
  - Coordinates events (emits MODAL_OPENED / MODAL_CLOSED) and positions the modal.
  - No drawing or low‑level rendering here — only orchestration.
- Component (src/components/modal.component.ts)
  - Implements rendering and interaction for a single UI piece.
  - Provides a small API for composition and animations.
  - Handles proportional sizing in one place.

Flow (System → Manager → Component)
1) User clicks “Show Demo Modal”.
2) UISystem routes the action to UIManager.
3) UIManager composes the modal (title, message, button) and calls modal.show().
4) Modal renders/animates; closing reverses the chain and emits events.

Proportional Sizing
- Uses constants from LAYOUT_POSITIONS.MODAL:
  - WIDTH_PERCENT, HEIGHT_PERCENT, PADDING_PERCENT
  - TITLE/MESSAGE/BUTTON font percents
  - BUTTON width/height percents
- Exposes handleResize() to recompute sizes if you change display dimensions at runtime.

Public API (most used)
- new Modal(scene, { width?, height?, backgroundColor?, overlayColor?, overlayAlpha?, borderRadius?, borderWidth?, borderColor? })
- modal.createTitle(text): Phaser.GameObjects.Text
- modal.createMessage(text): Phaser.GameObjects.Text
- modal.createButton(text, onClick): Phaser.GameObjects.Container
- modal.clearContent(): void
- modal.show(onComplete?): void
- modal.hide(onComplete?): void
- modal.handleResize(): void (call when you change width/height at runtime)

Typical Usage (via Manager)
// ui.manager.ts
const modal = this.createModal();
modal.clearContent();
modal.createTitle("Architecture Demo");
modal.createMessage("This demonstrates the Manager Pattern.\n\nSystems → Managers → Components");
modal.createButton("Got it!", () => this.hideDemoModal());
modal.show();

