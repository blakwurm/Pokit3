export default class PokitOS {
    constructor(initbundle) {
        let s = this;
        this.time = null;
        this.renderer = null;
        this.ecs = null;
        Object.assign(this, initbundle);
    }
    maketime() {
        let now = performance.now();
        let t = this.time ? this.time : {r:null,framerate:60,interval:1000/60,timelapsed:0,timesince:0,delta:0,prev:now};
        t.delta = now - t.prev;
        t.prev = now;
        t.timesince += t.delta > 1e3 ? 0 : t.delta;
        this.time = t;
        return t;
    }
    raf () {let s = this;s.time.r = requestAnimationFrame(() => s.spin.call(s))}
    start(){
        this.time = this.maketime();
        this.time.active = true;
        this.raf();
    }
    stop(){
        this.time.active = false;
        cancelAnimationFrame(this.time.r);
    }
    preload() {
        this.renderer.init(this);
        this.ecs.init(this);
    }
    spin() {
        let t = this.maketime();
        this.raf();
        while(t.timesince >= t.interval) {
            this.ecs.update()
            t.timesince -= t.interval;
        }
        this.renderer.render(this);
    }

}