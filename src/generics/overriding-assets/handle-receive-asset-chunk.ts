//TODO: generic-file
//section: overriding-assets

const RECEIVE_ACTIONS = {
    CHANGE_GAME_ASSETS: "CHANGE_GAME_ASSETS",
} as const;

export const LS_KEY_BUILDER = (gameAssetMetaName: string) =>
    `${gameAssetMetaName}`;

function isGameAssetChangeMessage(event: MessageEvent): boolean {
    return (
        event.data.type === "GAME_ACTION" &&
        event.data.action === RECEIVE_ACTIONS.CHANGE_GAME_ASSETS
    );
}

function assignAssetChunk(event: MessageEvent): void {
    if (!event.data.assetBase64Chunk) return;

    const assetKey = LS_KEY_BUILDER(event.data.assetMetaName);

    if (event.data.chunkIdx === 0) {
        window.assetsToBeOverrided[assetKey] = event.data.assetBase64Chunk;
    } else {
        window.assetsToBeOverrided[assetKey] += event.data.assetBase64Chunk;
    }
}

export const handleReceiveAssetChunk = (
    event: MessageEvent,
    onAssetChange: () => void
) => {
    if (!isGameAssetChangeMessage(event)) return;
    assignAssetChunk(event);
    onAssetChange();
};

