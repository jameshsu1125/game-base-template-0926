import Phaser from "phaser";
import { Modal } from "../../components/modal.component";
import { APP_SIZES } from "../../configs/app-constants";
import BaseLayoutManager from "./base-layout.manager";

export interface TemplateAreas {
    mainContainer: Phaser.GameObjects.Container;
    uiContainer: Phaser.GameObjects.Container;
}

export interface TemplateLayoutConfig {
    containerWidth?: number;
    containerHeight?: number;
}

/**
 * TemplateLayoutManager - Clean layout management for template demo
 *
 * Responsibilities:
 * - Create basic layout containers
 * - Position UI elements using BaseLayoutManager
 * - Provide clean interface for template components
 * - Handle responsive layout updates
 */
export default class TemplateLayoutManager {
    private scene: Phaser.Scene;
    private config: Required<TemplateLayoutConfig>;
    private layoutManager: BaseLayoutManager;
    private templateAreas!: TemplateAreas;
    private modal?: Modal;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.config = {
            containerWidth: APP_SIZES.DEFAULT_WIDTH,
            containerHeight: APP_SIZES.DEFAULT_HEIGHT,
        };
        this.layoutManager = new BaseLayoutManager(scene);

        console.log("[TemplateLayoutManager] Initialized");
    }

    /**
     * Create the basic template layout areas
     */
    public createTemplateAreas(): TemplateAreas {
        // Main container for template content
        this.templateAreas = {
            mainContainer: this.scene.add.container(0, 0),
            uiContainer: this.scene.add.container(0, 0)
        };

        // Center containers
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2;

        this.templateAreas.mainContainer.setPosition(centerX, centerY);
        this.templateAreas.uiContainer.setPosition(0, 0);

        console.log("[TemplateLayoutManager] Template areas created");
        return this.templateAreas;
    }

    /**
     * Get template areas
     */
    public getTemplateAreas(): TemplateAreas {
        return this.templateAreas;
    }

    /**
     * Create a modal for demos
     */
    public createModal(): Modal {
        if (this.modal) {
            return this.modal;
        }

        this.modal = new Modal(this.scene, {
            width: 400,
            height: 300
        });

        // Center the modal
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2;
        this.modal.setPosition(centerX, centerY);

        console.log("[TemplateLayoutManager] Modal created");
        return this.modal;
    }

    /**
     * Show a simple modal with content
     */
    public showModal(title: string, content: string, onClose?: () => void): void {
        if (!this.modal) {
            this.createModal();
        }

        this.modal!.clearContent();
        this.modal!.createTitle(title);
        this.modal!.createMessage(content);

        if (onClose) {
            this.modal!.createButton("OK", onClose);
        } else {
            this.modal!.createButton("OK", () => this.hideModal());
        }

        this.modal!.show();
        console.log("[TemplateLayoutManager] Modal shown");
    }

    /**
     * Hide the modal
     */
    public hideModal(): void {
        if (this.modal) {
            this.modal.hide();
            console.log("[TemplateLayoutManager] Modal hidden");
        }
    }

    /**
     * Handle screen resize
     */
    public onResize(width: number, height: number): void {
        // Update container positions if needed
        const centerX = width / 2;
        const centerY = height / 2;

        if (this.templateAreas) {
            this.templateAreas.mainContainer.setPosition(centerX, centerY);
        }

        if (this.modal) {
            this.modal.setPosition(centerX, centerY);
            // Also notify the modal to rescale its internal layout
            if (typeof (this.modal as any).handleResize === "function") {
                (this.modal as any).handleResize();
            }
        }

        console.log(`[TemplateLayoutManager] Layout updated for ${width}x${height}`);
    }

    /**
     * Clean up resources
     */
    public destroy(): void {
        if (this.modal) {
            this.modal.destroy();
            this.modal = undefined;
        }

        if (this.templateAreas) {
            this.templateAreas.mainContainer.destroy();
            this.templateAreas.uiContainer.destroy();
        }

        console.log("[TemplateLayoutManager] Destroyed");
    }
}
