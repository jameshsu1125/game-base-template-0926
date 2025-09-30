import Phaser from "phaser";
import { APP_SIZES, LAYOUT_POSITIONS } from "../configs/app-constants";

interface ModalConfig {
    width?: number;
    height?: number;
    backgroundColor?: number;
    overlayColor?: number;
    overlayAlpha?: number;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: number;
}

const DEFAULT_CONFIG: Required<ModalConfig> = {
    width: 300,
    height: 200,
    backgroundColor: 0x2c3e50,
    overlayColor: 0x000000,
    overlayAlpha: 0.8,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 0x3498db,
};

export class Modal extends Phaser.GameObjects.Container {
    private overlay!: Phaser.GameObjects.Rectangle;
    private modalBackground!: Phaser.GameObjects.Graphics;
    private contentArea!: Phaser.GameObjects.Container;
    private config: Required<ModalConfig>;
    private screenWidth: number;
    private screenHeight: number;
    // Proportional sizing constants (from LAYOUT_POSITIONS.MODAL)
    private widthPercent: number;
    private heightPercent: number;

    // Current computed modal size
    private currentWidth: number;
    private currentHeight: number;

    // Keep references to common content so we can rescale on resize
    private titleText?: Phaser.GameObjects.Text;
    private messageText?: Phaser.GameObjects.Text;
    private buttonContainer?: Phaser.GameObjects.Container;
    private buttonBg?: Phaser.GameObjects.Graphics;
    private buttonText?: Phaser.GameObjects.Text;

    // Typography and padding percents from constants
    private titleFontPercent: number;
    private messageFontPercent: number;
    private buttonFontPercent: number;
    private buttonWidthPercent: number;
    private buttonHeightPercent: number;
    private paddingPercent: number;

    constructor(scene: Phaser.Scene, config: ModalConfig = {}) {
        super(scene, 0, 0);

        this.config = { ...DEFAULT_CONFIG, ...config };
        this.screenWidth = scene.scale.width;
        this.screenHeight = scene.scale.height;

        // Use shared constants for proportional sizing
        this.widthPercent = LAYOUT_POSITIONS.MODAL.WIDTH_PERCENT;
        this.heightPercent = LAYOUT_POSITIONS.MODAL.HEIGHT_PERCENT;

        // Compute initial size
        this.currentWidth = this.screenWidth * this.widthPercent;
        this.currentHeight = this.screenHeight * this.heightPercent;

        // Typography and dimensions as percents from constants
        this.titleFontPercent = LAYOUT_POSITIONS.MODAL.TITLE_FONT_SIZE_PERCENT;
        this.messageFontPercent = LAYOUT_POSITIONS.MODAL.MESSAGE_FONT_SIZE_PERCENT;
        this.buttonFontPercent = LAYOUT_POSITIONS.MODAL.BUTTON_FONT_SIZE_PERCENT;
        this.buttonWidthPercent = LAYOUT_POSITIONS.MODAL.BUTTON_WIDTH_PERCENT;
        this.buttonHeightPercent = LAYOUT_POSITIONS.MODAL.BUTTON_HEIGHT_PERCENT;
        this.paddingPercent = LAYOUT_POSITIONS.MODAL.PADDING_PERCENT;

        this.createOverlay();
        this.createModalBackground();
        this.createContentArea();

        // Initially hidden
        this.setVisible(false);

        // Add the fully constructed component to the scene
        scene.add.existing(this);
    }

    private createOverlay(): void {
        this.overlay = this.scene.add.rectangle(
            0,
            0,
            this.screenWidth,
            this.screenHeight,
            this.config.overlayColor,
            this.config.overlayAlpha
        );
        this.overlay.setInteractive();
        this.add(this.overlay);
    }

    private createModalBackground(): void {
        this.modalBackground = this.scene.add.graphics();
        this.redrawModalBackground();
        this.add(this.modalBackground);
    }

    private createContentArea(): void {
        this.contentArea = this.scene.add.container(0, 0);
        this.add(this.contentArea);
    }

    private drawRoundedRect(
        graphics: Phaser.GameObjects.Graphics,
        width: number,
        height: number,
        fillColor: number,
        borderColor?: number,
        borderWidth?: number,
        borderRadius?: number
    ): void {
        graphics.fillStyle(fillColor);

        if (
            borderColor !== undefined &&
            borderWidth !== undefined &&
            borderWidth > 0
        ) {
            graphics.lineStyle(borderWidth, borderColor);
        }

        const x = -width / 2;
        const y = -height / 2;
        const radius = borderRadius || 0;

        graphics.fillRoundedRect(x, y, width, height, radius);

        if (
            borderColor !== undefined &&
            borderWidth !== undefined &&
            borderWidth > 0
        ) {
            graphics.strokeRoundedRect(x, y, width, height, radius);
        }
    }

    private redrawModalBackground(): void {
        this.modalBackground.clear();
        this.drawRoundedRect(
            this.modalBackground,
            this.currentWidth,
            this.currentHeight,
            this.config.backgroundColor,
            this.config.borderColor,
            this.config.borderWidth,
            this.config.borderRadius
        );
    }

    private handleScaleResize(): void {
        // Update cached screen size
        this.screenWidth = this.scene.scale.width;
        this.screenHeight = this.scene.scale.height;

        // Recompute modal size keeping the same relative portion
        this.currentWidth = Math.round(this.screenWidth * this.widthPercent);
        this.currentHeight = Math.round(this.screenHeight * this.heightPercent);

        // Update overlay size to match full screen
        this.overlay.setSize(this.screenWidth, this.screenHeight);
        // setDisplaySize ensures the visual size also updates
        // (safe to call for Rectangle GameObject)
        // @ts-ignore - setDisplaySize exists on GameObjects that support it
        if (typeof (this.overlay as any).setDisplaySize === "function") {
            (this.overlay as any).setDisplaySize(this.screenWidth, this.screenHeight);
        }

        // Redraw modal background with new size
        this.redrawModalBackground();

        // Update content layout and text sizes
        this.updateContentLayout();
    }

    // External API for managers to notify resize
    public handleResize(): void {
        this.handleScaleResize();
    }

    private updateContentLayout(): void {
        // Title position and size
        if (this.titleText) {
            const titleFont = Math.round(this.screenHeight * this.titleFontPercent);
            const padding = Math.max(8, Math.round(this.screenHeight * this.paddingPercent));
            this.titleText.setStyle({ fontSize: `${titleFont}px` });
            this.titleText.setY(-this.currentHeight / 2 + padding + titleFont / 2);
        }

        // Message position and wrap/size
        if (this.messageText) {
            const msgFont = Math.round(this.screenHeight * this.messageFontPercent);
            const padding = Math.max(8, Math.round(this.screenHeight * this.paddingPercent));
            const wrapWidth = Math.max(50, Math.round(this.currentWidth - 2 * padding));
            this.messageText.setStyle({ fontSize: `${msgFont}px`, wordWrap: { width: wrapWidth } as any });
            this.messageText.setY(0);
        }

        // Button size, font, and position at bottom
        if (this.buttonContainer && this.buttonBg && this.buttonText) {
            const btnW = Math.round(this.screenWidth * this.buttonWidthPercent);
            const btnH = Math.round(this.screenHeight * this.buttonHeightPercent);
            const btnFont = Math.round(this.screenHeight * this.buttonFontPercent);
            const padding = Math.max(8, Math.round(this.screenHeight * this.paddingPercent));

            this.buttonBg.clear();
            this.drawRoundedRect(this.buttonBg, btnW, btnH, 0x3498db, 0x2980b9, 2, 8);
            this.buttonContainer.setSize(btnW, btnH);
            this.buttonContainer.setY(this.currentHeight / 2 - (btnH / 2) - padding);
            this.buttonText.setStyle({ fontSize: `${btnFont}px`, fontStyle: "bold" });
        }
    }

    // Public methods for managing modal state
    public show(onComplete?: () => void): void {
        this.setVisible(true);

        // Start with small scale and fade in
        this.modalBackground.setScale(0.8);
        this.modalBackground.setAlpha(0);
        this.contentArea.setScale(0.8);
        this.contentArea.setAlpha(0);

        // Animate entrance
        this.scene.tweens.add({
            targets: [this.modalBackground, this.contentArea],
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 300,
            ease: "Back.easeOut",
            onComplete: onComplete,
        });
    }

    public hide(onComplete?: () => void): void {
        // Animate exit
        this.scene.tweens.add({
            targets: [this.modalBackground, this.contentArea],
            scaleX: 0.8,
            scaleY: 0.8,
            alpha: 0,
            duration: 200,
            ease: "Power2.easeIn",
            onComplete: () => {
                this.setVisible(false);
                if (onComplete) onComplete();
            },
        });
    }

    public isVisible(): boolean {
        return this.visible;
    }

    public getContentArea(): Phaser.GameObjects.Container {
        return this.contentArea;
    }

    public addContent(
        content: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]
    ): void {
        this.contentArea.add(content);
    }

    public clearContent(): void {
        this.contentArea.removeAll(true);
        this.titleText = undefined;
        this.messageText = undefined;
        this.buttonText = undefined;
        this.buttonBg = undefined;
        this.buttonContainer = undefined;
    }

    public setCloseOnOverlayClick(enabled: boolean): void {
        if (enabled) {
            this.overlay.on("pointerdown", () => this.hide());
        } else {
            this.overlay.off("pointerdown");
        }
    }

    public createTitle(text: string): Phaser.GameObjects.Text {
        const titleFont = Math.round(this.screenHeight * this.titleFontPercent);
        const padding = Math.max(8, Math.round(this.screenHeight * this.paddingPercent));
        const titleY = -this.currentHeight / 2 + padding + titleFont / 2;
        const title = this.scene.add
            .text(0, titleY, text, {
                fontSize: `${titleFont}px`,
                fontStyle: "bold",
                color: "#ffffff",
                align: "center",
            })
            .setOrigin(0.5);

        this.titleText = title;
        this.addContent(title);
        return title;
    }

    public createMessage(text: string): Phaser.GameObjects.Text {
        const msgFont = Math.round(this.screenHeight * this.messageFontPercent);
        const padding = Math.max(8, Math.round(this.screenHeight * this.paddingPercent));
        const wrapWidth = Math.max(50, Math.round(this.currentWidth - 2 * padding));
        const message = this.scene.add
            .text(0, 0, text, {
                fontSize: `${msgFont}px`,
                color: "#ffffff",
                align: "center",
                wordWrap: { width: wrapWidth } as any,
            })
            .setOrigin(0.5);

        this.messageText = message;
        this.addContent(message);
        return message;
    }

    public createButton(
        text: string,
        onClick: () => void
    ): Phaser.GameObjects.Container {
        const btnW = Math.round(this.screenWidth * this.buttonWidthPercent);
        const btnH = Math.round(this.screenHeight * this.buttonHeightPercent);
        const padding = Math.max(8, Math.round(this.screenHeight * this.paddingPercent));
        const btnY = this.currentHeight / 2 - (btnH / 2) - padding;

        const buttonContainer = this.scene.add.container(0, btnY);

        const buttonBg = this.scene.add.graphics();
        this.drawRoundedRect(buttonBg, btnW, btnH, 0x3498db, 0x2980b9, 2, 8);

        const btnFont = Math.round(this.screenHeight * this.buttonFontPercent);
        const buttonText = this.scene.add
            .text(0, 0, text, {
                fontSize: `${btnFont}px`,
                fontStyle: "bold",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        buttonContainer.add([buttonBg, buttonText]);
        buttonContainer.setSize(btnW, btnH);
        buttonContainer.setInteractive();
        buttonContainer.on("pointerdown", onClick);

        // Hover effect
        buttonContainer.on("pointerover", () => {
            buttonBg.clear();
            this.drawRoundedRect(buttonBg, buttonContainer.width, buttonContainer.height, 0x5dade2, 0x2980b9, 2, 8);
        });

        buttonContainer.on("pointerout", () => {
            buttonBg.clear();
            this.drawRoundedRect(buttonBg, buttonContainer.width, buttonContainer.height, 0x3498db, 0x2980b9, 2, 8);
        });

        this.buttonContainer = buttonContainer;
        this.buttonBg = buttonBg;
        this.buttonText = buttonText;

        this.addContent(buttonContainer);
        return buttonContainer;
    }

    // Ensure we clean up (no external listeners registered currently)
    public override destroy(fromScene?: boolean): void {
        super.destroy(fromScene);
    }
}
