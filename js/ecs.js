let prisort = (a, b) => a.priority - b.priority;
function no_op() { }
function prepCog(sys) {
    for (let x of ['init', 'update', 'destroy', 'runonce', 'onCollisionEnter', 'onCollisionExit']) {
        if (!sys[x]) {
            sys[x] = no_op;
        }
    }
    if (!sys.exts)
        (sys.exts = {});
    return sys;
}
export class PokitEntity {
    /* IEntityIdentity */
    constructor(ecs, identity, engine) {
        Object.assign(this, { _x: 0, _y: 0, _z: 0,
            height: 0, width: 0, depth: 1,
            _rotation: 0,
            scaleX: 1, scaleY: 1, scaleZ: 1,
            velocity: 0,
            flags: new Set(),
            parent: { x: 0, y: 0, z: 0, rotation: 0 } }, identity);
        this.id = Math.random();
        this.ecs = ecs;
        this.cogs = new Map();
        this.exts = new Map();
        this._sorted = [];
        this._runonce = [];
        this._engine = engine;
        console.log(engine);
    }
    get x() {
        let rad = this.deg2rad(-this.parent.rotation);
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let rotX = this._x * c - this._y * s;
        return this.parent.x + rotX;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        let rad = this.deg2rad(-this.parent.rotation);
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let rotY = this._x * s + this._y * c;
        return this.parent.y + rotY;
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
    get rotation() {
        return this.parent.rotation + this._rotation;
    }
    set rotation(value) {
        this._rotation = value;
    }
    update() {
        let self = this;
        if (this._runonce.length) {
            this._runonce.sort(prisort).forEach(a => a.runonce(self));
            this._runonce = [];
        }
        this._sorted.forEach(a => a.update(self));
    }
    runOnce(ro) {
        this._runonce.push(ro);
    }
    onCollisionEnter(collider, collision) {
        this._sorted.forEach(a => a.onCollisionEnter(collider, collision));
    }
    onCollisionExit(collider, collision) {
        this._sorted.forEach(a => a.onCollisionExit(collider, collision));
    }
    addCog(systemName, props) {
        let sys = this.ecs.systems.get(systemName);
        if (typeof sys === "function") {
            console.log(this._engine);
            sys = new sys(this._engine);
            prepCog(sys);
        }
        sys.init(this, props);
        this.cogs.set(systemName, sys);
        this.ecs.reverseSet(systemName, this);
        return this.sortSystems();
    }
    addUniqueCog(systemName, sys) {
        sys = prepCog(sys);
        this.cogs.set(systemName, sys);
        return this.sortSystems();
    }
    removeCog(sn) {
        this.cogs.get(sn).destroy(this);
        this.cogs.delete(sn);
        this.ecs.reverseRemove(sn, this);
        return this.sortSystems();
    }
    sortSystems() {
        this._sorted = [...this.cogs.values()].sort(prisort);
        return this;
    }
    hydrate(jsono) {
        let o = JSON.parse(jsono);
    }
    destroy() {
        for (let [n, x] of this.cogs) {
            this.removeCog(n);
        }
        this.ecs.popEntity(this.id);
    }
    distance(entity) {
        return Math.sqrt(Math.abs((entity.x - this.x) ** 2 + (entity.y - this.y) ** 2));
    }
    bearing(entity) {
        return this.rad2deg(Math.atan2(entity.y - this.y, entity.x - this.x)) + 90;
    }
    deg2rad(angle) {
        return (angle / 360) * (Math.PI * 2);
    }
    rad2deg(angle) {
        return (angle / (Math.PI * 2)) * 360;
    }
}
export class ECS {
    constructor() {
        this.entities = new Map();
        // TODO: Add cache array of entities
        this.systems = new Map();
        this.reverse_lookup = {};
        this.pokitOS = null;
    }
    init(pokitOS) { this.pokitOS = pokitOS; }
    reverseSet(systemName, entity) {
        let s = this.reverse_lookup[systemName];
        if (s) {
            s.add(entity);
        }
        else {
            this.reverse_lookup[systemName] = new Set([entity]);
        }
        // TODO: ECHO global with debug boolean. Also minifier exclusion?
        console.log(this.reverse_lookup);
        return this;
    }
    reverseRemove(systemName, entity) {
        let s = this.reverse_lookup[systemName];
        if (s) {
            s.delete(entity);
        }
        return this;
    }
    setCog(systemName, newsystem) {
        if (typeof newsystem === "object") {
            prepCog(newsystem);
        }
        this.systems.set(systemName, newsystem);
        return this;
    }
    removeCog(systemName) {
        this.systems.delete(systemName);
        delete this.reverse_lookup[systemName];
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
        [...this.entities.values()].forEach(e => e.update());
    }
    dumpall() {
        [...this.entities.values()].forEach(e => e.destroy());
        this.reverse_lookup = {};
        this.entities = new Map();
        this.systems = new Map();
    }
}
