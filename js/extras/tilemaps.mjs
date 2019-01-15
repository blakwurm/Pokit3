import { AssetManager } from "../assetmanager.mjs";

export function addTileMapSupport() {
    AssetManager.prototype.getTileMap = async function(tilemapName, src) {
        let j =  await this.getJson(tilemapName, src)
    }
}

function parseTileLayer({height, width, visible, name}, tilewidth, tileheight) {

}

export async function parseTileMap({height, width, layers, tilewidth, tileheight}) {

}