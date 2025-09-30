import Phaser from "phaser";
import { emitAppEvent, AppEvents } from "../services/event-bus/app-events.constants";
import { SPRITE_SCALES } from "../configs/app-constants";

export interface CharacterAvatarConfig {
    characterId: string;
    characterName: string;
    size: number;
    primaryColor?: number;
    secondaryColor?: number;
    animated?: boolean;
    // If true, replaces the body with the neutral character atlas animation
    useNeutralAtlasBody?: boolean;
}

/**
 * Generic Character Avatar Component
 *
 * A reusable character representation that can be used for:
 * - Player avatars
 * - Enemy characters
 * - NPCs
 * - Team members
 * - Any game character representation
 */
export class CharacterAvatar extends Phaser.GameObjects.Container {
    private config: Required<
        Omit<CharacterAvatarConfig, "useNeutralAtlasBody"> & {
            useNeutralAtlasBody: boolean;
        }
    >;
    private avatar?: Phaser.GameObjects.Graphics;
    private neutralSprite?: Phaser.GameObjects.Sprite;
    private avatarBase!: Phaser.GameObjects.GameObject; // target for effects
    private nameText!: Phaser.GameObjects.Text;
    private healthBar?: Phaser.GameObjects.Graphics;
    private idleAnimation?: Phaser.Tweens.Tween;

    constructor(scene: Phaser.Scene, x: number, y: number, config: CharacterAvatarConfig) {
        super(scene, x, y);

        // Set default config values
        this.config = {
            characterId: config.characterId,
            characterName: config.characterName,
            size: config.size,
            primaryColor: config.primaryColor ?? 0x3498db,
            secondaryColor: config.secondaryColor ?? 0x2c3e50,
            animated: config.animated ?? true,
            useNeutralAtlasBody: config.useNeutralAtlasBody ?? false,
        };

        this.createAvatar();
        this.createNameLabel();
        this.createHealthBar();

        if (this.config.animated) {
            this.startIdleAnimation();
        }

        // Set up interactive area and event handlers
        this.setupEventHandlers();

        console.log(`[CharacterAvatar] Created character: ${this.config.characterName} (${this.config.characterId})`);
    }

    private createAvatar(): void {
        // If requested, replace body with atlas-based animated sprite
        if (
            this.config.useNeutralAtlasBody &&
            this.scene.textures.exists("neutral-character-sheet")
        ) {
            // Ensure animation exists
            if (!this.scene.anims.exists("neutral-anim")) {
                this.scene.anims.create({
                    key: "neutral-anim",
                    frames: this.scene.anims.generateFrameNames(
                        "neutral-character-sheet",
                        { prefix: "", start: 0, end: 9, zeroPad: 3 }
                    ),
                    frameRate: 8,
                    repeat: -1,
                });
            }

            this.neutralSprite = this.scene.add.sprite(
                0,
                0,
                "neutral-character-sheet",
                "000"
            );
            // Scale to a portion of screen width (keep aspect ratio)
            const targetWidth =
                this.scene.scale.width * SPRITE_SCALES.NEUTRAL_ATLAS;
            const scale = targetWidth / this.neutralSprite.width;
            this.neutralSprite.setScale(scale);
            this.neutralSprite.play("neutral-anim");
            this.add(this.neutralSprite);
            this.avatarBase = this.neutralSprite;
            return;
        }

        // Default: vector graphics avatar
        this.avatar = this.scene.add.graphics();

        const size = this.config.size;
        const radius = size / 2;

        // Character head (circle)
        this.avatar.fillStyle(this.config.primaryColor);
        this.avatar.fillCircle(0, -radius * 0.3, radius * 0.4);

        // Character body (rounded rectangle)
        this.avatar.fillStyle(this.config.secondaryColor);
        this.avatar.fillRoundedRect(
            -radius * 0.5,
            -radius * 0.1,
            radius,
            radius * 0.8,
            radius * 0.1
        );

        // Character arms (small circles)
        this.avatar.fillStyle(this.config.primaryColor);
        this.avatar.fillCircle(-radius * 0.6, radius * 0.1, radius * 0.15);
        this.avatar.fillCircle(radius * 0.6, radius * 0.1, radius * 0.15);

        // Character feet (small ellipses)
        this.avatar.fillEllipse(-radius * 0.25, radius * 0.7, radius * 0.2, radius * 0.1);
        this.avatar.fillEllipse(radius * 0.25, radius * 0.7, radius * 0.2, radius * 0.1);

        // Add subtle border
        this.avatar.lineStyle(3, 0xffffff, 0.8);
        this.avatar.strokeCircle(0, -radius * 0.3, radius * 0.4);

        this.add(this.avatar);
        this.avatarBase = this.avatar;
    }

    private createNameLabel(): void {
        // Calculate responsive font size (1.4% of screen height)
        const fontSize = Math.round(this.scene.scale.height * 0.014);
        
        this.nameText = this.scene.add.text(0, this.config.size * 0.6, this.config.characterName, {
            fontSize: `${fontSize}px`,
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.nameText.setOrigin(0.5);
        this.add(this.nameText);
    }

    private createHealthBar(): void {
        this.healthBar = this.scene.add.graphics();

        const barWidth = this.config.size * 0.8;
        const barHeight = 6;
        const y = this.config.size * 0.45;

        // Background
        this.healthBar.fillStyle(0x000000, 0.5);
        this.healthBar.fillRect(-barWidth / 2, y, barWidth, barHeight);

        // Health (full by default)
        this.healthBar.fillStyle(0x27ae60);
        this.healthBar.fillRect(-barWidth / 2, y, barWidth, barHeight);

        this.add(this.healthBar);
    }

    private setupEventHandlers(): void {
        // Create an interactive area that covers the entire character
        const interactiveArea = this.scene.add.rectangle(
            0, 0,
            this.config.size,
            this.config.size,
            0x000000,
            0 // transparent
        );
        interactiveArea.setInteractive();
        this.add(interactiveArea);

        // Move interactive area to back so it doesn't cover visual elements
        this.sendToBack(interactiveArea);

        interactiveArea.on('pointerdown', () => {
            console.log(`[CharacterAvatar] Character clicked: ${this.config.characterName}`);

            // Scale down slightly on click
            this.scene.tweens.add({
                targets: this,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Back.out'
            });

            // Emit character interaction event
            emitAppEvent(AppEvents.UI_ELEMENT_CLICKED, {
                elementId: this.config.characterId,
                elementType: 'character-avatar',
                characterName: this.config.characterName,
                position: { x: this.x, y: this.y }
            });
        });

        interactiveArea.on('pointerover', () => {
            // Subtle hover effect
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.out'
            });
        });

        interactiveArea.on('pointerout', () => {
            // Return to normal scale
            this.scene.tweens.add({
                targets: this,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.out'
            });
        });
    }

    private startIdleAnimation(): void {
        // Gentle floating animation
        this.idleAnimation = this.scene.tweens.add({
            targets: this,
            y: this.y - 5,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Update character health (0-1 range)
     */
    public updateHealth(healthPercentage: number): void {
        if (this.healthBar) {
            this.healthBar.clear();

            const barWidth = this.config.size * 0.8;
            const barHeight = 6;
            const y = this.config.size * 0.45;

            // Background
            this.healthBar.fillStyle(0x000000, 0.5);
            this.healthBar.fillRect(-barWidth / 2, y, barWidth, barHeight);

            // Health bar color based on health
            let healthColor = 0x27ae60; // Green
            if (healthPercentage < 0.5) healthColor = 0xf39c12; // Orange
            if (healthPercentage < 0.25) healthColor = 0xe74c3c; // Red

            this.healthBar.fillStyle(healthColor);
            this.healthBar.fillRect(-barWidth / 2, y, barWidth * Math.max(0, healthPercentage), barHeight);
        }

        console.log(`[CharacterAvatar] ${this.config.characterName} health: ${Math.round(healthPercentage * 100)}%`);
    }

    /**
     * Update character name
     */
    public updateName(newName: string): void {
        this.config.characterName = newName;
        this.nameText.setText(newName);
        console.log(`[CharacterAvatar] Character renamed to: ${newName}`);
    }

    /**
     * Play damage animation
     */
    public playDamageAnimation(): void {
        // Red flash effect
        this.scene.tweens.add({
            targets: this.avatarBase,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 2,
            ease: 'Power2'
        });

        // Shake effect
        this.scene.tweens.add({
            targets: this,
            x: this.x + 5,
            duration: 50,
            yoyo: true,
            repeat: 3,
            ease: 'Power2',
            onComplete: () => {
                this.setPosition(this.x, this.y); // Reset position
            }
        });
    }

    /**
     * Play heal animation
     */
    public playHealAnimation(): void {
        // Green glow effect
        const glow = this.scene.add.graphics();
        glow.fillStyle(0x27ae60, 0.3);
        glow.fillCircle(0, 0, this.config.size * 0.6);
        this.add(glow);

        this.scene.tweens.add({
            targets: glow,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                glow.destroy();
            }
        });
    }

    /**
     * Clean up animations and resources
     */
    public destroy(): void {
        if (this.idleAnimation) {
            this.idleAnimation.destroy();
        }
        super.destroy();
        console.log(`[CharacterAvatar] Destroyed character: ${this.config.characterName}`);
    }
}
