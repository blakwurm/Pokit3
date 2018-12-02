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
        this.debug_callback = null;
    }

    setup_touch() {
        ['touchstart', 'touchmove'].map((a) => 
            document.addEventListener(a, make_handle_touchpresent(this)));
        ['touchend', 'touchcancel'].map((a) => 
            document.addEventListener(a, make_handle_touchstopped(this)));
    }

    detect_buttons_pressed() {
        this.reset_buttons()
        let buttons = this.buttons;
        this.current_touches.forEach(function (a) {
            if (validbuttons.has(a.target.name)) {
                buttons[a.target.name] = true;
                if (rightbuttons.has(a.target.name)) {
                    buttons[append_with_current(a).current.name] = true;
                }
            }
        } )
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
        inputmanager.detect_buttons_pressed();
            console.timeEnd('handletouchpressed');
        }
}
function make_handle_touchstopped(inputmanager) { 
    return function(ev) {
        map_touchlist(function (t) {
           inputmanager.current_touches.delete(t.identifier);
        }, ev.changedTouches);
        inputmanager.detect_buttons_pressed();

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