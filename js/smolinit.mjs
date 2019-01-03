import {InputManager} from './smolinput.mjs'
import {ECS} from './ecs.mjs';
import {Renderer} from './smolrender.mjs';
import {PokitOS} from './pokitos.mjs';
import {AssetManager} from './assetmanager.mjs';
import {SpatialHash} from './spatialhash.mjs'

export default function main() {
    let ecs = new ECS();
    let e = ecs.makeEntity({width: 320, height: 320});
    ecs.update();
    let i = new InputManager();
    let r = new Renderer(document.querySelector('#gamescreen'));
    let a = new AssetManager();
    let pokitOS = new PokitOS({inputmanager: i, ecs: ecs, renderer: r, assets: a});
    pokitOS.preload();
    a.getImage('load_text', '/img/bootscreen_text.svg');
    e.addSystem('img', {imgname:'load_text'})
    pokitOS.start();
    return pokitOS;
}

main();