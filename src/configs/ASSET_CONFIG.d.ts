// src/configs/ASSET_CONFIG.d.ts

declare global {
    interface Window {
        // from vite
        __DEV__: boolean;
        base64Map: {
            assets: {
                [key: string]: string;
            };
        };
        assetsToBeOverrided: {
            [key: string]: string;
        };
    }
}

export {};

