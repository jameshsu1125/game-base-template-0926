import deepMerge from "./deep-merge";
import getOverrides from "./overriding-assets/get-overrides";

export const getFinalGameAssets = () =>
    deepMerge(window.base64Map, getOverrides());

