import Phaser from "phaser";
import TemplateLayoutManager from "../managers/layout/template-layout.manager";
import UIManager from "../managers/ui.manager";
import ServiceLocator from "../services/service-locator/service-locator.service";
import ServiceRegistry from "../services/service-registry.service";
import AppStateSystem from "../systems/app-state.system";
import UISystem from "../systems/ui.system";
import { DebugOverlay } from "../ui/debug-overlay";
/**
 * MainScene - Clean Template Architecture Demo
 *
 * Template architecture benefits:
 * - Event-driven communication between systems
 * - Service Locator pattern for dependency injection
 * - Manager pattern for component lifecycle
 * - Clean separation of concerns
 * - Type-safe event handling
 * - Scalable and maintainable structure
 * - Professional development patterns
 */
export default class MainScene extends Phaser.Scene {
  // System management

  // Template systems
  private templateLayoutManager!: TemplateLayoutManager;

  // Architecture demo systems
  private appStateSystem!: AppStateSystem;
  private uiSystem!: UISystem;
  private uiManager!: UIManager;

  constructor() {
    super("MainScene");
  }

  /**
   * Create and display the background image
   */
  private createBackground(): void {
    // Add background image and scale to cover the screen
    const background = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "background"
    );
    background.setOrigin(0.5, 0.5);

    // Scale to cover the entire screen while maintaining aspect ratio
    const scaleX = this.scale.width / background.width;
    const scaleY = this.scale.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    // Ensure background is rendered behind everything else
    background.setDepth(-10);

    console.log("[MainScene] Background image added and scaled");
  }

  /**
   * This fn gets called by Phaser.js when the scene is created
   */
  create() {
    this.createBackground();
    // DebugOverlay.getInstance();

    this.getInstances();
    this.initializeChoreography();
  }

  private initializeChoreography(): void {
    this.initializeSystems();

    // TEMPORARILY DISABLED: Hide existing game UI for clean template demo
    // this.towerSystem.createTowers(
    //     this.gameAreaManager.getGameAreas().gameContainer
    // );
    // this.combatSystem.setupCollisionTargets();

    // New architecture demo setup (centered since no game UI)
    // this.createArchitectureDemo();

    this.createMatch3();
  }

  private getInstances(): void {
    // Create ServiceRegistry which handles all service registration
    new ServiceRegistry(this);

    // Get template systems
    this.templateLayoutManager = ServiceLocator.get<TemplateLayoutManager>(
      "templateLayoutManager"
    );

    // Get architecture demo systems
    this.appStateSystem = ServiceLocator.get<AppStateSystem>("appStateSystem");
    this.uiSystem = ServiceLocator.get<UISystem>("uiSystem");
    this.uiManager = ServiceLocator.get<UIManager>("uiManager");
  }

  private initializeSystems(): void {
    // Initialize template layout
    this.templateLayoutManager.createTemplateAreas();

    // Initialize architecture demo systems
    this.appStateSystem.initialize("MainScene");
    this.uiSystem.initialize();
  }

  private createMatch3(): void {
    this.uiManager.createMatch3();
  }

  /**
   * Create architecture demo to showcase template patterns
   */
  private createArchitectureDemo(): void {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Create the demo UI using the UIManager
    this.uiManager.createArchitectureDemo(centerX, centerY);

    console.log("[MainScene] ✨ Template architecture demo created");
  }
}
