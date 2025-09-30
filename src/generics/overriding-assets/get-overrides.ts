//TODO: generic-file
//section: overriding-assets

// Utility to get runtime overrides for a game from localStorage or window property
// Usage: getOverrides(localStorageKey: string, windowProperty: string)
// Returns: object (may be empty)

import { LS_KEY_BUILDER } from "./handle-receive-asset-chunk";

export default function getOverrides(): {
    assets: Record<string, string>;
    text: Record<string, string>;
} {
    let overrides: {
        assets: Record<string, string>;
        text: Record<string, string>;
    } = { assets: {}, text: {} };
    try {
        for (const key of Object.keys(window.assetsToBeOverrided)) {
            if (window.assetsToBeOverrided[LS_KEY_BUILDER(key)]) {
                overrides.assets[key] =
                    window.assetsToBeOverrided[LS_KEY_BUILDER(key)];
            }
        }
    } catch (e) {
        // Ignore JSON parse errors
    }
    return overrides;
}

