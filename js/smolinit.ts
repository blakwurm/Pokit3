import {InputManager} from './smolinput'
import {ECS} from './ecs';
// import {Renderer} from './smolrender.mjs';
import {Renderer} from './jewls';
import {Mixer} from './boombox'
import {PokitOS} from './pokitos';
import {Types,AssetManager} from './assetmanager';
import {SpatialHash} from './spatialhash'
import {doIntroAnim} from './introanim';
import {addTileMapSupport} from './extras/tilemaps';
import './smolworker'

export default async function main() {
    let ecs = new ECS();
    let e = ecs.makeEntity({width: 320, height: 320});
    ecs.update();
    let i = new InputManager();
    let r = new Renderer(document.querySelector('#gamescreen'));
    let a = new AssetManager();
    let m = new Mixer();
    addTileMapSupport();
    let pokitOS = await new PokitOS({inputmanager: i, ecs: ecs, renderer: r, assets: a, mixer: m}).preload();
    // a.getImage('load_text', '/img/bootscreen_text.svg');
    // e.addCog('img', {imgname:'load_text'})
    pokitOS.start();
    //let boombox = new Mixer();
    //boombox.init(pokitOS);
    //let sound = await a.queueAsset('xmas', '/carts/krackedEC/LastChristmas.mp3', Types.SOUND);
    //boombox.playSound(sound);
    doIntroAnim(pokitOS)
    // let load = await pokitOS.assets.queueImage('load_text', '/img/bootscreen_text.png');
    // let loa2 = await pokitOS.assets.queueImage('load_text2', '/img/bootscreen_top.png');
    // let cam = pokitOS.ecs.makeEntity({x:0,y:0,height:320,width:320,z:0})
    //            .addCog('camera', {isMainCamera:true});
    // let durr = pokitOS.ecs.makeEntity({x:160,y:160*1,height:320,width:320,z:10})
    //             .addCog('img', {id: 'load_text'})
    //             .addCog('spriteActor')
    // let dur2 = pokitOS.ecs.makeEntity({x:160,y:160*1,height:loa2.height,width:loa2.width,z:1})
    //             .addCog('img', {id: 'load_text2'})
    //             .addCog('spriteActor')
    // console.log(durr)

    window.pokitOS = pokitOS;
    return pokitOS;
}
