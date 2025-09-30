//TODO: generic-file - we can't move this file however we can create a function and pass changeable parts to it (PHASER_CONFIG)
import Phaser from "phaser";
import { handleReceiveAssetChunk } from "./generics/overriding-assets/handle-receive-asset-chunk";
import { PHASER_CONFIG } from "./generics/phaser/phaser-config";

window.assetsToBeOverrided = {};
let game = new Phaser.Game(PHASER_CONFIG);
let restartTimeout: NodeJS.Timeout;
const RESTART_TIME_THRESHOLD = 2000;

listenMessagesForChangingAssets();

function scheduleGameRestart() {
    if (restartTimeout) {
        clearTimeout(restartTimeout);
    }

    restartTimeout = setTimeout(() => {
        game.destroy(true);
        game = new Phaser.Game(PHASER_CONFIG);
    }, RESTART_TIME_THRESHOLD);
}

function listenMessagesForChangingAssets() {
    window.addEventListener("message", (event) => {
        if (!game) return;

        handleReceiveAssetChunk(event, scheduleGameRestart);
    });
}

