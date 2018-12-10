export default class TrollyBelt {
    constructor(pokitOS) {
        this.scripts = new Map();
        this.renderers = new Map();
        this.entities = new Map();
        this.prioritySort = (entitya, entityb) => entitya.priority - entityb.priority;
        this.pokitOS = pokitOS;
    }
    rendersort(entitya, entityb) {
        return entitya.z - entityb.z;
    }
    _base_update(entities, scripts, entitySortFn, scriptSortfn) {
        let sortedEnts = [...this.entities.values()].sort(entitySortFn);
        let sortedScripts = [...this.scripts.values()].sort(scriptSortfn);
        for (let script of sortedScripts) {
            for (let entity of sortedEnts) {
                if (entity.hasComponent(script.name)) {
                    script.update(entity);
                }}}}
    update() {
        this._base_update(this.entities, this.scripts, this.prioritySort, this.prioritySort);
    }
    render() {
        this._base_update(this.entities, this.renderers, this.rendersort, this.prioritySort);
    }

    makeEntity(transform, optprops) {
        let entID = 'ent' + (Math.random() * 10000);
        let trollybelt = this;
        let props = Object.assign(optprops || {}, {
            id: entID,
            transform: Object.assign({x: 0, y: 0, z: 0, rotation: 0, width: 0, height: 0}, transform),
            trollybelt: this
        });
        let newEnt = new Entity(props);
        this.entities.set(entID, newEnt);
        return newEnt;
    }
    registerScript(scriptObj) {
        this.scripts.set(scriptObj.name, scriptObj);
        if (scriptObj.render) {
            this.renderers.set(derscript.name, scriptObj);
        }
    }
    removeScript(scriptname) {
        this.scripts.delete(scriptname);
        this.renderers.delete(scriptname);
    }
}

class Entity {
    constructor(props) {
        this.entID = 0;
        this.priority = 0;
        this.components = new Map();
        Object.assign(this, props);
    }
    getComponent(key){return this.components.get(key);}
    hasComponent(key){return this.components.has(key);}
    enableComponent(key) {
        console.log(this);
        this.components.set(key, this.trollybelt.scripts.get(key).makebundle(this));
        this.trollybelt.scripts.get(key).init(this, this.trollybelt.entities);
        return this;
    }
    removeComponent(key) {
        this.trollybelt.scripts.get(key).destroy(ent, this.trollybelt.entities);
        this.components.delete(key);
        return this;
    }
    modify(fn) {
        fn(this);
        return this;
    }
}

let tb = new TrollyBelt();
tb.registerScript({
    name: 'foo',
    priority: 0,
    init(ent) {
        console.log("did a thing with ");
        console.log(ent);
    },
    update(ent) {
        console.log('updating with ');
        console.log(ent);
    },
    destroy(ent) {
        console.log('destroying on ');
        console.log(ent);

    },
    makebundle: ent => new Map([['ba', 'ne']])
})
// let ent = tb.makeEntity();
// ent.enableComponent('foo');
// console.log(ent);
// tb.update();
// ent.removeComponent('foo');