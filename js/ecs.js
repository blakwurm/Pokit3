class PokitEntity{
    constructor(ecs, identity) {
        Object.assign(this, {x:0,y:0,z:0,height:0,width:0,rotation:0,velocity:0}, identity);
        Object.assign(this, {id: Math.random(), ecs: ecs, systems: new Map(), sortedSystems: [], runonce: []})
    }
    update() {
        let self = this;
        this.sortedSystems.forEach(a=>a.call(self));
        this.runonce.forEach(a=>a.call(self))
        this.runonce = [];
    }
    runOnce(runOnceFn) {
        this.runOnce.push(runOnceFn);
    }
    addSystem(systemName, systemFn, priority) {
        if (priority) {systemFn.priority = priority}
        this.systems.set(systemName, systemFn)
        return this.sortSystems();
    }
    removeSystem(systemName) {
        this.systems.delete(systemName);
        return this.sortSystems();
    }
    sortSystems() {
        this.sortedSystems = [...this.systems.values()].sort((a, b) => a.priority - b.priority)
        return this;
    }
}

export class ECS {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
        this.entities = new Map();
    }
    makeEntity(identity) {
        let e = new PokitEntity(this, identity);
        this.entities.set(e.id, e);
        return this;
    }
    update() {
        [...this.entities.values()].forEach(e=>e.update());
    }
}