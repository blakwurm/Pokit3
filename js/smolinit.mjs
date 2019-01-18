import {InputManager} from './smolinput.mjs'
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

export default async function main() {
    let ecs = new ECS();
    let e = ecs.makeEntity({width: 320, height: 320});
    ecs.update();
    let i = new InputManager();
    let r = new Renderer(document.querySelector('#gamescreen'));
    let a = new AssetManager();
    addTileMapSupport();
    let pokitOS = await new PokitOS({inputmanager: i, ecs: ecs, renderer: r, assets: a}).preload();
    // a.getImage('load_text', '/img/bootscreen_text.svg');
    // e.addSystem('img', {imgname:'load_text'})
    pokitOS.start();
    //let boombox = new Mixer();
    //boombox.init(pokitOS);
    //let sound = await a.queueAsset('xmas', '/carts/krackedEC/LastChristmas.mp3', Types.SOUND);
    //boombox.playSound(sound);
    doIntroAnim(pokitOS)
    // let load = await pokitOS.assets.queueImage('load_text', '/img/bootscreen_text.png');
    // let loa2 = await pokitOS.assets.queueImage('load_text2', '/img/bootscreen_top.png');
    // let cam = pokitOS.ecs.makeEntity({x:0,y:0,height:320,width:320,z:0})
    //            .addSystem('camera', {isMainCamera:true});
    // let durr = pokitOS.ecs.makeEntity({x:160,y:160*1,height:320,width:320,z:10})
    //             .addSystem('img', {id: 'load_text'})
    //             .addSystem('spriteActor')
    // let dur2 = pokitOS.ecs.makeEntity({x:160,y:160*1,height:loa2.height,width:loa2.width,z:1})
    //             .addSystem('img', {id: 'load_text2'})
    //             .addSystem('spriteActor')
    // console.log(durr)

    window.pokitOS = pokitOS;
    return pokitOS;
}

main();