import {InputManager} from './smolinput.js'
import {ECS} from './ecs.js';
import Renderer from './smolrender.js';
import PokitOS from './pokitos.js';
import AM from './assetmanager.js';
import * as base from './basesystems.js';

export default function main() {
    let ecs = new ECS();
    let e = ecs.makeEntity({width: 320, height: 320});
    ecs.update();
    let i = new InputManager();
    let r = new Renderer(document.querySelector('#gamescreen'));
    let a = new AM();
    let pokitOS = new PokitOS({inputmanager: i, ecs: ecs, renderer: r, assets: a});
    pokitOS.preload();
    a.getImage('load_text', '/img/bootscreen_text.svg');
    e.addSystem('img', {imgname:'load_text'})
    pokitOS.start();
    return pokitOS;
}

main();