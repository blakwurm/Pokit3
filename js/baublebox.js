class System {
    constructor(name, priority) {
        this.name = name;
        this.priority = priority;
    }
}

export default class BaubleBox {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
        this.__entities = new Set();
        this.__componentMakers = new Map();
        this.__components = new Map();
        this.__systems = new Map();
        this.__renderers = new Map();
        this.initializeComponent('transform', function(initialvalue) {
            return Object.assign({x: 0, y: 0, z: 0, rotation: 0, width: 0, height: 0}, initialvalue);
        })
    }
    prioritySort(thinga, thingb) {
        return thinga.priority - thingb.priority;
    }
    initializeComponent(componentName, componentMaker) {
        this.__componentMakers.set(componentName, componentMaker);
        this.__components.set(componentName, new Map());
        return this;
    }
    destroyComponent(componentName) {
        this.__componentMakers.delete(componentName);
        this.__components.delete(componentName);
        return this;
    }
    addComponentToEntity(entityID, componentName, initialvalue) {
        let fn = this.__componentMakers.get(componentName);
        let realvalue = fn(initialvalue);
        this.__components.get(componentName).set(entityID, realvalue);
        return function(otherComponentName, otherInitialValue) {
            this.addComponentToEntity(entityID, otherComponentName, otherInitialValue);
        }
    }
    makeEntity(transform) {
        let newID = 'ent' + (Math.random() * 1e10)
        this.__entities.add(newID);
        return this.addComponentToEntity(newID, 'transform', transform);
    }
    destroyEntity(entityID) {
        this.__entities.delete(newID);
        for (let componentMap of this.__components) {
            componentMap.delete(entityID);
        }
        return this;
    }
    initializeSystem(systemName, newSystem) {
        if (newSystem.update){
            this.__systems.add(systemname, newSystem);
        }
        if (newSystem.render) {
            this.__renderers.add(systemname, newSystem);
        }
        newSystem.baublebox = this;
    }
    destroySystem(systemName) {
        this.__systems.delete(systemName);
        this.__renderers.delete(systemName);
    }


    update() {
        for (let system of this.__systems.values()) {
            system.update(this.__components);
        }
    }

    render() {
        for (let system of this.__renderers.values()) {
            system.render(this.__components);
        }

    }



}
