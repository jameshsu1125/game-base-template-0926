//TODO: generic-file
// Generic deep merge utility for objects (non-array)
// Usage: deepMerge(target, source) mutates and returns target
export default function deepMerge<T extends Record<string, any>>(
    target: T,
    source: Partial<T>
): T {
    for (const key in source) {
        const sourceValue = source[key];
        if (
            sourceValue &&
            typeof sourceValue === "object" &&
            !Array.isArray(sourceValue)
        ) {
            if (!target[key]) {
                target[key] = {} as T[typeof key];
            }
            deepMerge(target[key], sourceValue);
        } else {
            target[key] = sourceValue as T[typeof key];
        }
    }
    return target;
}

