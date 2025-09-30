import Phaser from "phaser";

function getAspectRatio(
    image: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite
): number {
    if (!image.texture || !image.frame) {
        return 1;
    }
    return image.frame.width / image.frame.height;
}

/**
 * Calculates the dimensions to fit an image within a square while preserving aspect ratio.
 * @param image The image game object.
 * @param squareSize The size of the square to fit the image into.
 * @returns An object with the new width and height.
 */
export function calculateFitDimensions(
    image: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite,
    squareSize: number
): { width: number; height: number } {
    const imageRatio = getAspectRatio(image);

    let width = squareSize;
    let height = squareSize;

    if (imageRatio > 1) {
        // Image is wider than tall
        height = width / imageRatio;
    } else {
        // Image is taller than wide
        width = height * imageRatio;
    }

    return { width, height };
}

/**
 * Fits an image into a square container, preserving aspect ratio, and positions it.
 * @param image The image game object to resize and position.
 * @param squareSize The size of the square container.
 * @param verticalAlign How to align the image vertically within the square. Defaults to 'top'.
 */
export function fitAndPositionImage(
    image: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite,
    squareSize: number,
    verticalAlign: "top" | "middle" | "bottom" = "top"
): void {
    const { width, height } = calculateFitDimensions(image, squareSize);
    image.setDisplaySize(width, height);
    image.setOrigin(0.5);

    let yOffset = 0;
    if (verticalAlign === "top") {
        yOffset = -squareSize / 2 + height / 2;
    } else if (verticalAlign === "bottom") {
        yOffset = squareSize / 2 - height / 2;
    }
    // 'middle' has yOffset = 0 which is the default

    image.setY(yOffset);
}

