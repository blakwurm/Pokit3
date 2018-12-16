import * as backend from './opengl/opengl.js';

export function jewlsActor() {
    return {initialized:false};
}

export function jewlsTexture(ops) {
    return Object.assign({ID:null, width: 1, height: 1, x: 0, y: 0});
}

export function uploadTexture(name, image) {
    backend.createImageTexture(name, image);
}

export function jewlsCameraView() {
    return { initialized: false };
}

export function doRender() {
    backend.render(0,0,0,0);
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
    constructor(engine, canvas) {
        this.engine = engine;
        this.componentsRequired = ['jewlsActor', 'identity', 'jewlsTexture'];
        this.canvas = canvas;

        this.onInitialize();
    }

    onInitialize() {
        backend.initContext(this.canvas);
    }

    entityUpdate([entityID, actor, identity, texture]) {
        if (identity.willDelete) {
            backend.deleteActor(entityID);
            return;
        }

        let transformed = transformValues(identity);

        if (!actor.initialized) {
            backend.createActor(entityID, texture.ID, texture.width, texture.height);
            actor.initialized = true;
        }

        backend.setActorSprite(entityID, texture.x, texture.y);
        backend.rotateActor(entityID, transformed.rotation);
        backend.translateActor(entityID, transformed.x, transformed.y, transformed.z);
        backend.scaleActor(entityID, transformed.scaleX, tranasformed.scaleY);
    }

}

export class JewlsMainCamera {
    constructor(engine) {
        this.engine = engine;
        this.componentsRequired = ['jewlsMainCamera', 'identity'];
    }

    entityUpdate([, identity]) {
        let transformed = transformValues(identity);

        backend.rotateCamera('_main', transformed.rotation);
        backend.translateCamera('_main', transformed.x, transformed.y);
    }
}

export class JewlsCamera {
    constructor(engine) {
        this.engine = engine;
        this.componentsRequired = ['camera', 'identity'];
    }

    entityUpdate([entityID, camera, identity]) {
        if (!camera.initialized) {
            camera.clear = Object.assign({R: 0, G: 0, B: 0, A: 0}, camera.clear);
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
        if (identity.willDelete) {
            backend.deleteActor(entityID);
            return;
        }

        if (!jewlsCameraView.initialized) {
            backend.createCameraView(entityID, jewlsCameraView.cameraID);
            jewlsCameraView.initialized = true;
        }

        let transformed = transformValues(identity);

        backend.rotateActor(entityID, transformed.rotation);
        backend.translateActor(entityID, transformed.x, transformed.y, transformed.z);
        backend.scaleActor(entityID, transformed.scaleX, tranasformed.scaleY);
    }
}