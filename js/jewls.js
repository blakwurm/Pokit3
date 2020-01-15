import * as jewls from './jewls/opengl/opengl.js';
import { Types } from './assetmanager.js';
let textureSystem = class {
    constructor(engine) { this._engine = engine; }
    init(_, imgdata) {
        console.log(this);
        Object.assign(this, {
            spriteX: 0,
            spriteY: 0,
        }, imgdata);
    }
};
let cameraSystem = class {
    constructor(engine) { this._engine = engine; }
    init(entity, camData) {
        jewls.createCamera(entity.id.toString(), entity.width, entity.height, camData.isMainCamera);
    }
    update(entity) {
        jewls.translateCamera(entity.id.toString(), entity.x, entity.y);
    }
    destroy(entity) {
        jewls.deleteCamera(entity.id.toString());
    }
};
let actorSystem = class {
    constructor(engine) { this._engine = engine; }
    async init(entity, _) {
        this._tex = entity.cogs.get('img');
        jewls.createActor(entity.id.toString(), this._tex.id, this._tex.width, this._tex.height);
    }
    update(entity) {
        jewls.setActorSprite(entity.id.toString(), this._tex.spriteX, this._tex.spriteY);
        jewls.translateActor(entity.id.toString(), entity.x, entity.y, entity.z);
        jewls.rotateActor(entity.id.toString(), entity.rotation);
        jewls.scaleActor(entity.id.toString(), entity.scaleX, entity.scaleY);
    }
    destroy(entity) {
        jewls.deleteActor(entity.id.toString());
    }
};
let tileMapSystem = class extends actorSystem {
    constructor(engine) {
        super(engine);
    }
    async init(entity, info) {
        Object.assign(this, { zPad: 0.1 }, info);
        let tileMap = await super._engine.assets.getAsset(this.id);
        this._tex = entity.cogs.get('img');
        this._img = await super._engine.assets.getAsset(this._tex.id);
        jewls.createTileMap(entity.id.toString(), this._tex.id, tileMap.width, this._img.width / tileMap.tilewidth, tileMap.tilewidth, tileMap.tileheight, this.zPad, tileMap.alphaTile, tileMap.tilelayers);
    }
};
async function decodeImage(id, response) {
    let i = new Image();
    await new Promise(async (resolve) => {
        let blob = await response.blob();
        i.onload = resolve;
        i.src = URL.createObjectURL(blob);
    });
    jewls.createImageTexture(id, i);
    return { id: id, height: i.height, width: i.width };
}
async function destructImage(asset) {
    jewls.deleteTexture(asset.id);
}
export class Renderer {
    constructor(canvas) {
        this._canvas = canvas;
        this._engine = null;
    }
    async init(engine) {
        this._engine = engine;
        await jewls.initContext(this._canvas);
        engine.assets.registerType('IMAGE');
        engine.assets.registerDecoder(Types.IMAGE, decodeImage);
        engine.assets.registerDestructor(Types.IMAGE, destructImage);
        this.render = jewls.render;
        engine.ecs.setCog('img', textureSystem);
        engine.ecs.setCog('spriteActor', actorSystem);
        engine.ecs.setCog('camera', cameraSystem);
        engine.ecs.defaultCamera = engine.ecs.makeEntity({ width: 320, height: 320 })
            .addCog('camera', { isMainCamera: true });
    }
}
