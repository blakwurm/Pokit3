import * as jewls from './jewls/opengl/opengl.mjs';

let textureSystem = {
    init: (_, imgData) => {
        this.imgId = imgData.imgId;
        this.spriteWidth = imgData.spriteWidth;
        this.spriteHeight = imgData.spriteHeight;
        this.spriteX = imgData.spriteX;
        this.spriteY = imgData.spriteY;
    },
};

let cameraSystem = {
    init: (entity, camData) => {
        jewls.createCamera(entity.id)
    },
};

let actorSystem = {};

export default async function initializeJewls(engine, canvas) {
    engine.ecs.setSystem('img', textureSystem);
}