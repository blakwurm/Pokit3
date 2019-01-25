import {Types} from '../assetmanager.mjs'
import * as Logging from '../debug.mjs'

let ASCII = []
let ASCII_lookup = {}

async function decodeFont(id, response){
    let blob = await response.blob();
    let url = URL.createObjectURL(blob);
    return await new FontFace(id, url).load();
}

// export async function makeSpriteSheet(font, verticalMargin, horizontalMargin){
//     var c = new OffscreenCanvas(10,10);
//     var ctx = c.getContext('2d');
//     ctx.font = font;
    
//     let height = 0;
//     let width = 0;

//     for(let k of Object.keys(ASCII)){
//         let size = ctx.measureText(k);
//         if(size.width > width) width = size.width;
//         if(size.height > height) height = size.height;
//     }

//     c.width = 10 * (width + horizontalMargin);
//     c.height = 10 * (height + verticalMargin);
//     ctx.font = font;

//     console.log(ctx)
//     console.log(ASCII)
//     for(let k of Object.keys(ASCII)){
//         let size = ctx.measureText(k);
//         let x = c.width % ASCII[k] + (width + horizontalMargin - size.width) /2;
//         let y = (Math.floor(c.width / ASCII[k]) + (height + verticalMargin - size.height) /2)+height;
//         ctx.fillText(k, x, y);
//         console.log(x)
//     }
//     // ctx.fillText("Testing", 0, 10)
//     return await c.convertToBlob();
// }

function measureTextHeight(font){
    let text = ASCII.join('');
    let c = new OffscreenCanvas(10,10);
    c.font = font;
    let s = parseInt(font.match(/\d+/), 10);
    let w = c.measureText(text).width + 40;
    let h = s * 4;
}

export async function makeSpriteSheet(font, verticalMargin, horizontalMargin) {
    let c = new OffscreenCanvas(10, 10)
    let ctx = c.getContext('2d')
    ctx.font = font;
    //ctx.textAlign="center"; 
    ctx.textBaseline = "middle";

    let h = await measureTextHeight(font);
    let height = h + verticalMargin;
    let width = 0;

    let len = ASCII.length
    for (let i = 0; i < len; i++) {
        let size = ctx.measureText(ASCII[i]);
        if (size.width > width) {width = size.width}
    }

    width = width + horizontalMargin
    c.width = 10 * width
    c.height = 10 * height
    ctx.font = font

    for (let i = 0; i < len; i++) {
        let t = ASCII[i]
        let w = ctx.measureText(t).width;
        let x = ((i % 10) * width) + (width / 2)
        let y = (Math.floor(i/10) * height) +( height / 2 );
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.ellipse(x, y, w/2, h / 2, 0, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = "#000000";
        ctx.fillText(t, x - w/2, y - h/2)
    }

    ctx.strokeStyle = "#0000FF";
    for(let i = 0; i < 10; i++){
        ctx.beginPath();
        ctx.moveTo(0, height * i);
        ctx.lineTo(c.width, height * i);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width * i, 0);
        ctx.lineTo(width * i, c.height);
        ctx.closePath();
        ctx.stroke();
    }

    return await c.convertToBlob();
}

function createTileMap(text, tilewidth, tileheight, layerwidth, layerheight){
    let layer = [];
    for(let k of text){
        layer.push(ASCII_lookup[k]+1);
    }
    for(let i = text.length; i < layerwidth*layerheight; i++) {
        layer.push(100);
    }
    return {
        layers: [{name:'text', type:'tilelayer', visible:true, data:layer}],
        tileheight:tileheight,
        tilewidth:tilewidth,
        height:layerheight,
        width:layerwidth,
    }
}

class TextRenderer{
    constructor(engine){
        this.engine=engine;
    }
    async init(entity, info){
        Object.assign(this,
            {
                font: 'monospace',
                fontSize: 20,
                horizontalMargin: 2,
                verticalMargin: 2,
            }, info)
        let s = await makeSpriteSheet(this.fontSize + 'px ' + this.font, this.verticalMargin, this.horizontalMargin);
        let url = URL.createObjectURL(s);
        let sheetId = entity.id + '_' + this.font + '_' + this.fontSize + '_sprites';
        let sheet = await this.engine.assets.queueAsset(sheetId, url, Types.IMAGE);
        let ch = sheet.height / 10;
        let cw = sheet.width / 10;
        let hc = Math.floor(320/cw);
        let vc = Math.floor(320/ch);

        let map = createTileMap('this is a test', cw, ch, hc, vc);
        let json = JSON.stringify(map);
        Logging.Log('json', json);
        let blob = new Blob([json], {type:'application/json'});
        let jsonUrl = URL.createObjectURL(blob);
        let decodedMap = entity.id + '_' + this.font + '_' + this.fontSize + '_map';
        await this.engine.assets.queueAsset(decodedMap, jsonUrl, Types.TILED);

        entity.addCog('img', {id:sheetId});
        entity.addCog('tilemap', {id:decodedMap});
    }
}

export class TextSystem{
    init(engine){
        for(let i = 32; i < 127; i++){
            let char = String.fromCharCode(i)
            ASCII_lookup[char] = i - 32;
            ASCII.push(char)
        }

        engine.assets.registerType('FONT');
        engine.assets.registerDecoder(Types.FONT, decodeFont)
        engine.ecs.setCog('textRenderer', TextRenderer)
    }
}