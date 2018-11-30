import { html, render } from 'https://unpkg.com/lit-html?module'

export let buttons = {
    'up': false,
    'down': false,
    'right': false,
    'left': false,
    'a': false,
    'b': false,
    'x': false,
    'y': false,
    'start': false,
    'select': false
};

let rightbuttons = new Set(['a', 'b', 'y', 'x']);

let buttons_reset_vals = {
    'up': false,
    'down': false,
    'right': false,
    'left': false,
    'a': false,
    'b': false,
    'x': false,
    'y': false,
    'start': false,
    'select': false
};

let debug = true;

let current_touches = Set([]);

function debug_fill_canvas() {
    let c = document.getElementById('gamescreen');
    let ctx = c.getContext('2d');
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, c.width, c.height);
}
console.log('testing');
debug_fill_canvas()

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

function touchtargets(touchevent) {
    let touches = touchevent.touches;
    let retlist = [];
    for (let i = 0; i < touches.length; i++) {
        let t = touches[i];
        let elem = document.elementFromPoint(t.clientX, t.clientY);
        let source = t.target;
        retlist.push({
            'current': elem,
            'source': source
        });
    }

    return retlist

}

let debug_readout = (debug_bundle) => html`
  <div id="debugreadout">
      <div>pressed:${JSON.stringify(debug_bundle.buttons, null, 2)}</div>
      <div>Touches: </div>
      ${debug_bundle.touchevent ? html`
            ${touchtargets(debug_bundle.touchevent).map((a) => `${a.source.id} -> ${a.current.id}, `)}
      ` : '' }
       
  </div>
`;

function render_controls() {
    render(controls(), document.querySelector('#controls'));
}

function render_debug_readout(touchevent) {
    if (debug) {
        render(debug_readout(
            {
                'buttons': buttons,
                'touchevent': touchevent
            }
        ),
         document.querySelector('#debug_point'));
    }
}

function reset_buttons(){
    for (let proppa in buttons) {
        buttons[proppa] = false;
    }
}

function detect_buttons_pressed(targets) {
    reset_buttons()
    targets.map(function (a) {
        if (a.current.tagName === "BUTTON") {
            buttons[a.current.name] = true;
        }
    })
}

function touchcallback(touchevent) {
    debug ? render_debug_readout(touchevent) : null;
    let targets = touchtargets(touchevent);
    current_touches.clear();
    targets.map((a) => current_touches.add(a))
}

function setup_touch() {
    ['touchmove', 'touchstart', 'touchend', 'touchcancel'].map((a) =>
        document.addEventListener(a, touchcallback))
    ['touchend', 'touchcancel'].map((a) =>
        document.addEventListener(a, reset_buttons))
   
}


render_controls();
render_debug_readout();
setup_touch();