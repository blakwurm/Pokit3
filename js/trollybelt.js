export default class TrollyBelt {
    constructor() {
        this.scripts = new Map();
        this.entities = new Map();
        this.entitySorter = null;
    }
    update() {
        for (let entity of this.entities.values()) {
            console.log(entity);
            for (let key of entity.components.keys()) {
                let script = this.scripts.get(key);
                script.update(entity, this.entities);
            }
        }
    }
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
            removeComponent(key) {
                trollybelt.scripts.get(key).destroy(ent, trollybelt.entities);
                this.components.delete(key);
            }
        }
        this.entities.set(entID, newEnt);
        return newEnt;
    }
    registerScript(scriptname, scriptObj) {
        let derscript = Object.assign({init(){}, update(){}, destroy(){}, makebundle(){return new Map()}}, scriptObj);
        this.scripts.set(scriptname, derscript);
    }
}

let tb = new TrollyBelt();
tb.registerScript('foo', {
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
tb.update();
ent.removeComponent('foo');