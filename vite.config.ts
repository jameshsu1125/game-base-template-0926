import { promises as fs } from "fs";
import { resolve } from "path";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";

// Plugin to copy fonts to _ASSETS_ folder
const copyFonts = (): PluginOption => {
    return {
        name: "copy-fonts",
        apply: "build",
        async writeBundle(options) {
            const outDir = options.dir;
            if (!outDir) {
                this.warn(
                    "vite-plugin-copy-fonts: `dir` option is not defined in the Rollup output options."
                );
                return;
            }
            const fontsSourceDir = resolve(__dirname, "public/assets/fonts");
            const destDir = resolve(outDir, "_ASSETS_/fonts");

            try {
                await fs.mkdir(destDir, { recursive: true });
                const files = await fs.readdir(fontsSourceDir);
                for (const file of files) {
                    if (file.match(/\.(ttf|otf|woff|woff2|eot)$/i)) {
                        const sourceFile = resolve(fontsSourceDir, file);
                        const destFile = resolve(destDir, file);
                        await fs.copyFile(sourceFile, destFile);
                        console.log(`Copied font: ${file}`);
                    }
                }
            } catch (err) {
                this.error(`Error copying fonts: ${err}`);
            }
        },
    };
};

// Plugin to copy ASSET_CONFIG.ts
const copyAssetConfig = (): PluginOption => {
    return {
        name: "copy-asset-config",
        apply: "build",
        async writeBundle(options) {
            const outDir = options.dir;
            if (!outDir) {
                this.warn(
                    "vite-plugin-copy-asset-config: `dir` option is not defined in the Rollup output options."
                );
                return;
            }
            const source = resolve(__dirname, "src/configs/ASSET_CONFIG.js");
            const destDir = resolve(outDir, "_ASSETS_");
            const destFile = resolve(destDir, "ASSET_CONFIG.js");

            try {
                await fs.mkdir(destDir, { recursive: true });
                await fs.copyFile(source, destFile);
            } catch (err) {
                this.error(`Error copying ASSET_CONFIG.js: ${err}`);
            }
        },
    };
};

const copyIconAppierLogoStylesToAssetsFolder = (): PluginOption => {
    return {
        name: "copy-icon-appier-logo-styles-to-assets-folder",
        apply: "build",
        async writeBundle(options) {
            const outDir = options.dir;
            if (!outDir) {
                this.warn(
                    "vite-plugin-copy-icon-appier-logo-styles-to-assets-folder: `dir` option is not defined in the Rollup output options."
                );
                return;
            }
            const iconSource = resolve(__dirname, "public/assets/icon.png");
            const iconDestDir = resolve(outDir, "_ASSETS_");
            const iconDestFile = resolve(iconDestDir, "icon.png");

            const appierLogoSource = resolve(
                __dirname,
                "public/assets/appier-logo.svg"
            );
            const appierLogoDestDir = resolve(outDir, "_ASSETS_");
            const appierLogoDestFile = resolve(
                appierLogoDestDir,
                "appier-logo.svg"
            );

            const stylesSource = resolve(__dirname, "loading-styles.css");
            const stylesDestDir = resolve(outDir, "_ASSETS_");
            const stylesDestFile = resolve(stylesDestDir, "loading-styles.css");

            try {
                await fs.copyFile(iconSource, iconDestFile);
                await fs.copyFile(appierLogoSource, appierLogoDestFile);
                await fs.copyFile(stylesSource, stylesDestFile);
            } catch (err) {
                this.error(
                    `Error copying icon.png and appier-logo.svg and loading-styles.css: ${err}`
                );
            }
        },
    };
};

// Plugin to inject ASSET_CONFIG in dev mode
const injectAssetConfigDev = (): PluginOption => {
    return {
        name: "inject-asset-config-dev",
        apply: "serve", // Only apply during dev
        transformIndexHtml(html) {
            return html.replace(
                "</body>",
                `    <script src="/src/configs/ASSET_CONFIG.js"></script>
    </body>`
            );
        },
    };
};

const replaceIconAppierLogoStylesPathDev = (): PluginOption => {
    return {
        name: "replace-icon-appier-logo-styles-path-dev",
        apply: "serve", // Only apply during dev
        transformIndexHtml(html) {
            const iconTemp = html.replaceAll(
                "_ASSETS_/icon.png",
                "public/assets/icon.png"
            );

            const stylesTemp = iconTemp.replaceAll(
                "_ASSETS_/loading-styles.css",
                "loading-styles.css"
            );

            return stylesTemp.replaceAll(
                "_ASSETS_/appier-logo.svg",
                "public/assets/appier-logo.svg"
            );
        },
    };
};

// Plugin to move scripts to body
const moveAssetConfigToBody = (): PluginOption => {
    return {
        name: "move-script-to-body",
        apply: "build", // Only apply during build
        transformIndexHtml(html) {
            // Remove scripts from head and add them to body
            return html
                .replace(/<script\b[^>]*type="module"[^>]*>.*?<\/script>/g, "")
                .replace(
                    "</body>",
                    `    <script src="_ASSETS_/ASSET_CONFIG.js"></script>
                    <script src="_ASSETS_/index.js"></script>  
    </body>`
                );
        },
    };
};

export default defineConfig({
    root: "./",
    base: "",
    publicDir: false,
    server: {
        open: true,
    },
    define: {
        __DEV__: true,
    },
    build: {
        outDir: "dist",
        rollupOptions: {
            external: ["./src/configs/ASSET_CONFIG.js"],
            output: {
                format: "iife",
                name: "index",
                entryFileNames: "_ASSETS_/index.js",
                chunkFileNames: "[name].js",
                assetFileNames: "assets/[name].[ext]",
            },
        },
    },
    plugins: [
        injectAssetConfigDev(),
        moveAssetConfigToBody(),
        copyAssetConfig(),
        copyIconAppierLogoStylesToAssetsFolder(),
        copyFonts(),
        replaceIconAppierLogoStylesPathDev(),
    ],
});

