// src/types/global.d.ts

declare global {
    interface Window {
        openUrl: () => void;
        openStoreUrl: () => void;
    }
}

// An empty export statement makes this file a module
export {};

