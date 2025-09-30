import Phaser from "phaser";
import { emitAppEvent, AppEvents } from "../services/event-bus/app-events.constants";

export interface SimpleButtonConfig {
    text: string;
    width?: number;
    height?: number;
    backgroundColor?: number;
    textColor?: string;
    buttonId?: string;
    fontSize?: string;
}

/**
 * Simple button component for architecture demonstration
 * Shows: Component pattern, Event emission, Basic styling
 */
export default class SimpleButton extends Phaser.GameObjects.Container {
    private buttonId: string;
    private background!: Phaser.GameObjects.Rectangle;
    private text!: Phaser.GameObjects.Text;
    private config: SimpleButtonConfig;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        config: SimpleButtonConfig
    ) {
        super(scene, x, y);

        this.config = {
            width: 200,
            height: 60,
            backgroundColor: 0x3498db,
            textColor: "#ffffff",
            buttonId: "generic-button",
            fontSize: "18px",
            ...config
        };

        this.buttonId = this.config.buttonId!;
        this.createButton();
        this.setupInteractions();
    }

    private createButton(): void {
        // Background
        this.background = this.scene.add.rectangle(
            0,
            0,
            this.config.width!,
            this.config.height!,
            this.config.backgroundColor
        );
        this.background.setStrokeStyle(2, 0x2c3e50);
        this.add(this.background);

        // Text
        this.text = this.scene.add.text(0, 0, this.config.text, {
            fontSize: this.config.fontSize,
            color: this.config.textColor,
            fontFamily: "Arial"
        });
        this.text.setOrigin(0.5, 0.5);
        this.add(this.text);

        // Emit creation event
        emitAppEvent(AppEvents.UI_ELEMENT_CREATED, {
            elementType: "button",
            elementId: this.buttonId
        });
    }

    private setupInteractions(): void {
        // Make interactive
        this.background.setInteractive();

        // Hover effects
        this.background.on("pointerover", () => {
            this.background.setFillStyle(0x2980b9); // Darker blue
            this.setScale(1.05);
        });

        this.background.on("pointerout", () => {
            this.background.setFillStyle(this.config.backgroundColor!);
            this.setScale(1.0);
        });

        // Click handling
        this.background.on("pointerdown", () => {
            this.setScale(0.95);
        });

        this.background.on("pointerup", () => {
            this.setScale(1.05);

            // Emit app event (architecture demonstration)
            emitAppEvent(AppEvents.UI_BUTTON_CLICKED, {
                buttonId: this.buttonId,
                position: { x: this.x, y: this.y }
            });
        });
    }

    public setText(newText: string): void {
        this.text.setText(newText);
    }

    public setButtonId(newId: string): void {
        this.buttonId = newId;
    }

    public getButtonId(): string {
        return this.buttonId;
    }
}