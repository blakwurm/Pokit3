import {Types} from '../assetmanager.mjs'

let ASCII = {}

async function decodeFont(id, response){
    let blob = await response.blob();
    let url = URL.createObjectURL(blob);
    return await new FontFace(id, url).load();
}

export async function makeSpriteSheet(font, verticalMargin, horizontalMargin){
    var c = new OffscreenCanvas(10,10);
    var ctx = c.getContext('2d');
    ctx.font = font;
    
    let height = 0;
    let width = 0;

    for(let k of Object.keys(ASCII)){
        let size = ctx.measureText(k);
        if(size.width > width) width = size.width;
        if(size.height > height) height = size.height;
    }

    c.width = 10 * (width + horizontalMargin);
    c.height = 10 * (height + verticalMargin);
    ctx.font = font;

    console.log(ctx)
    console.log(ASCII)
    for(let k in Object.keys(ASCII)){
        let size = ctx.measureText(k);
        let x = c.width % ASCII[k] + (width + horizontalMargin - size.width) /2;
        let y = (Math.floor(c.width / ASCII[k]) + (height + verticalMargin - size.height) /2)+height;
        ctx.fillText(k, x, y);
    }
    // ctx.fillText("Testing", 0, 10)
    return await c.convertToBlob();
}

export function init(engine){
    for(let i = 32; i < 127; i++){
        ASCII[String.fromCharCode(i)] = i - 32;
    }

    engine.assets.registerType('FONT');
    engine.assets.registerDecoder(Types.FONT, decodeFont)
}