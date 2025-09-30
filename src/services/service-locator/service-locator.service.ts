/**
 * A simple Service Locator for providing global access to registered services (managers).
 * This helps decouple systems by removing the need to pass manager instances around manually.
 */

// GENERIC-FILE
export default class ServiceLocator {
    private static services: Map<string, unknown> = new Map();

    /**
     * Registers a service instance with a specific name.
     * @param name - The key to register the service under.
     * @param service - The service instance.
     */
    public static register<T>(name: string, service: T): void {
        console.log(`[ServiceLocator] Registered: ${name}`);
        this.services.set(name, service);
    }

    /**
     * Retrieves a registered service by its name.
     * @param name - The key of the service to retrieve.
     * @returns The service instance.
     */
    public static get<T>(name: string): T {
        const service = this.services.get(name) as T;
        if (!service) {
            throw new Error(`[ServiceLocator] Service not found: ${name}`);
        }
        return service;
    }

    /**
     * Clears all registered services. Useful for scene restarts or cleanup.
     */
    public static cleanup(): void {
        console.log("[ServiceLocator] Cleaning up all registered services.");
        this.services.clear();
    }
}

