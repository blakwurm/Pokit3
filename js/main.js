import { html, render } from 'https://unpkg.com/lit-html?module'
import {InputManager} from '/js/inputmanager.js'

let debug = true;
let input = new InputManager();

function debug_fill_canvas() {
    let c = document.getElementById('gamescreen');
    let ctx = c.getContext('2d');
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, c.width, c.height);
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
    <button id="selectbutton" name="select">SELECT</button>
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

function main() {
    console.log('testing');
    render_controls();
    input.full_setup();
    if (debug) {
        input.debug_callback = render_debug_readout;
        debug_fill_canvas()
        render_debug_readout();
    }
}

main()