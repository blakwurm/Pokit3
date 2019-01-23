import { SpatialHash } from './spatialhash.mjs'

let shouldLog = true;
export class PokitOS {
    constructor(initbundle) {
        let s = this;
        this.time = null;
        this.renderer = null;
        this.ecs = null;
        this.assets = null;
        this.mixer = null;
        this.cullmap = new SpatialHash(320);
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
        await this.ecs.init(this);
        await this.renderer.init(this);
        await this.assets.init(this);
        await this.mixer.init(this);
        return this;
    }
    spin() {
        let t = this.maketime();
        this.raf();
        while(t.timesince >= t.interval) {
            this.ecs.update()
            t.timesince -= t.interval;
        }
        let self = this;
        this.renderer.render(
            function(entities, camera) {
                self.cullmap.clear();
                self.cullmap.addMany(entities)
                return self.cullmap.findNearby(camera)
            }
        )
        // this.renderer.render(
        //     (entities, camera)=>{
        //         camera.x += camera.width/2;
        //         camera.y += camera.height/2;
        //         camera.z = 1;
        //         camera.depth = 1000;
        //         // camera.width*=2;
        //         // camera.height*=2;
        //         let top = entities.filter(x=>x.texture_id=='load_top')[0];
        //         let shm = new SpatialHash(1320);
        //         shm.addMany(entities);
        //         let near =  shm.findNearby(camera);
        //         if(near.has(top) && shouldLog){
        //             //console.log(top.x)
        //             shouldLog = false;
        //             //console.log(shouldLog);
        //         }
        //         return near;
        //     }
        // );
    }

}