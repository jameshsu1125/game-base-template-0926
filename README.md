# 2D Game Architecture Template

A clean, professional template for 2D games built with Phaser.js, demonstrating modern software architecture patterns and best practices.

## 🎯 Purpose

This template provides a solid foundation for any 2D game development project, featuring:
- **Event-driven architecture** with type-safe event handling
- **Service Locator pattern** for clean dependency injection
- **Manager pattern** for component lifecycle management
- **System-based architecture** for separation of concerns
- **Configuration-driven development** with runtime validation

## 🏗️ Architecture Overview

### Core Patterns

- **Event Bus System**: Type-safe, decoupled communication between game systems
- **Service Locator**: Centralized dependency management and service registration
- **Manager Pattern**: Component lifecycle and UI coordination
- **System Architecture**: Modular, single-responsibility systems
- **Configuration Schema**: Runtime validation with TypeScript type safety

### Key Components

- **Scene Management**: Clean scene initialization with choreographed system startup
- **UI System**: Professional UI component management with event coordination
- **Layout Management**: Responsive layout handling with container management
- **Debug Integration**: Real-time event flow visualization
- **Template Configuration**: Extensible config system with schema validation

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm dev
   ```

3. **Run type checking**:
   ```bash
   pnpm run type-check
   ```

## 📁 Project Structure

```
src/
├── scenes/                    # Phaser game scenes
│   └── main.scene.ts         # Main scene with architecture demo
├── systems/                   # Core game systems
│   ├── app-state.system.ts   # Application state management
│   └── ui.system.ts          # UI coordination system
├── managers/                  # Component managers
│   ├── layout/               # Layout management
│   └── ui.manager.ts         # UI component lifecycle
├── services/                  # Core services
│   ├── event-bus/            # Event system
│   ├── service-locator/      # Dependency injection
│   └── service-registry.service.ts
├── components/               # Reusable UI components
│   ├── modal.component.ts    # Modal dialog system
│   ├── simple-button.component.ts
│   └── text-display.component.ts
├── configs/                  # Game configuration
│   ├── game-logic-configs/   # Game mechanics config
│   ├── app-constants.ts      # App-level constants
│   └── game-constants.ts     # Game-specific constants
└── ui/                       # UI utilities
    └── debug-overlay.ts      # Development debug tools
```

## 🎮 Demo Features

The template includes a working demo that showcases:

- **Button Click → Event → System → Manager** flow
- **Type-safe event emission and handling**
- **Modal dialog system with lifecycle management**
- **Debug overlay showing real-time event flows**
- **Responsive layout management**

## 🔧 Configuration System

### Game Configuration Schema

```typescript
// Example: Numeric configuration with validation
initialScore: {
    min: 0,
    max: 1000,
    default: 0,
},

// Example: Boolean configuration
soundEnabled: {
    values: [true, false] as const,
    default: true,
},
```

### Usage

```typescript
import { getConfigValue, validateConfigValue } from './configs/game-logic-configs/game-mechanic.constants';

// Type-safe config access
const initialScore = getConfigValue('initialScore');

// Runtime validation
const isValid = validateConfigValue('initialScore', someValue);
```

## 📡 Event System

### App Events (Architecture-level)
```typescript
// UI interactions
emitAppEvent(AppEvents.UI_BUTTON_CLICKED, {
    buttonId: 'demo-button',
    position: { x: 100, y: 200 }
});

// Modal lifecycle
emitAppEvent(AppEvents.MODAL_OPENED, { modalType: 'demo-modal' });
```

### Game Events (Game-specific)
```typescript
// Game state changes
emitGameEvent(GameEvents.GAME_STARTED, {
    gameMode: 'classic',
    difficulty: 3
});

// Player actions
emitGameEvent(GameEvents.PLAYER_ACTION, {
    actionType: 'move',
    position: { x: 100, y: 200 },
    timestamp: Date.now()
});
```

## 🛠️ Customization Guide

### 1. Replace Template Game Logic
- Update `src/configs/game-constants.ts` with your game elements
- Modify `src/configs/game-logic-configs/game-mechanic.constants.ts` with your game rules
- Replace template events in `src/services/event-bus/events.constants.ts`

### 2. Add Your Game Systems
- Create new systems in `src/systems/` following the existing patterns
- Register new systems in `src/services/service-registry.service.ts`
- Initialize systems in `src/scenes/main.scene.ts`

### 3. Customize UI Components
- Extend existing components in `src/components/`
- Add new UI managers to handle component lifecycle
- Update layout management for your game's needs

## 🎨 UI Components

### Modal System
```typescript
const modal = templateLayoutManager.createModal();
modal.createTitle("Game Over");
modal.createMessage("You scored 1000 points!");
modal.createButton("Play Again", () => restartGame());
modal.show();
```

### Button Component
```typescript
const button = new SimpleButton(scene, x, y, {
    text: "Start Game",
    buttonId: "start-btn",
    width: 200,
    height: 60
});
```

## 🏆 Architecture Benefits

- **Type Safety**: Full TypeScript integration with strict typing
- **Maintainability**: Clear separation of concerns and modular design
- **Scalability**: Event-driven architecture supports complex game systems
- **Testability**: Dependency injection enables easy unit testing
- **Professional**: Industry-standard patterns and practices
- **Extensible**: Easy to add new systems, components, and features

## 📈 Development Workflow

1. **Plan your systems** using the existing architecture patterns
2. **Create configuration schema** for your game mechanics
3. **Define game-specific events** for system communication
4. **Build systems incrementally** with proper service registration
5. **Use debug overlay** to visualize event flows during development
6. **Type-check frequently** to catch issues early

## 🤝 Contributing

This template is designed to be:
- **Framework agnostic** (easily adaptable to other game engines)
- **Pattern focused** (architecture over implementation)
- **Professional grade** (ready for commercial development)

Perfect for:
- Game development teams
- Rapid prototyping
- Educational purposes
- Code reviews and architectural discussions

---

**Ready to build your next 2D game?** Start customizing the template to match your game's unique mechanics while keeping the professional architecture intact.