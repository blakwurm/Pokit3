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

async function queueImage(id, url) {
    let i = await loadImage(url);
    jewls.createImageTexture(id, i);
}

export default async function initializeJewls(engine, canvas) {
    jewls.initContext(canvas);

    engine.assets.queueImage = queueImage;
    engine.render = ()=>jewls.render((entities, camera)=>{
        //TODO: add spacial hash cell size
        let shm = new SpacialHash();

        shm.clear();
        shm.addMany(entities);
        return shm.findColliding(camera);
    });

    engine.ecs.setSystem('img', textureSystem);
    engine.ecs.setSystem('actor', actorSystem);
    engine.ecs.setSystem('camera', cameraSystem);
}