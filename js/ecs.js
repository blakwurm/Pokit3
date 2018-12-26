export class ECS {
    constructor() {
        this.entities = new Map();
        this.systems = new Map();
        this.makeID = () => Math.floor(Math.random() * 1e10)
        let ecs = this;
        this.GameEntity = class extends Set {
            constructor(identity) {
                super(['identity']);
                let newID = ecs.makeID();
                while (ecs.entities.get(newID)) { newID = ecs.makeID(); }
                Object.assign(this,
                    { x: 0, y: 0, z: 0, scale: 1, scaleX: 1, scaleY: 1, rotation: 0,
                      width: 0, height: 0, velocityX: 0, velocityY: 0, requestDelete: false,
                      willDelete: false }, identity, {entityID: newID});
                this.ecs = ecs;
                ecs.entities.set(this.entityID, this);
            }
            setComponent(componentName, componentObj) {
                this.set(componentName);
                Object.assign(this, componentObj);
            }
        }
    }
    init(pokitOS) {
        this.pokitOS = pokitOS;
    }
}
