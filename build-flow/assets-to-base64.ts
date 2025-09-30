import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Converts a PNG file to a base64-encoded string.
 * @param filePath - The path to the PNG file.
 * @returns The base64 string representation of the PNG.
 */
export function pngToBase64(filePath: string): string {
    const imageBuffer = fs.readFileSync(filePath);
    return imageBuffer.toString("base64");
}

function writeAssetConfigJS(
    assets: Record<string, string | object>,
    outputPath: string
) {
    const jsContent = `window.base64Map = ${JSON.stringify(
        { assets },
        null,
        2
    )};\n`;
    fs.writeFileSync(outputPath, jsContent, "utf-8");
    console.log(`Asset config JS written to ${outputPath}`);
}

function moveAssetConfigToConfigs(srcPath: string) {
    const configsDir = path.join(__dirname, "../src/configs");
    const destPath = path.join(configsDir, "ASSET_CONFIG.js");
    if (!fs.existsSync(configsDir)) {
        fs.mkdirSync(configsDir, { recursive: true });
    }
    fs.renameSync(srcPath, destPath);
    console.log(`ASSET_CONFIG.js moved to ${destPath}`);
}

/**
 * Processes a file and adds it to assets with appropriate naming
 */
function processFile(
    filePath: string,
    fileName: string,
    folderPrefix: string,
    assets: Record<string, string | object>
) {
    const ext = path.extname(fileName).toLowerCase();
    const baseName = path.basename(fileName, ext);

    // Handle atlas files with special naming
    let assetName = baseName;
    if (folderPrefix && fileName === "atlas.json") {
        assetName = `${folderPrefix}-atlas-json`;
    } else if (folderPrefix && fileName === "atlas.png") {
        assetName = `${folderPrefix}-atlas`;
    } else if (folderPrefix) {
        assetName = `${folderPrefix}-${baseName}`;
    }

    if (ext === ".json") {
        const jsonContent = fs.readFileSync(filePath, "utf-8");
        const jsonData = JSON.parse(jsonContent);
        if (!folderPrefix || fileName !== "atlas.json") {
            assets[assetName + "-json"] = jsonData;
        } else {
            assets[assetName] = jsonData;
        }
    } else {
        let prefix = "";
        if (ext === ".png") {
            prefix = "data:image/png;base64,";
        } else if (ext === ".svg") {
            prefix = "data:image/svg+xml;base64,";
        } else if (ext === ".jpg" || ext === ".jpeg") {
            prefix = "data:image/jpeg;base64,";
        } else if (ext === ".gif") {
            prefix = "data:image/gif;base64,";
        } else if (ext === ".webp") {
            prefix = "data:image/webp;base64,";
        } else if (ext === ".wav") {
            prefix = "data:audio/wav;base64,";
        } else if (ext === ".mp3") {
            prefix = "data:audio/mp3;base64,";
        } else if (ext === ".ogg") {
            prefix = "data:audio/ogg;base64,";
        } else {
            return;
        }
        const base64 = pngToBase64(filePath);
        assets[assetName] = prefix + base64;
    }
}

/**
 * Recursively processes a directory
 */
function processDirectory(
    dirPath: string,
    folderPrefix: string,
    assets: Record<string, string | object>
) {
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isFile()) {
            processFile(itemPath, item, folderPrefix, assets);
        } else if (stat.isDirectory()) {
            // Recursively process subdirectories
            processDirectory(itemPath, folderPrefix, assets);
        }
    });
}

/**
 * Converts all files in the given directory to base64 and writes to ASSET_CONFIG.js.
 */
function convertAssetsToBase64() {
    const assetsDir = path.join(__dirname, "../public/assets");
    const jsOutputPath = path.join(__dirname, "../ASSET_CONFIG.js");
    const items = fs.readdirSync(assetsDir);
    const assets: Record<string, string | object> = {};

    items.forEach((item) => {
        const itemPath = path.join(assetsDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isFile()) {
            processFile(itemPath, item, "", assets);
        } else if (stat.isDirectory()) {
            // Use the directory name as prefix for atlas files
            processDirectory(itemPath, item, assets);
        }
    });

    writeAssetConfigJS(assets, jsOutputPath);
    moveAssetConfigToConfigs(jsOutputPath);
}

const isMain =
    process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
    convertAssetsToBase64();
}

