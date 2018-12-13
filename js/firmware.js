import TrollyBelt from './trollybelt.js';
import BaubleBox from './baublebox.js';
import Ouroboros from './ouroboros.js';
import {IMGRenderer, makeBootAnim} from './trollywheels.js';
import setupBB from './baubles.js';

let canvas = null;
let screen = null;
let boot_audio = new Audio("/sound/fanfare.wav");
let boot_done = false;
let bootloop = {};
let cart = null;
let input = null;
let skipintro = false;
let pokitOS = {};
// let trollybelt = new TrollyBelt(pokitOS);
let baublebox = new BaubleBox(pokitOS);
let ouroboros = new Ouroboros(pokitOS);
// pokitOS.trollybelt = trollybelt;
pokitOS.ouroboros = ouroboros;
pokitOS.baublebox = baublebox;

export async function preload (canvas_, input_, skipintro_) {
    console.log('this bootted!');
    canvas = canvas_;
    input = input_;
    skipintro = skipintro_;
    setupBB(baublebox, canvas, skipintro, () => cart.start());
    if (skipintro) {
        boot_done = true;
    }
    screen = canvas.getContext('2d');
    kontra.init(canvas);
    // trollybelt.registerScript(new IMGRenderer(canvas_));
    pokitOS.input = input;
    pokitOS = pokitOS;
    import(get_cart_location()).then((module) => {
            cart = new module.GameCart(pokitOS);
            pokitOS.cart = cart;
            cart.preload();
            if (skipintro) {
                cart.start();
            }
        });
    // makeBootAnim(trollybelt, () => pokitOS.cart.start());
    // makeTestEntity();
    // let cartag = document.createElement('script');
    // cartag.src = get_cart_location();
    // document.querySelector('body').appendChild(cartag);
    // cartag.onload = function () {
    //     cart = pokitOS.cart;
    //     cart.preload();
    // };

    console.log(this);
}

function makeTestEntity() {
    // trollybelt.makeEntity({x: 320/2, y: 320/2, width: 320, height: 320})
    //     .enableComponent('imgrenderer')
    //     .modify(e => e.getComponent('imgrenderer').src = '/img/bootscreen_text.svg');
    baublebox.makeEntity({x: 320/2, y: 320/2, width: 320, height: 320})
        ('img', {src: '/img/bootscreen_text.svg'})
}

export async function boot() {
    pokitOS.ouroboros.start();
}

function get_cart_location() {
    let params = new URLSearchParams(window.location.search);
    let cartlocation = params.has('cart') ? params.get('cart') : "/carts/testing.js";
    return cartlocation
}

window.GameCart = class {
    constructor(gamename) {
        this.pokitOS = pokitOS;
        this.name = gamename;
        pokitOS.cart = this;
    }
    preload() {
        // Called as soon as the script loads, while the boot screen is animating
    }
    start() {
        // Called when the game starts
    }
    suspend() {
        // Called when the game is suspended
    }
    end() {
        // Called when the game ends
    }
}