import { html, render } from 'https://unpkg.com/lit-html/lit-html.js?module'
import {InputManager} from '/js/inputmanager.js'
import {preload, boot} from './firmware.js'

let debug = false;
let input = new InputManager();
let powercase_state = 'active';
let firmware = undefined;

function begin_debug() {
    if (debug) {
        // debug_fill_canvas()
        render_debug_readout()
        input.debug_callback = render_debug_readout;
    }
}

function undo_debug() {
    if (!debug) {
        input.debug_callback = function() {
            render(html``, document.querySelector('#debug_point'));
        }
    }
}

function toggle_debug() {
    debug = !debug;
    begin_debug();
    undo_debug();
}


function open_console() {
    powercase_state = 'hidden';
    let can = document.querySelector('#gamescreen')
    render_controls();
    boot();
}

function controls() {
    return html`
  <div id="dpad" class="buttongroup">
    <button id="pad-left" name="left"></button>
    <button id="pad-up" name="up"></button>
    <button id="pad-down" name="down"></button>
    <button id="pad-right" name="right"></button>
  </div>
  </div>
  <div id="startselect" class="buttongroup">
    <button id="startbutton" name="start">START</button>
    <button id="selectbutton" name="select" @dblclick='${() => toggle_debug()}'>SELECT</button>
  </div>
  <div id="rightbuttons" class="buttongroup">
    <button id="ybutton" name="y">Y</button>
    <button id="xbutton" name="x">X</button>
    <button id="bbutton" name="b">B</button>
    <button id="abutton" name="a">A</button>
  </div>
  <div id="metabuttons" class="buttongroup">
    <button id="fullscreen" @click='${() => screenfull.toggle()}'>
      Fullscreen
    </button>
  </div>
  <div id="powercase_right" class="${powercase_state}"></div>
  <div id="powercase_left" class="${powercase_state}">
      <button @click='${open_console}'></button>
  </div>
    `
}

function touches_rendered() {
    let allout = ' ';
    let touchentries = input.current_touches.entries();
    input.current_touches.forEach((a) => allout += `[${a.target.id} => ${(a.current || a.target).id}]`);
    return allout;
}

let debug_readout = () => html`
  <div id="debugreadout">
      <div>pressed:${JSON.stringify(input.buttons, null, 2)}</div>
      <div>Touches: </div>
      ${touches_rendered()}
  </div>
`;

function render_controls() {
    render(controls(), document.querySelector('#controls'));
}

async function doasync(cb) {
    return cb();
}

function render_debug_readout() {
    if (debug) {
        doasync(() =>
        render(debug_readout(
            {
                'buttons': input.buttons
            }
        ),
        document.querySelector('#debug_point')))
    };
}

function makeAThing() {
    let scripto = document.createElement('script');
    scripto.text = 'console.log("haha")';
    document.open();
    document.write(`
    <html>
        <head>
            <link rel="stylesheet" href="/css/main.css">
        </head>
        <body>
            <canvas id="gamescreen" height="320" width="320"></canvas>
            <div id="controls"></div>
            <div id="debug_point"></div>
            <div id="cart_slot"></div>
            <div id='controls'></div>
        </body>
    </html>
    `
    )
    document.close();
}

async function main() {
    console.log('testing');
    makeAThing();
    render_controls();
    input.full_setup();
    begin_debug();
    let can = document.querySelector('#gamescreen')
    can.addEventListener('dblclick', () => screenfull.toggle(can))
    // firmware = await new Firmware(kontra, can, get_cart_location()).init();
    let params = new URLSearchParams(window.location.search);
    let skipintro = params.has('skipintro') ? true : false;
    let loadresult = await preload(can, input, skipintro);
    console.log(loadresult)
    if (skipintro) {
        powercase_state = 'hidden';
        open_console();
    }
    if (powercase_state === 'hidden') {
        // For 'live-server' reloading.
        // firmware.boot();
    }
    console.log(firmware);
}

main()