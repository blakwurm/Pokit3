import { SpatialHash } from './spatialhash.mjs'

export class PokitOS {
    constructor(initbundle) {
        let s = this;
        this.time = null;
        this.renderer = null;
        this.ecs = null;
        this.assets = null;
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
    async preload() {
        await this.renderer.init(this);
        await this.ecs.init(this);
        await this.assets.init(this);
        return this;
    }
    spin() {
        let t = this.maketime();
        this.raf();
        while(t.timesince >= t.interval) {
            this.ecs.update()
            t.timesince -= t.interval;
        }
        this.renderer.render(
            (entities, camera)=>{
                let shm = new SpatialHash(120);
                shm.addMany(entities);
                return shm.findNearby(camera);
            }
        );
    }

}