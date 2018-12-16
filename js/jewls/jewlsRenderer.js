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

export function jewlsCameraView() {
    return { initialized: false };
}

export function doRender(r, g, b, a) {
    backend.render(r, g, b, a);
}

function transformValues(identity) {
    let parent = identity.parent || {
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
    };

    return {
        x: identity.x + parent.x,
        y: identity.y + parent.y,
        z: identity.z + parent.z,
        rotation: identity.rotation + parent.rotation,
        scaleX: identity.scaleX * parent.scaleX,
        scaleY: identity.scaleY * parent.scaleY,
    };
}

export class JewlsActor {
    constructor(engine) {
        this.engine = engine;
        this.componentsRequired = ['jewlsActor', 'identity', 'jewlsTexture'];

        let c = document.getElementById('gamescreen');
        backend.initContext(c);
    }

    entityUpdate([entityID, actor, identity, texture]) {
        let transformed = transformValues(identity);

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
        this.componentsRequired = ['camera', 'identity'];
    }

    entityUpdate([entityID, camera, identity]) {
        if (!camera.initialized) {
            backend.createCamera(entityID, identity.width, camera.clear.R, camera.clear.G, camera.clear.B, camera.clear.A);
            camera.initialized = true;
        }

        let transformed = transformValues(identity);

        rotateCamera(entityID, transformed.rotation);
        translateCamera(entityID, transformed.x, transformed.y);
    }
}

export class JewlsCameraView {
    constructor(engine) {
        this.engine = engine;
        this.componentsRequired = ['jewlsCameraView', 'identity'];
    }

    entityUpdate([entityID, jewlsCameraView, identity]) {
        if (!jewlsCameraView.initialized) {
            backend.createCameraView(entityID, jewlsCameraView.cameraID);
            jewlsCameraView.initialized = true;
        }
    }
}