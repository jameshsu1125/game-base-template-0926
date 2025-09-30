import Phaser from "phaser";
import TemplateLayoutManager from "../managers/layout/template-layout.manager";
import UIManager from "../managers/ui.manager";
// New architecture systems
import AppStateSystem from "../systems/app-state.system";
import UISystem from "../systems/ui.system";
import ServiceLocator from "./service-locator/service-locator.service";

export default class ServiceRegistry {
    constructor(scene: Phaser.Scene) {
        this.createServices(scene);
    }

    private createServices(scene: Phaser.Scene): void {
        // Template layout system
        ServiceLocator.register("templateLayoutManager", new TemplateLayoutManager(scene));

        // New architecture systems (template demo)
        ServiceLocator.register("appStateSystem", new AppStateSystem());
        ServiceLocator.register("uiSystem", new UISystem());
        ServiceLocator.register("uiManager", new UIManager(scene));
    }

    public destroy(): void {
        // Destroy template systems
        ServiceLocator.get<TemplateLayoutManager>("templateLayoutManager").destroy();

        // Destroy architecture systems
        ServiceLocator.get<AppStateSystem>("appStateSystem").destroy();
        ServiceLocator.get<UISystem>("uiSystem").destroy();
        ServiceLocator.get<UIManager>("uiManager").destroy();

        ServiceLocator.cleanup();
    }
}

