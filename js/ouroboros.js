/*
* Refactored into class form from 
* https://github.com/straker/kontra/blob/master/src/gameLoop.js
*/

// Still needs testing.
export default class Ouroboros {
    constructor(pokitOS) {
        this.framerate = 120;
        this.timelapsed = 0;
        this.active = true;
        this.r = null;
        this.delta = 0;
        this.prev = 0;
        this.timesince = 0;
        this.pokitOS = pokitOS;
    }
    update(){
        this.pokitOS.trollybelt.update();
    }
    render(){}

    raf() {
        let t = this;
        this.r = requestAnimationFrame(() => this.frame.call(t));
    }

    maketime() {
        let now = performance.now();
        this.delta = now - this.prev;
        this.prev = now;
        this.timesince += this.delta;
    }

    start() {
        this.active = true;
        this.raf();
    }

    stop() {
        this.active = false;
        cancelAnimationFrame(this.r);
    }

    frame() {
        this.maketime();
        this.raf();

        while (this.timesince >= this.delta) {
            this.update(this.delta);
            this.timesince -= this.delta;
        }

        this.render();

        // prevent updating the game if over a second has passed 
        // (like when the game loses focus)
        if (this.delta > 1E3) {return;}
    }
    
}

// let o = new Ouroboros(document.pokitOS);
// o.update = function() {
//     console.timeEnd('t');
//     console.log('doing it again');
//     console.time('t');
// };
// o.start();