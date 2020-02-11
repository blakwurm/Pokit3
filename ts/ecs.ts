import { PokitOS } from "./pokitos";

export interface ICog {
    exts?: {
        [id: string]: any
    },
    init? (entity: PokitEntity, args: IJsonSerializableObject): void,
    update? (entity: PokitEntity):void,
    destroy? (entity: PokitEntity):void,
    runonce? (entity: PokitEntity):void,
    onCollisionEnter? (entity: PokitEntity, collider: PokitEntity):void,
    onCollisionExit? (entity: PokitEntity, collider: PokitEntity):void,
    hydrate? (data: any):void
}

export interface IEntityIdentity{
    x?: number, y?: number, z?: number,
    height?: number, width?: number, depth?: number,
    rotation?: number,
    scaleX?: number, scaleY?: number, scaleZ?: number,
    velocity?: number,
    flags?: Set<string>,
    parent?: IEntityIdentity
}

export interface IEntityPrefab {
    identity: IEntityIdentity,
    systems: {
        [name: string]: any
    }
}

export interface ISaveData {
    identity: IEntityIdentity,
    cogData: {
        [id: string]: any
    }
}

let prisort = (a, b) => a.priority - b.priority
function no_op(){}
function prepCog(sys: ICog) {
    for (let x of ['init', 'update', 'destroy', 'runonce', 'onCollisionEnter', 'onCollisionExit']) {
        if (!sys[x]) {
            sys[x] = no_op
        }
    }
    if (!sys.exts) (sys.exts = {})
    return sys
}

export class PokitEntity implements IEntityIdentity{
    private _sorted: ICog[];
    private _runonce: ICog[];
    private _engine: PokitOS;
    private _x: number;
    private _y: number;
    private _z: number;
    private _rotation: number;

    id: number;
    ecs: ECS;
    cogs: Map<string,ICog>;
    exts: Map<string,any>;
    
    /* IEntityIdentity */
    height: number;
    width: number;
    depth: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    velocity: number;
    flags: Set<string>;
    parent: IEntityIdentity;
    /* IEntityIdentity */

    constructor(ecs: ECS, identity: IEntityIdentity, engine: PokitOS) {
        Object.assign(this,
                {_x:0,_y:0,_z:0,
                height:0,width:0,depth:1,
                _rotation:0,
                scaleX:1,scaleY:1,scaleZ:1,
                velocity:0,
                flags:new Set(),
                parent:{x:0,y:0,z:0, rotation: 0}},
            identity);
            this.id = Math.random();
            this.ecs = ecs;
            this.cogs = new Map();
            this.exts = new Map();
            this._sorted = [];
            this._runonce = [];
            this._engine = engine;
            console.log(engine);
    }
    get x(): number {
        let rad = this.deg2rad(-this.parent.rotation);
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let rotX = this._x * c - this._y * s;
        return this.parent.x + rotX;
    }
    set x(value: number) {
        this._x = value;
    }
    get y(): number {
        let rad = this.deg2rad(-this.parent.rotation);
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let rotY = this._x * s + this._y * c;
        return this.parent.y + rotY;
    }
    set y(value: number) {
        this._y = value;
    }
    get z(): number {
        return this.parent.z + this._z;
    }
    set z(value: number) {
        this._z = value;
    }
    get rotation(): number {
        return this.parent.rotation + this._rotation;
    }
    set rotation(value: number) {
        this._rotation = value;
    }
    update() {
        let self = this;
        if (this._runonce.length) {
            this._runonce.sort(prisort).forEach(a=>a.runonce(self))
            this._runonce = [];
        }
        this._sorted.forEach(a=>a.update(self));
    }
    runOnce(ro: ICog) {
        this._runonce.push(ro);
    }
    onCollisionEnter(collider: PokitEntity, collision: PokitEntity){
        this._sorted.forEach(a=>a.onCollisionEnter(collider, collision));
    }
    onCollisionExit(collider: PokitEntity, collision: PokitEntity){
        this._sorted.forEach(a=>a.onCollisionExit(collider, collision));
    }
    addCog(systemName: string, props: IJsonSerializableObject): PokitEntity {
        let sys = this.ecs.systems.get(systemName);
        if(typeof sys === "function") {
            console.log(this._engine);
            sys = new sys(this._engine);
            prepCog(sys)
        }
        sys.init(this, props);
        this.cogs.set(systemName, sys)
        this.ecs.reverseSet(systemName, this)
        return this.sortSystems();
    }
    addUniqueCog(systemName: string, sys: ICog): PokitEntity {
        sys = prepCog(sys)
        this.cogs.set(systemName,sys)
        return this.sortSystems();
    }
    removeCog(sn: string): PokitEntity {
        this.cogs.get(sn).destroy(this);
        this.cogs.delete(sn);
        this.ecs.reverseRemove(sn, this);
        return this.sortSystems();
    }
    sortSystems(): PokitEntity {
        this._sorted = [...this.cogs.values()].sort(prisort)
        return this;
    }
    hydrate(data: ISaveData) {
        Object.assign(this, data);
        for(let [sys, obj] of Object.entries(data.cogData)) {
            this.cogs.get(sys).hydrate(obj);
        }
    }
    destroy() {
        for (let [n,x] of this.cogs) {
            this.removeCog(n)
        }
        this.ecs.popEntity(this.id)
    }
    distance(entity: PokitEntity){
        return Math.sqrt(Math.abs((entity.x - this.x)**2 + (entity.y-this.y)**2));
    }
    bearing(entity: PokitEntity){
        return this.rad2deg(Math.atan2(entity.y - this.y, entity.x - this.x)) + 90;
    }
    deg2rad(angle: number){
        return (angle/360) * (Math.PI * 2);
    }
    rad2deg(angle: number){
        return (angle/(Math.PI * 2)) * 360;
    }
}

export class ECS {
    entities: Map<number, PokitEntity>;
    prefabs: Map<string, IEntityPrefab>;
    systems: Map<string, ICog | {new (engine: PokitOS): ICog}>;
    reverse_lookup: {[system: string]: Set<PokitEntity>};
    pokitOS: PokitOS;
    defaultCamera: PokitEntity;

    constructor() {
        this.entities = new Map();
        // TODO: Add cache array of entities
        this.prefabs = new Map();
        this.systems = new Map();
        this.reverse_lookup = {}
        this.pokitOS = null;
    }
    init(pokitOS: PokitOS) {this.pokitOS = pokitOS}
    reverseSet(systemName: string, entity: PokitEntity) {
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
    reverseRemove(systemName: string, entity: PokitEntity) {
        let s = this.reverse_lookup[systemName]
        if (s) {
            s.delete(entity)
        }
        return this;
    }
    setCog(systemName: string, newsystem: {new (engine: PokitOS): ICog} | ICog) {
        if (typeof newsystem === "object") {
            prepCog(newsystem)
        }
        this.systems.set(systemName, newsystem)
        return this;
    }
    removeCog(systemName: string) {
        this.systems.delete(systemName)
        delete this.reverse_lookup[systemName]
    }
    makeEntity(identity: IEntityIdentity, ...templates: string[]) {
        let prefab = <IEntityPrefab>{
            identity: {},
            systems: {}
        };

        for(let str of templates) {
            let val = this.prefabs.get(str);
            Object.assign(prefab.identity, val.identity);
            Object.assign(prefab.systems, val.systems);
        }

        Object.assign(prefab.identity, identity);

        let e = new PokitEntity(this, prefab.identity, this.pokitOS);
        this.entities.set(e.id, e);

        for(let [sys, data] of Object.entries(prefab.systems)) {
            e.addCog(sys, data);
        }

        return e;
    }
    popEntity(id: number) {
        let e = this.entities.get(id);
        this.entities.delete(id);
        return e;
    }
    update() {
        [...this.entities.values()].forEach(e=>e.update());
    }
    dumpall() {
        [...this.entities.values()].forEach(e=>e.destroy())
        this.reverse_lookup = {}
        this.entities = new Map()
        this.systems = new Map()
    }
}