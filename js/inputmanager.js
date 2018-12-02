const rightbuttons = new Set(['a', 'b', 'y', 'x']);

const validbuttons = new Set(['a', 'b', 'x', 'y', 'start', 'select', 'up', 'down', 'left', 'right'])

const buttons_reset_vals = {
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

const keymap = {
    'KeyW': 'up',
    'KeyA': 'left',
    'KeyS': 'down',
    'KeyD': 'right',
    'Enter': 'start',
    'ShiftRight': 'start',
    'ShiftLeft': 'start',
    'KeyJ': 'b',
    'KeyK': 'a',
    'KeyU': 'y',
    'KeyI': 'x'
}
const gamepadbuttonmap = new Map(Object.entries({
    0: 'a',
    1: 'b',
    2: 'y',
    3: 'x',
    7: 'select',
    6: 'start',
    8: 'start',
    9: 'select',
    12: 'up',
    13: 'down',
    14: 'left',
    15: 'right'
}))

const gamepaddpadaxis = new Map([
    [7, {'-1': 'up', '1': 'down'}],
    [6, {'-1': 'left', '1': 'right'}]
])

export class InputManager {
    constructor () {
        this.buttons = {
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
        this.current_touches = new Map();
        this.current_keys = new Set();
        this.debug_callback = null;
        this.cust_keymap = keymap;
        this.cust_gamepadbuttonmap = gamepadbuttonmap;
        this.cust_gamepaddpadaxeis = gamepaddpadaxis;
    }

    setup_touch() {
        ['touchstart', 'touchmove'].map((a) => 
            document.addEventListener(a, make_handle_touchpresent(this)));
        ['touchend', 'touchcancel'].map((a) => 
            document.addEventListener(a, make_handle_touchstopped(this)));
    }

    setup_keyboard() {
        document.addEventListener('keydown', make_handle_keydown(this));
        document.addEventListener('keyup', make_handle_keyup(this));
    }

    setup_button_polling() {
        let inputmanager = this;
        function yaaaaaaas() {
            inputmanager.detect_buttons_pressed();
            requestAnimationFrame(yaaaaaaas);
        }
        requestAnimationFrame(yaaaaaaas);
    }

    full_setup() {
        this.setup_touch();
        this.setup_keyboard();
        this.setup_button_polling();
    }

    /**
     * The most important function in the object.
     * 
     * Polls the various registers available to us to determine if a button is pressed. 
     * 
     * First polls any recognized gamepads. Button-codes are set up for both
     * XBox One and PS4 controllers. No guarantee that other controllers will work.
     * 
     * Next grabs the touches on the screen, and determines if any buttons are pressed
     * using the most advanced alogrythms this side of War Games
     * 
     * Finally gets the keys showing up as pressed.
     * 
     * If we have a debug callback, calls it. Useful for, say, rendering out a debug message
     * to the screen
     */
    detect_buttons_pressed() {
        this.reset_buttons();
        let buttons = this.buttons;
        let cust_keymap = this.cust_keymap;
        if (navigator.getGamepads) {
            for (let i = 0; i < navigator.getGamepads().length; i++) {
                let gp = navigator.getGamepads()[i];
                if (gp) {
                    this.cust_gamepadbuttonmap.forEach(function(code, ind) {
                        let pre = (gp.buttons[ind] || {'pressed': false}).pressed;
                        if (pre) {
                            buttons[code] = pre;
                        }
                    })
                    this.cust_gamepaddpadaxeis.forEach(function(dirs, ind) {
                        let axe = gp.axes[ind]
                        buttons[dirs[axe]] = true
                    })
                }
            }
        }
        this.current_touches.forEach(function (a) {
            if (validbuttons.has(a.target.name)) {
                buttons[a.target.name] = true;
                if (rightbuttons.has(a.target.name)) {
                    buttons[append_with_current(a).current.name] = true;
                }
            }
        } );
        this.current_keys.forEach(function (a) {
            buttons[cust_keymap[a]] = true;
        });
        if (this.debug_callback) {
            this.debug_callback()
        }
    }

    reset_buttons(){
        for (let proppa in this.buttons) {
            this.buttons[proppa] = false;
        }
    }

}

function make_handle_touchpresent(inputmanager) {
        return function(ev) {
            console.time('handletouchpressed');
        map_touchlist(function (t) {
            inputmanager.current_touches.set(t.identifier, t)
        },
            ev.changedTouches)
            console.timeEnd('handletouchpressed');
        }
}
function make_handle_touchstopped(inputmanager) { 
    return function(ev) {
        map_touchlist(function (t) {
           inputmanager.current_touches.delete(t.identifier);
        }, ev.changedTouches);
    }
}
function make_handle_keydown(inputmanager) {
    return function(ev) {
        inputmanager.current_keys.add(ev.code);
    }
}

function make_handle_keyup(inputmanager) {
    return function(ev) {
        inputmanager.current_keys.delete(ev.code);
    }
}


function append_with_current(touch) {
    if (!touch.current) {
        let elem = document.elementFromPoint(touch.clientX, touch.clientY);
        touch.current = elem;
    }
    return touch;
}

async function map_touchlist(fn, touchlist) {
    for (let i = 0; i < touchlist.length; i++) {
        fn(touchlist.item(i));
    }
}

async function doasync(cb) {
    return cb();
}