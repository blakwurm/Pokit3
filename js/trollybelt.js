export default class TrollyBelt {
    constructor(pokitOS) {
        this.scripts = new Map();
        this.renderers = new Map();
        this.entities = new Map();
        this.prioritySort = (entitya, entityb) => entitya.priority - entityb.priority;
        this.pokitOS = pokitOS;
    }
    rendersort(entitya, entityb) {
        return entitya.transform.z - entityb.transform.z;
    }
    __base_update(entityInteraction, preScript, entities, scripts, entitySortFn, scriptSortFn) {
        let sortedEnts = [...entities.values()].sort(entitySortFn);
        let sortedScripts = [...scripts.values()].sort(scriptSortFn);
        for (let script of sortedScripts) {
            preScript(script);
            for (let entity of sortedEnts) {
                if (entity.hasComponent(script.name)) {
                    entityInteraction(entity, script);
                }}}

    }
    update() {
        // this._base_update('update', this.entities, this.scripts, this.prioritySort, this.prioritySort);
        this.__base_update(
            (entity, script) => {script.update(entity)},
            script => script.preupdate(),
            this.entities, this.scripts, this.prioritySort, this.prioritySort)
    }
    render() {
        // this._base_update('render', this.entities, this.renderers, this.rendersort, this.prioritySort)
        this.__base_update(
            (entity, script) => {script.render(entity)},
            script => {if (script.prerender) {script.prerender()}},
            this.entities, this.renderers, this.prioritySort, this.prioritySort)
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
    destroyEntity(entityID) {
        this.entities.delete(entityID);
        return this;
    }
    registerScript(scriptObj) {
        this.scripts.set(scriptObj.name, scriptObj);
        if (scriptObj.render) {
            this.renderers.set(scriptObj.name, scriptObj);
        }
        scriptObj.trollybelt = this;
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
    enableComponent(key, opt) {
        console.log(this);
        this.components.set(key, this.trollybelt.scripts.get(key).makebundle(this, opt));
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
    destroy() {
        this.trollybelt.destroyEntity(this.id);
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