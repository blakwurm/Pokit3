Function.prototype.update = function (e, a) {this.call('',e, 'update', a);}
Function.prototype.init = function (e, a) {this.call('',e, 'init', a);}
Function.prototype.destroy = function (e, a) {this.call('',e, 'destroy', a);}
Function.prototype.runonce = function (e, a) {this.call('',e, 'runonce', a);} 
Function.prototype.priority = 0;

let prisort = (a, b) => a.priority - b.priority

class PokitEntity{
    constructor(ecs, identity) {
        this.pokitOS = null;
        Object.assign(this,
            {x:0,y:0,z:0,height:0,width:0,rotation:0,velocity:0,flags:new Set(),parent:null},
            identity)
            this.id = Math.random();
            this.ecs = ecs;
            this.systems = new Map();
            this.exts = new Map();
            this._sorted = [];
            this.runonce = [];
    }
    update() {
        let self = this;
        if (this.runonce.length) {
            this.runonce.sort(prisort).forEach(a=>a.runonce(self))
            this.runonce = [];
        }
        this._sorted.forEach(a=>a.update(self));
    }
    runOnce(ro) {
        this.runonce.push(ro);
    }
    addSystem(systemName, props) {
        let sys = this.ecs.systems.get(systemName);
        sys.init(this, props);
        this.systems.set(systemName, sys)
        return this.sortSystems();
    }
    removeSystem(sn) {
        this.systems.get(sn).destroy(this);
        this.systems.delete(sn);
        return this.sortSystems();
    }
    sortSystems() {
        this._sorted = [...this.systems.values()].sort(prisort)
        return this;
    }
    hydrate(jsono) {
        let o = JSON.parse(jsono);
    }
}

export class ECS {
    constructor() {
        this.entities = new Map();
        this.systems = new Map();
        this.pokitOS = null;
    }
    init(pokitOS) {this.pokitOS = pokitOS}
    makeEntity(identity) {
        let e = new PokitEntity(this, identity);
        this.entities.set(e.id, e);
        return e;
    }
    popEntity(id) {
        let e = this.entities.get(id);
        this.entities.delete(id);
        return e;
    }
    update() {
        [...this.entities.values()].forEach(e=>e.update());
    }
}