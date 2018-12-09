export default class TrollyBelt {
    constructor() {
        this.scripts = new Map();
    }
    processEntities(entityArray) {
        for (let entity of entityArray) {
            for (let entry of entity) {
                let script = this.scripts.get(entry[0]);
                if (script) {
                    script.call(null, entity, entityArray);
                }
            }
        }
    }
}

let tb = new TrollyBelt();
tb.scripts.set('foo', function (entity, entityArray) { 
    entity.set('ya', {});
});
let testentity = new Map([['foo', new Map()]]);
tb.processEntities([testentity]);