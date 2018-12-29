import {InputManager} from './input_minimal.js'
import {ECS} from './ecs.js'
import Renderer from './smolrender.js'
import PokitOS from './pokitos.js';

export default function main() {
    let ecs = new ECS();
    let e = ecs.makeEntity();
    e.addSystem('foo', () => console.log('works!'));
    ecs.update();
    let i = new InputManager();
    let r = new Renderer(document.querySelector('#gamescreen'));
    let pokitOS = new PokitOS({inputmanager: i, ecs: ecs, renderer: r});
    pokitOS.preload();
    pokitOS.start();
}