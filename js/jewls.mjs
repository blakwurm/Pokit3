import * as jewls from './jewls/opengl/opengl.mjs';
import {SpacialHash} from './spatialhash.mjs';

let textureSystem = {
    init: (_, imgData) => {
        Object.assign(this, {
            spriteX:0,
            spriteY:0,
        }, imgdata)
    },
};

let cameraSystem = {
    init: (entity, camData) => {
        jewls.createCamera(entity.id, entity.width, entity.height, camData.isMainCamera);
    },
    update: (entity) => {
        jewls.translateCamera(entity.id, entity.x, entity.y);
    },
    delete: (entity) => {
        jewls.deleteCamera(entity.id);
    }
};

let actorSystem = {
    init: (entity) => {
        this.tex = entity.systems.get('img');
        jewls.createActor(entity.id, this.tex.id, this.tex.width, this.tex.height);
    },
    update: (entity) => {
        jewls.setActorSprite(entity.id, this.tex.spriteX, this.tex.spriteY);

        jewls.translateActor(entity.id, entity.x, entity.y, entity.z);
        jewls.rotateActor(entity.id, entity.rotation);
        jewls.scaleActor(entity.id, entity.scaleX, entity.scaleY);
    },
    delete: (entity) => {
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

export default async function initializeJewls(engine, canvas) {
    jewls.initContext(canvas);

    engine.assets.queueImage = makeClosure();
    engine.render = ()=>jewls.render((entities, camera)=>{
        let shm = new SpacialHash(64);

        shm.clear();
        shm.addMany(entities);
        return shm.findColliding(camera);
    });

    engine.ecs.setSystem('img', textureSystem);
    engine.ecs.setSystem('spriteActor', actorSystem);
    engine.ecs.setSystem('camera', cameraSystem);
}