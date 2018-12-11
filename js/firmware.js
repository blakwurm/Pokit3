import TrollyBelt from './trollybelt.js';
import Ouroboros from './ouroboros.js';
import {IMGRenderer, makeBootAnim} from './trollywheels.js';

let canvas = null;
let screen = null;
let bootscreen = new Image(320, 320);
let bootscreen_top = new Image(320, 320);
let bootscreen_bottom = new Image(320, 320);
let boot_audio = new Audio("/sound/fanfare.wav");
let boot_done = false;
let bootloop = {};
let cart = null;
let input = null;
let skipintro = false;
let pokitOS = {};
let trollybelt = new TrollyBelt(pokitOS);
let ouroboros = new Ouroboros(pokitOS);
pokitOS.trollybelt = trollybelt;
pokitOS.ouroboros = ouroboros;

export async function preload (canvas_, input_, skipintro_) {
    console.log('this bootted!');
    bootscreen.src = "/img/bootscreen_text.svg";
    bootscreen_top.src = "/img/bootscreen_top_dash.svg";
    bootscreen_bottom.src = "/img/bootscreen_bottom_dash.svg";
    canvas = canvas_;
    input = input_;
    skipintro = skipintro_;
    if (skipintro) {
        boot_done = true;
    }
    screen = canvas.getContext('2d');
    kontra.init(canvas);
    trollybelt.registerScript(new IMGRenderer(canvas_));
    pokitOS.input = input;
    pokitOS = pokitOS;
    import(get_cart_location()).then((module) => {
            cart = new module.GameCart(pokitOS);
            pokitOS.cart = cart;
            cart.preload();
        });
    makeBootAnim(trollybelt, () => pokitOS.cart.start());
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
    trollybelt.makeEntity({x: 320/2, y: 320/2, width: 320, height: 320})
        .enableComponent('imgrenderer')
        .modify(e => e.getComponent('imgrenderer').src = '/img/bootscreen_text.svg');
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