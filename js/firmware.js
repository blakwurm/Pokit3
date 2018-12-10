import TrollyBelt from './trollybelt.js';
import Ouroboros from './ouroboros.js';
import {IMGRenderer} from './trollywheels.js';

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
    pokitOS.input = input;
    pokitOS.trollybelt = new TrollyBelt(document.pokitOS);
    pokitOS.ouroboros = new Ouroboros(document.pokitOS);
    document.pokitOS = pokitOS;
    let cartag = document.createElement('script');
    cartag.src = get_cart_location();
    document.querySelector('body').appendChild(cartag);
    cartag.onload = function () {
        cart = document.pokitOS.gamecart;
        cart.init();
    };
    console.log(this);
}

export async function boot() {
    // begin_boot_sequence();
    pokitOS.ouroboros.start();
}

function get_cart_location() {
    let params = new URLSearchParams(window.location.search);
    let cartlocation = params.has('cart') ? params.get('cart') : "/carts/asteroids.js";
    return cartlocation
}

async function load_cart() {
    if (cart) {
        console.log(cart);
        bootloop.update = cart.update;
        bootloop.render = cart.render;
    }
}

async function begin_boot_sequence() {
    // let bootsprite = kontra.sprite({
    //     x: 0, y: 320, width: 320, height: 320, opacity: 100, image: bootscreen
    // });
    // let bootsprite_top = kontra.sprite({
    //     x: -320, y: 0, width: 320, height: 320, opacity: 100, image: bootscreen_top

    // });
    // let bootsprite_bottom = kontra.sprite({
    //     x: 320, y: 0, width: 320, height: 320, opacity: 100, image: bootscreen_bottom
    // });
    // let update_anim = setup_boot_anim(bootsprite, bootsprite_top, bootsprite_bottom);
    // boot_audio.play();
    // bootloop = kontra.gameLoop({
    //     fps: 60,
    //     update:function () {
    //         update_anim();
    //         if (boot_done) {
    //             load_cart();
    //         }
    //     },
    //     render: function() {
    //         bootsprite.render();
    //         bootsprite_top.render();
    //         bootsprite_bottom.render();
    //     }
    // });
    // bootloop.start();
    // pokitOS.ouroboros.update = function() {
    //     console.timeEnd('jk');
    //     update_anim();
    //     if (boot_done) {
    //         load_cart();
    //     }
    //     console.time('jk');
    // }
    // pokitOS.ouroboros.render = function() {
    //     bootsprite.render();
    //     bootsprite_top.render();
    //     bootsprite_bottom.render();
    // }
    pokitOS.ouroboros.start();
}

function setup_boot_anim (bootsprite, bootsprite_top, bootsprite_bottom) {
    let hold = 35;
    let display_bootsprite = true;
    console.log('booting');
    function update_boot_anim() {
            if (boot_done) {
                return
            }
            let textin = false;
            let topin = false;
            let bottomin = false;
            let opacity = 100;
            if (bootsprite.y > 0) {
                bootsprite.y -= 4;
                console.log(bootsprite.x);
                return;
            } 

            if (bootsprite_top.x < 0) {
                bootsprite_top.x += 20;
                console.log(bootsprite_top.x)
                return;
            }

            if (bootsprite_bottom.x > 0) {
                bootsprite_bottom.x -= 20;
                console.log(bootsprite_bottom.x)
                return;
            }

            if (hold > 0) {
                console.log('hold is ' + hold);
                hold -= 1;
                return;
            }


            if (bootsprite.opacity > 0) {
                [bootsprite, bootsprite_bottom, bootsprite_top].map(function (img) {
                    img.opacity -= 2;
                    console.log(img.opacity);
                })
                return;
            }
            boot_done = true;
        }
    return update_boot_anim;
}