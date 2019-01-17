import * as jewls from './jewls/opengl/opengl.mjs';
import {SpatialHash} from './spatialhash.mjs';

let textureSystem = class {
    constructor(entity) {this.entity=entity}
    init (_, imgdata) {
        console.log(this)
        Object.assign(this, {
            spriteX:0,
            spriteY:0,
        }, imgdata)
    }
};

let cameraSystem = class {
    constructor(entity) {this.entity = entity}
    init (entity, camData) {
        jewls.createCamera(entity.id, entity.width, entity.height, camData.isMainCamera);
    }
    update (entity) {
        jewls.translateCamera(entity.id, entity.x, entity.y);
    }
    destroy (entity) {
        jewls.deleteCamera(entity.id);
    }
};

let actorSystem = class {
    constructor(entity) {this.entity=entity}
    init (entity) {
        this.tex = entity.systems.get('img');
        jewls.createActor(entity.id, this.tex.id, this.tex.width, this.tex.height);
    }
    update (entity) {
        jewls.setActorSprite(entity.id, this.tex.spriteX, this.tex.spriteY);

        jewls.translateActor(entity.id, entity.x, entity.y, entity.z);
        jewls.rotateActor(entity.id, entity.rotation);
        jewls.scaleActor(entity.id, entity.scaleX, entity.scaleY);
    }
    destroy (entity) {
        jewls.deleteActor(entity.id);
    }
};

function loadImage(url){
    return new Promise(resolve=>{
        let i = new Image();
        i.onload = ()=>resolve(i);
        i.src = url;
    });
}

function makeClosure(){
    let assets = new Map();
    return async function(id, url){
        let a = assets.get(url);
        if(a) return a;
        id = id || Math.random() + '';
        let i = await loadImage(url);
        jewls.createImageTexture(id, i);
        a = {id: id, height: i.height, width: i.width};
        assets.set(url,a);
        return a;
    }
}
export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.pokitOS = null;
    }
    async init(engine) {
        this.pokitOS = engine;
        await jewls.initContext(this.canvas);

        engine.assets.queueImage = makeClosure();
        this.render = jewls.render;

        engine.ecs.setSystem('img', textureSystem);
        engine.ecs.setSystem('spriteActor', actorSystem);
        engine.ecs.setSystem('camera', cameraSystem);

        engine.ecs.defaultCamera = engine.ecs.makeEntity({width:320, height:320})
                    .addSystem('camera', {isMainCamera:true});
    }
}