import BaubleBox from './baublebox.mjs';
import Ouroboros from './ouroboros.mjs';
import Bellhop from './bellhop.mjs';
import setupBB from './baubles.mjs';
import initializeJewls from './jewls.mjs';

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
let bellhop = new Bellhop(pokitOS);
// pokitOS.trollybelt = trollybelt;
pokitOS.ouroboros = ouroboros;
pokitOS.baublebox = baublebox;
pokitOS.bellhop = bellhop;

export async function preload (canvas_, input_, skipintro_) {
    console.log('this bootted!');
    canvas = canvas_;
    pokitOS.gamescreen = canvas;
    input = input_;
    skipintro = skipintro_;
    await initializeJewls(pokitOS, canvas);
    if (skipintro) {
        boot_done = true;
    }
    // trollybelt.registerScript(new IMGRenderer(canvas_));
    pokitOS.input = input;
    pokitOS = pokitOS;
    let cartModule = await import(get_cart_location());
    console.log(cartModule.GameCart)
    cart = new cartModule.GameCart(pokitOS);
    pokitOS.cart = cart;
    cart.preload();
    if (skipintro) {
        cart.start();
    }
    setupBB(baublebox, canvas, skipintro, () => cart.start());
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
    return pokitOS;
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