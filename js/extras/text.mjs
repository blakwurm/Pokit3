import {Types} from './assetmanager.mjs'

let ASCII = {}

function decodeFont(id, response){
    let blob = await response.blob();
    let url = URL.createObjectURL(blob);
    return await new FontFace(id, url).load();
}

function makeSpriteSheet(font, verticalMargin, horizontalMargin){
    var c = new OffscreenCanvas(10,10);
    var ctx = c.getContext('2d');

}

export default function init(engine){
    for(let i = 32; i < 127; i++){
        
    }

    engine.assets.registerType('FONT');
    engine.assets.registerDecoder(Types.FONT, decodeFont)
}