Function.prototype.update = function (e) {this.call(e, 'update');}
Function.prototype.init = function (e) {this.call(e, 'init');}
Function.prototype.destroy = function (e) {this.call(e, 'destroy');}
Function.prototype.runonce = function (e) {this.call(e, 'runonce');} 
Function.prototype.priority = 0;

let prisort = (a, b) => a.priority - b.priority

class PokitEntity{
    constructor(ecs, identity) {
        Object.assign(this,
            {x:0,y:0,z:0,height:0,width:0,rotation:0,velocity:0,flags:new Set()},
            identity,
            {id: Math.random(), ecs: ecs, systems: new Map(), _sorted: [], runonce: []});
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
        this.ro.push(runOnceFn);
    }
    addSystem(systemName, sys, priority) {
        if (priority) {sys.priority = priority}
        sys.init(this);
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
}

export class ECS {
    constructor() {
        this.entities = new Map();
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