import {Types} from '../assetmanager.mjs'

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
export async function makeSpriteSheet(font, verticalMargin, horizontalMargin) {
    let c = new OffscreenCanvas(10, 10)
    let ctx = c.getContext('2d')
    ctx.font = font;

    let height = parseInt(ctx.font.match(/\d+/), 10) + verticalMargin;
    let width = 0;

    let len = ASCII.length
    for (let i = 0; i < len; i++) {
        let size = ctx.measureText(ASCII[i])
        if (size.width > width) {width = size.width}
    }

    c.width = 10 * (width + horizontalMargin)
    c.height = 10 * (height + verticalMargin)
    ctx.font = font

    for (let i = 0; i < len; i++) {
        let t = ASCII[i]
        let size = ctx.measureText(t)
        let x = (i % 10) * width + (width + horizontalMargin - size.width) / 2
        let y = (Math.floor(i/10) * height) + height + verticalMargin / 2;
        console.log(y);
        ctx.fillText(t, x, y)
    }

    return await c.convertToBlob();
}

export function init(engine){
    for(let i = 32; i < 127; i++){
        let char = String.fromCharCode(i)
        ASCII_lookup[char] = i - 32;
        ASCII.push(char)
    }

    engine.assets.registerType('FONT');
    engine.assets.registerDecoder(Types.FONT, decodeFont)
}