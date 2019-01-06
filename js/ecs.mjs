
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
        this.ecs.reverseSet(systemName, this)
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
    destroy() {
        for (let [n,x] of this.systems) {
            this.ecs.reverseRemove(n,this)
            x.destroy(this)
        }

    }
}

export class ECS {
    constructor() {
        this.entities = new Map();
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
        for (let x of ['init', 'update', 'destroy', 'runonce']) {
            if (!newsystem[x]) {
                newsystem[x] = () => {}
            }
        }
        this.systems.set(systemName, newsystem)
        return this;
    }
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