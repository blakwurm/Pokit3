import * as jewls from './jewls/opengl/opengl.mjs';
import {Types} from './assetmanager.mjs';

let textureSystem = class {
    constructor(engine) {this.engine=engine}
    init (_, imgdata) {
        console.log(this)
        Object.assign(this, {
            spriteX:0,
            spriteY:0,
        }, imgdata)
    }
};

let cameraSystem = class {
    constructor(engine) {this.engine=engine}
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
    constructor(engine) {this.engine=engine}
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

let tileMapSystem = class extends actorSystem {
    init(entity){
        this.tex = entity.systems.get('img');
        this.tileMap = entity.systems.get('tileMap');
        this.img = super.engine.assets.getAsset(this.tex.id);
        jewls.createTileMap(entity.id, this.tex.id, this.tileMap.width, this.img.width/this.tileMap.tilewidth, this.tileMap.tilehidth, this.tileMap.tileheight, this.tileMap.zSpacer, this.tileMap.alphaTile, this.tileMap.layers)
    }
}

async function decodeImage(id, response){
    let i = new Image();
    await new Promise(async (resolve)=>{
        let blob = await response.blob();
        i.onload = resolve;
        i.src = URL.createObjectURL(blob);
    })

    jewls.createImageTexture(id, i);

    return {id:id, height:i.height, width:i.width};
}

async function destructImage(id){
    jewls.deleteTexture(id);
}

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.pokitOS = null;
    }
    async init(engine) {
        this.pokitOS = engine;
        await jewls.initContext(this.canvas);

        engine.assets.registerType('IMAGE');
        engine.assets.registerDecoder(Types.IMAGE, decodeImage);
        engine.assets.registerDestructor(Types.IMAGE, destructImage);
        this.render = jewls.render;

        engine.ecs.setSystem('img', textureSystem);
        engine.ecs.setSystem('spriteActor', actorSystem);
        engine.ecs.setSystem('camera', cameraSystem);

        engine.ecs.defaultCamera = engine.ecs.makeEntity({width:320, height:320})
                    .addSystem('camera', {isMainCamera:true});
    }
}