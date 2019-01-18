import {Types} from './assetmanager.mjs';

export async function doIntroAnim(pokitOS) {
    let animrate = 4;
    let mag = 1;
    let iText = await pokitOS.assets.queueAsset('load_text', '/img/bootscreen_text.svg', Types.IMAGE);
    let iTop = await pokitOS.assets.queueAsset('load_top', '/img/bootscreen_top.svg', Types.IMAGE);
    let iBot = await pokitOS.assets.queueAsset('load_bottom', '/img/bootscreen_bottom.svg', Types.IMAGE);
    // let cam = pokitOS.ecs.makeEntity({x:0,y:0,height:320,width:320,z:0})
    //            .addSystem('camera', {isMainCamera:true});
    let text = pokitOS.ecs.makeEntity({x:160,y:160*3,height:320,width:320,z:10})
               .addSystem('img', {id:'load_text'})
               .addSystem('spriteActor')
    let topbar = pokitOS.ecs.makeEntity({x:160*-3,y:160,width:320,height:320,z:1})
               .addSystem('img', {id:'load_top'})
               .addSystem('spriteActor')
    let bottombar = pokitOS.ecs.makeEntity({x:160*3,y:160,width:320,height:320,z:1})
               .addSystem('img', {id:'load_bottom'})
               .addSystem('spriteActor')
    let text_done = false;
    let top_done = false;
    let bottom_done = false;
    text.addUniqueSystem('doanim', {update: () => {
        //console.log('stillbeingcalled');
        if (text.y > 161) {text.y -= animrate}
        else if (topbar.x < 155) {topbar.x += animrate*4}
        else if (bottombar.x > 155) {bottombar.x -= animrate*4}
        else if (text.width * text.scaleX < 320*32) { [text, topbar, bottombar].forEach(x=>{
            x.scaleX+=mag*0.1
            x.scaleY+=mag*0.1
            // x.rotation += mag * .5 
            mag+=0.03
        }) } else {
            text.destroy()
            topbar.destroy()
            bottombar.destroy()
            pokitOS.ecs.removeSystem('doanim')
            //console.log(pokitOS)
        }

    }})
}