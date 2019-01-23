import {Types} from './assetmanager.mjs';
import { SpatialHash } from './spatialhash.mjs';

export async function doIntroAnim(pokitOS) {
    let animrate = 4;
    let mag = 1;
    let iText = await pokitOS.assets.queueAsset('load_text', '/img/bootscreen_text.svg', Types.IMAGE);
    let iTop = await pokitOS.assets.queueAsset('load_top', '/img/bootscreen_top.svg', Types.IMAGE);
    let iBot = await pokitOS.assets.queueAsset('load_bottom', '/img/bootscreen_bottom.svg', Types.IMAGE);
    // let cam = pokitOS.ecs.makeEntity({x:0,y:0,height:320,width:320,z:0})
    //            .addCog('camera', {isMainCamera:true});
    let text = pokitOS.ecs.makeEntity({name:'text',x:0,y:160*2,height:320,width:320,z:10})
               .addCog('img', {id:'load_text'})
               .addCog('spriteActor')
    let topbar = pokitOS.ecs.makeEntity({x:160*-2,y:0,width:320,height:320,z:1})
               .addCog('img', {id:'load_top'})
               .addCog('spriteActor')
    let bottombar = pokitOS.ecs.makeEntity({x:160*2,y:0,width:320,height:320,z:1})
               .addCog('img', {id:'load_bottom'})
               .addCog('spriteActor')
    let text_done = false;
    let top_done = false;
    let bottom_done = false;
    let dummycam = {x: 160, y: 160, z: 1, width: 320, height: 320, depth: 1000}
    return new Promise((resolve) =>
    text.addUniqueCog('doanim', {update: () => {
        ////console.log('stillbeingcalled');
        let sh = new SpatialHash(160);
        sh.addMany([text, topbar, bottombar])
        // sh.add(text)
        // sh.add(topbar)
        // sh.add(bottombar)
        // //console.log(sh.findNearby(dummycam))
        if (text.y > 0) {text.y -= animrate}
        else if (topbar.x < 0) {topbar.x += animrate*4}
        else if (bottombar.x > 0) {bottombar.x -= animrate*4}
        else if (text.width * text.scaleX < 320*32) { [text, topbar, bottombar].forEach(x=>{
            x.scaleX+=mag*0.1
            x.scaleY+=mag*0.1
            // x.rotation += mag * .5 
            mag+=0.03
        }) } else {
            text.destroy()
            topbar.destroy()
            bottombar.destroy()
            pokitOS.ecs.removeCog('doanim')
            ////console.log(pokitOS)
            resolve()
        }
    }})
    )
}