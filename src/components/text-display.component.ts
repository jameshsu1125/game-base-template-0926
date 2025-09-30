import Phaser from "phaser";
import { emitAppEvent, AppEvents } from "../services/event-bus/app-events.constants";

export interface TextDisplayConfig {
    text: string;
    fontSize?: string;
    color?: string;
    backgroundColor?: number;
    padding?: number;
    elementId?: string;
    maxWidth?: number;
}

/**
 * Text display component for architecture demonstration
 * Shows: Component pattern, Configuration, Event emission
 */
export default class TextDisplay extends Phaser.GameObjects.Container {
    private elementId: string;
    private textObject!: Phaser.GameObjects.Text;
    private background?: Phaser.GameObjects.Rectangle;
    private config: TextDisplayConfig;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        config: TextDisplayConfig
    ) {
        super(scene, x, y);

        this.config = {
            fontSize: "16px",
            color: "#ffffff",
            padding: 10,
            elementId: "generic-text",
            ...config
        };

        this.elementId = this.config.elementId!;
        this.createTextDisplay();
    }

    private createTextDisplay(): void {
        // Background (optional)
        if (this.config.backgroundColor !== undefined) {
            this.background = this.scene.add.rectangle(0, 0, 0, 0, this.config.backgroundColor);
            this.background.setAlpha(0.8);
            this.add(this.background);
        }

        // Text
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: this.config.fontSize,
            color: this.config.color,
            fontFamily: "Arial",
            align: "center",
            wordWrap: this.config.maxWidth ? { width: this.config.maxWidth } : undefined
        };

        this.textObject = this.scene.add.text(0, 0, this.config.text, textStyle);
        this.textObject.setOrigin(0.5, 0.5);
        this.add(this.textObject);

        // Update background size if exists
        this.updateBackgroundSize();

        // Emit creation event
        emitAppEvent(AppEvents.UI_ELEMENT_CREATED, {
            elementType: "text-display",
            elementId: this.elementId
        });
    }

    private updateBackgroundSize(): void {
        if (this.background) {
            const bounds = this.textObject.getBounds();
            const padding = this.config.padding!;

            this.background.setSize(
                bounds.width + (padding * 2),
                bounds.height + (padding * 2)
            );
        }
    }

    public setText(newText: string): void {
        this.textObject.setText(newText);
        this.updateBackgroundSize();
    }

    public setTextColor(color: string): void {
        this.textObject.setStyle({ color });
    }

    public setBackgroundColor(color: number): void {
        if (this.background) {
            this.background.setFillStyle(color);
        }
    }

    public getText(): string {
        return this.textObject.text;
    }

    public getElementId(): string {
        return this.elementId;
    }

    /**
     * Animation method for demonstration
     */
    public animateIn(): void {
        this.setAlpha(0);
        this.setScale(0.5);

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: "Back.easeOut"
        });
    }

    /**
     * Update text with animation
     */
    public updateTextAnimated(newText: string): void {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            duration: 150,
            ease: "Power2.easeIn",
            onComplete: () => {
                this.setText(newText);
                this.scene.tweens.add({
                    targets: this,
                    scaleX: 1,
                    duration: 150,
                    ease: "Power2.easeOut"
                });
            }
        });
    }
}