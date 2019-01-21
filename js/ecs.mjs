
let prisort = (a, b) => a.priority - b.priority
function no_op(){}
function prepCog(sys) {
    for (let x of ['init', 'update', 'destroy', 'runonce', 'onCollisionEnter', 'onCollisionExit']) {
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
            console.log(engine);
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
    onCollisionEnter(collider, collision){
        this._sorted.forEach(a=>a.onCollisionEnter(collider, collision));
    }
    onCollisionExit(collider, collision){
        this._sorted.forEach(a=>a.onCollisionExit(collider, collision));
    }
    addCog(systemName, props) {
        let sys = this.ecs.systems.get(systemName);
        if(typeof sys === "function") {
            console.log(this.pokitOS);
            sys = new sys(this.pokitOS);
            prepCog(sys)
        }
        sys.init(this, props);
        this.systems.set(systemName, sys)
        this.ecs.reverseSet(systemName, this)
        return this.sortSystems();
    }
    addUniqueCog(systemName,sys) {
        sys = prepCog(sys)
        this.systems.set(systemName,sys)
        return this.sortSystems();
    }
    removeCog(sn) {
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
            this.removeCog(n)
        }
        this.ecs.popEntity(this.id)
    }
    distance(entity){
        return Math.sqrt(Math.abs((entity.x - this.x)**2 + (entity.y-this.y)**2));
    }
    bearing(entity){
        return this.rad2deg(Math.atan2(entity.y - this.y, entity.x - this.x)) + 90;
    }
    deg2rad(angle){
        return (angle/360) * (Math.PI * 2);
    }
    rad2deg(angle){
        return (angle/(Math.PI * 2)) * 360;
    }
}

export class ECS {
    constructor() {
        this.entities = new Map();
        // TODO: Add cache array of entities
        this.systems = new Map();
        this.supers = new Map();
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
    setCog(systemName, newsystem) {
        if (typeof newsystem === "object") {
            prepCog(newsystem)
        }
        this.systems.set(systemName, newsystem)
        return this;
    }
    removeCog(systemName) {
        this.systems.delete(systemName)
        delete this.reverse_lookup[systemName]
    }
    makeEntity(identity) {
        let e = new PokitEntity(this, identity, this.pokitOS);
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
        [...this.supers.values()].forEach(e=>e.update([...this.entities.values()]));
    }
    dumpall() {
        this.entities.values().forEach(e=>e.destroy())
        this.reverse_lookup = {}
        this.entities = new Map()
        this.systems = Map()
    }
}