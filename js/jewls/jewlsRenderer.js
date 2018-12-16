import * as backend from './opengl/opengl.js';

export function jewlsActor() {
    return {initialized:false};
}

export function jewlsTexture(texture) {
    return {ID: texture};
}

export function uploadTexture(name, image) {
    backend.createImageTexture(name, image);
}

function transformValues(transform) {
    let parent = transform.parent || {
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
    };

    return {
        x: transform.x + parent.x,
        y: transform.y + parent.y,
        z: transform.z + parent.z,
        rotation: transform.rotation + parent.rotation,
        scaleX: transform.scaleX * parent.scaleX,
        scaleY: transform.scaleY * parent.scaleY,
    };
}

export class JewlsActor {
    constructor(engine) {
        this.engine = engine;
        this.componentsRequired = ['jewlsActor', 'transform', 'jewlsTexture'];

        let c = document.getElementById('gamescreen');
        backend.initContext(c);
    }

    entityUpdate([entityID, actor, transform, texture]) {
        let transformed = transformValues(transform);

        if (!actor.initialized) {
            backend.createActor(entityID, texture.ID);
            actor.initialized = true;
        }

        backend.rotateActor(entityID, transformed.rotation);
        backend.translateActor(entityID, transformed.x, transformed.y, transformed.z);
        backend.scaleActor(entityID, transformed.scaleX, tranasformed.scaleY);
    }

}

export class JewlsCamera {
    constructor(engine) {
        this.engine = engine;
        this.componentsRequired = ['camera', 'transform'];
    }

    entityUpdate([entityID, camera, transform]) {
        if (!camera.initialized) {
            backend.createCamera(entityID, transform.width, camera.clear.R, camera.clear.G, camera.clear.B, camera.clear.A);
            camera.initialized = true;
        }

        let transformed = transformValues(transform);

        rotateCamera(entityID, transformed.rotation);
        translateCamera(entityID, transformed.x, transformed.y);
    }
}

export class JewlsCameraView {
    constructor(engine) {
        this.engine = engine;
        this.componentsRequired = ['jewlsCameraView', 'transform'];
    }

    entityUpdate([entityID, jewlsCameraView, transform]) {
        if (!jewlsCameraView.initialized) {
            backend.createCameraView(entityID, jewlsCameraView.cameraID);
            jewlsCameraView.initialized = true;
        }
    }
}