import { doRender } from './jewls/jewlsRenderer';

/*
* Refactored into class form from 
* https://github.com/straker/kontra/blob/master/src/gameLoop.js
*/

// Still needs testing.
export default class Ouroboros {
    constructor(pokitOS) {
        this.framerate = 60;
        this.interval = 1000/this.framerate;
        this.timelapsed = 0;
        this.active = true;
        this.r = null;
        this.delta = 0;
        this.prev = 0;
        this.timesince = 0;
        this.pokitOS = pokitOS;
    }
    update(n){
        this.pokitOS.baublebox.update();
    }
    render(){
        doRender();
    }

    raf() {
        let t = this;
        this.r = requestAnimationFrame(() => t.frame.call(t));
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

    frame(n) {
        this.maketime();
        this.raf();
        // prevent updating the game if over a second has passed 
        // (like when the game loses focus)
        if (this.delta > 1E3) {
            this.timesince = 0;
            return;
        }

        while (this.timesince >= this.interval) {
            this.update(this.interval);
            this.timesince -= this.interval;
        }

        this.render();
    }
    
}
