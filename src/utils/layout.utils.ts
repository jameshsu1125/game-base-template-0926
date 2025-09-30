import Phaser from "phaser";
import { IS_DEVELOPMENT } from "../configs/DEBUG_CONFIG";

/**
 * Scales a game object to cover the given dimensions while maintaining aspect ratio
 * @param gameObject The game object to scale, with displayWidth/displayHeight properties
 * @param targetWidth The target width to cover
 * @param targetHeight The target height to cover
 */
export function scaleImageToCover(
    gameObject: Phaser.GameObjects.Image,
    targetWidth: number,
    targetHeight: number
): void {
    if (gameObject.displayWidth <= 0 || gameObject.displayHeight <= 0) {
        if (IS_DEVELOPMENT) {
            console.warn(
                "scaleToCover: Invalid gameObject dimensions. Cannot calculate aspect ratio."
            );
        }
        return;
    }

    const objRatio = gameObject.displayWidth / gameObject.displayHeight;
    const targetRatio = targetWidth / targetHeight;

    let newWidth: number;
    let newHeight: number;

    if (objRatio > targetRatio) {
        // Object is wider than target, fit to height
        newHeight = targetHeight;
        newWidth = newHeight * objRatio;
    } else {
        // Object is taller than target, fit to width
        newWidth = targetWidth;
        newHeight = newWidth / objRatio;
    }

    gameObject.setDisplaySize(newWidth, newHeight);
}

/**
 * Calculates display dimensions for a game object based on a percentage of the screen width, maintaining aspect ratio.
 * @param gameObject The Phaser Game Object to scale. Must have width, height, and setDisplaySize properties.
 * @param widthPercentage The desired width as a percentage of the screen width (0 to 1).
 * @returns An object with the calculated width and height.
 */
export function getDisplaySizeByWidthPercentage(
    gameObject:
        | Phaser.GameObjects.Image
        | Phaser.GameObjects.Sprite
        | Phaser.GameObjects.Text,
    widthPercentage: number
): { width: number; height: number } {
    const aspectRatio = gameObject.width / gameObject.height;
    const targetWidth = gameObject.scene.scale.width * widthPercentage;
    return { width: targetWidth, height: targetWidth / aspectRatio };
}

