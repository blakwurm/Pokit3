export default class TrollyBelt {
    constructor(pokitOS) {
        this.scripts = new Map();
        this.entities = new Map();
        this.prioritySort = (entitya, entityb) => entitya.priority - entityb.priority;
        this.pokitOS = pokitOS;
    }
    update() {
        let sortedEnts = [...this.entities.values()].sort(this.prioritySort);
        let sortedScripts = [...this.scripts.values()].sort(this.prioritySort);
        for (let script of sortedScripts) {
            for (let entity of sortedEnts) {
                if (entity.hasComponent(script.name)) {
                    script.update(entity);
                }}}}

    makeEntity() {
        let entID = 'ent' + (Math.random() * 10000);
        let trollybelt = this;
        let newEnt = {
            priority: 0,
            id: entID,
            components: new Map(),
            enableComponent(key) {
                console.log(this);
                this.components.set(key, trollybelt.scripts.get(key).makebundle(newEnt));
                trollybelt.scripts.get(key).init(this, trollybelt.entities);
            },
            getComponent(key) {
                this.components.get(key);
            },
            hasComponent(key) {
                console.log('has key on ' + key);
                return this.components.has(key);
            },
            removeComponent(key) {
                trollybelt.scripts.get(key).destroy(ent, trollybelt.entities);
                this.components.delete(key);
            }
        }
        this.entities.set(entID, newEnt);
        return newEnt;
    }
    registerScript(scriptObj) {
        let derscript = Object.assign({priority: 0, init(){}, update(){}, destroy(){}, makebundle(){return new Map()}}, scriptObj);
        this.scripts.set(derscript.name, derscript);
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
let ent = tb.makeEntity();
ent.enableComponent('foo');
console.log(ent);
tb.update();
// ent.removeComponent('foo');