
let prisort = (a, b) => a.priority - b.priority
function no_op(){}
function prepSystem(sys) {
    for (let x of ['init', 'update', 'destroy', 'runonce']) {
        if (!sys[x]) {
            sys[x] = no_op
        }
    }
    if (!sys.exts) (sys.exts = {})
    return sys
}
class PokitEntity{
    constructor(ecs, identity, engine) {
        Object.assign(this,
                {_x:0,_y:0,_z:0,
                height:0,width:0,depth:1,
                rotation:0,
                scaleX:1,scaleY:1,scaleZ:1,
                velocity:0,
                flags:new Set(),
                parent:{x:0,y:0,z:0}},
            identity);
            this.id = Math.random();
            this.ecs = ecs;
            this.systems = new Map();
            this.exts = new Map();
            this._sorted = [];
            this.runonce = [];
            this.pokitOS = engine;
    }
    get x() {
        return this.parent.x + this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this.parent.y + this._y;
    }
    set y(value) {
        this._y = value;
    }
    get z() {
        return this.parent.z + this._z;
    }
    set z(value) {
        this._z = value;
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
        if(typeof sys === "function") {
            sys = new sys(this.pokitOS);
            prepSystem(sys)
        }
        sys.init(this, props);
        this.systems.set(systemName, sys)
        this.ecs.reverseSet(systemName, this)
        return this.sortSystems();
    }
    addUniqueSystem(systemName,sys) {
        sys = prepSystem(sys)
        this.systems.set(systemName,sys)
        return this.sortSystems();
    }
    removeSystem(sn) {
        this.systems.get(sn).destroy(this);
        this.systems.delete(sn);
        this.ecs.reverseRemove(sn, this);
        return this.sortSystems();
    }
    sortSystems() {
        this._sorted = [...this.systems.values()].sort(prisort)
        return this;
    }
    hydrate(jsono) {
        let o = JSON.parse(jsono);
    }
    destroy() {
        for (let [n,x] of this.systems) {
            this.removeSystem(n)
        }
        this.ecs.popEntity(this.id)
    }
}

export class ECS {
    constructor() {
        this.entities = new Map();
        // TODO: Add cache array of entities
        this.systems = new Map();
        this.reverse_lookup = {}
        this.pokitOS = null;
    }
    init(pokitOS) {this.pokitOS = pokitOS}
    reverseSet(systemName, entity) {
        let s = this.reverse_lookup[systemName]
        if (s) {
            s.add(entity)
        } else {
            this.reverse_lookup[systemName] = new Set([entity])
        }
        // TODO: ECHO global with debug boolean. Also minifier exclusion?
        console.log(this.reverse_lookup)
        return this;
    }
    reverseRemove(systemName, entity) {
        let s = this.reverse_lookup[systemName]
        if (s) {
            s.delete(entity)
        }
        return this;
    }
    setSystem(systemName, newsystem) {
        if (typeof newsystem === "object") {
            prepSystem(newsystem)
        }
        this.systems.set(systemName, newsystem)
        return this;
    }
    removeSystem(systemName) {
        this.systems.delete(systemName)
        delete this.reverse_lookup[systemName]
    }
    makeEntity(identity) {
        let e = new PokitEntity(this, identity);
        this.entities.set(e.id, e, this.pokitOS);
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
    dumpall() {
        this.entities.values().forEach(e=>e.destroy())
        this.reverse_lookup = {}
        this.entities = new Map()
        this.systems = Map()
    }
}