/**
 * Object for handling the state of the console's input. Afte constructing,
 * call full_setup().
 */
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
        this.current_keys = new Set();
        this.debug_callback = null;
        this.cust_keymap = {
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
            'KeyI': 'x',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'ArrowUp': 'up',
            'ArrowDown': 'down'
            };
        document.addEventListener('keydown', (ev) => {
            this.current_keys.delete(ev.code);
            console.log('pressing a key: ' + ev.code)
            this.dirty_keys = true;
        });
        document.addEventListener('keyup', (ev) => {
            this.current_keys.delete(ev.code);
            console.log('releasing a key: ' + ev.code)
            this.dirty_keys = true;
        });
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
        for (let proppa in this.buttons) {
            this.buttons[proppa] = false;
        }
        let buttons = this.buttons;
        let cust_keymap = this.cust_keymap;
        this.current_keys.forEach(function (a) {
            buttons[cust_keymap[a]] = true;
        });
        if (this.debug_callback) {
            this.debug_callback()
        }
    }

    tick() {
        if (this.dirty_keys){
            this.detect_buttons_pressed();
        }
    }

}

