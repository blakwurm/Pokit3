// import {InputManager} from './smolinput.mjs'
// import {ECS} from './ecs.mjs';
// import {Renderer} from './smolrender.mjs';
// import {PokitOS} from './pokitos.mjs';
// import {Types,AssetManager} from './assetmanager.mjs';
// import {SpatialHash} from './spatialhash.mjs'
// import { doIntroAnim } from './introanim.mjs';
// import {addTileMapSupport} from './extras/tilemaps.mjs';
// import {Mixer} from './boombox.mjs'

// export default async function main() {
//     let ecs = new ECS();
//     let e = ecs.makeEntity({width: 320, height: 320});
//     ecs.update();
//     let i = new InputManager();
//     let r = new Renderer(document.querySelector('#gamescreen'));
//     let a = new AssetManager();
//     let m = new Mixer();
//     addTileMapSupport();
//     let pokitOS = await new PokitOS({inputmanager: i, ecs: ecs, renderer: r, assets: a, mixer: m}).preload();
//     // a.getImage('load_text', '/img/bootscreen_text.svg');
//     // e.addCog('img', {imgname:'load_text'})
//     pokitOS.start();
//     //let boombox = new Mixer();
//     //boombox.init(pokitOS);
//     //let sound = await a.queueAsset('xmas', '/carts/krackedEC/LastChristmas.mp3', Types.SOUND);
//     //boombox.playSound(sound);
//     doIntroAnim(pokitOS)
//     // let load = await pokitOS.assets.queueImage('load_text', '/img/bootscreen_text.png');
//     // let loa2 = await pokitOS.assets.queueImage('load_text2', '/img/bootscreen_top.png');
//     // let cam = pokitOS.ecs.makeEntity({x:0,y:0,height:320,width:320,z:0})
//     //            .addCog('camera', {isMainCamera:true});
//     // let durr = pokitOS.ecs.makeEntity({x:160,y:160*1,height:320,width:320,z:10})
//     //             .addCog('img', {id: 'load_text'})
//     //             .addCog('spriteActor')
//     // let dur2 = pokitOS.ecs.makeEntity({x:160,y:160*1,height:loa2.height,width:loa2.width,z:1})
//     //             .addCog('img', {id: 'load_text2'})
//     //             .addCog('spriteActor')
//     // console.log(durr)

//     window.pokitOS = pokitOS;
//     return pokitOS;
// }

import {InputManager} from './inputmanager.mjs'
import {ECS} from './ecs.mjs';
// import {Renderer} from './smolrender.mjs';
import {Renderer} from './jewls.mjs';
import {Mixer} from './boombox.mjs'
import {PokitOS} from './pokitos.mjs';
import {Types,AssetManager} from './assetmanager.mjs';
import {SpatialHash} from './spatialhash.mjs'
import {doIntroAnim} from './introanim.mjs';
import {addTileMapSupport} from './extras/tilemaps.mjs';
import './smolworker.mjs'
import * as cartloader from './cartloader.mjs'

export default async function main() {
    let pokitOS = await setup_pokitOS();
    await loadExtras(pokitOS)
    let baseURL = cartloader.getBaseCartURL()
    console.log(baseURL)
    let cartinfo = await cartloader.parseCartManifest(baseURL)
    await cartloader.loadCartModule(cartinfo, pokitOS)
    await cartloader.preloadCartAssets(cartinfo, pokitOS)
    await preload_introanim_assets(pokitOS);


    enable_fullscreen_enabling(pokitOS);
    let openprom = setup_console_open(pokitOS);

    await openprom
    await cartloader.startCart(cartinfo, pokitOS)

    return pokitOS;
}

async function preload_introanim_assets(pokitOS) {
    await pokitOS.assets.queueAsset('load_text', '/img/bootscreen_text.svg', Types.IMAGE);
    await pokitOS.assets.queueAsset('load_top', '/img/bootscreen_top.svg', Types.IMAGE);
    await pokitOS.assets.queueAsset('load_bottom', '/img/bootscreen_bottom.svg', Types.IMAGE);
    return pokitOS;
}

async function setup_console_open(pokitOS) {
    return new Promise(resolve =>
       document.querySelector('#onbutton').onclick = 
           async function() {
               console.log('doing')
               document.querySelector('#powercase_right').className = 'hidden'
               document.querySelector('#powercase_left').className = 'hidden'
               pokitOS.start();
               await doIntroAnim(pokitOS)
               console.log('done')
               resolve(pokitOS)
           })
}

async function setup_pokitOS() {
    let ecs = new ECS();
    let e = ecs.makeEntity({width: 320, height: 320});
    ecs.update();
    let i = new InputManager();
    let r = new Renderer(document.querySelector('#gamescreen'));
    let a = new AssetManager();
    let m = new Mixer();
    let pokitOS = new PokitOS({inputmanager: i, ecs: ecs, renderer: r, assets: a, mixer: m});
    await pokitOS.preload();
    window.pokitOS = pokitOS;
    return pokitOS;
}

async function loadExtras(pokitOS) {
    addTileMapSupport(pokitOS)
}

async function enable_fullscreen_enabling(pokitOS) {
    document.querySelector('#fullscreen').onclick = () => screenfull.toggle();
    document.querySelector('#gamescreen').ondblclick = () => screenfull.toggle();
}



// main();