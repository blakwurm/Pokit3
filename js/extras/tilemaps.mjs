import { Types, AssetManager } from "../assetmanager.mjs";

export function addTileMapSupport(pokitOS) {
    pokitOS.assets.registerType("TILEMAP") 
    // AssetManager.prototype.getTileMap = async function(tilemapName, src) {
    //     let j =  await this.getJson(tilemapName, src)
    // }
}

function parseTileLayer({height, width, visible, name}, tilewidth, tileheight) {

}

export async function parseTileMap({height, width, layers, tilewidth, tileheight}) {

}