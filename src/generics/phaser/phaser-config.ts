// Phaser game configuration for 2D Game Template
import Phaser from "phaser";
import { IS_DEVELOPMENT } from "../../configs/DEBUG_CONFIG";
import BootScene from "../../scenes/boot.scene";
import MainScene from "../../scenes/main.scene";
import PreloadScene from "../../scenes/preload.scene";

export const PHASER_CONFIG = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1600,
        height: 2400,
        parent: "app",
    },

    physics: {
        default: "arcade",
        arcade: {
            debug: IS_DEVELOPMENT,
        },
    },
    scene: [BootScene, PreloadScene, MainScene],
};

