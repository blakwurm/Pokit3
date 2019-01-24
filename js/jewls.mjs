import * as jewls from './jewls/opengl/opengl.mjs';
import {Types} from './assetmanager.mjs';
import * as Logging from './debug.mjs';

let textureSystem = class {
    constructor(engine) {this.engine=engine}
    init (_, imgdata) {
        //console.log(this)
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
        this.tex = entity.cogs.get('img');
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

let tileMapSystem = class{
    constructor(engine){
        this.engine = engine;
        this._layers = [];
    }
    async init(entity, info) {
        Object.assign(this, {zPad:0.1, cache:true}, info);
        let tileMap = await this.engine.assets.getAsset(this.id).data;
        this.tex = entity.cogs.get('img');
        this.img = await this.engine.assets.getAsset(this.tex.id).data;
        for(let layer of tileMap.layers){
            if(!layer.bufferLayer){
                jewls.createTileMap(
                    entity.id + '_' + layer.name,
                    this.tex.id,
                    this.img.width/tileMap.tilewidth, 
                    tileMap.width, 
                    tileMap.width * tileMap.height,
                    tileMap.tilewidth, 
                    tileMap.tileheight, 
                    0.1,
                    [layer.data],
                    true);
                this._layers.push(layer.name)
            }
        }
        this._layers = this._layers.reverse();
        entity.width = tileMap.width * tileMap.tilewidth;
        entity.height = tileMap.height * tileMap.tileheight;
    }
    update (entity) {
        let i = 0;
        for(let layer of this._layers){
            jewls.translateActor(entity.id + '_' + layer, entity.x, entity.y, entity.z + i);
            jewls.rotateActor(entity.id + '_' + layer, entity.rotation);
            jewls.scaleActor(entity.id + '_' + layer, entity.scaleX, entity.scaleY);
            if(!this.throttleLog)
                Logging.Log(layer, i);
            i += this.zPad;
        }
        this.throttleLog = true;
    }
    destroy (entity) {
        for(let layer of this._layers){
            jewls.deleteActor(entity.id);
        }
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

        engine.ecs.setCog('img', textureSystem);
        engine.ecs.setCog('spriteActor', actorSystem);
        engine.ecs.setCog('camera', cameraSystem);
        engine.ecs.setCog('tilemap', tileMapSystem);

        engine.ecs.defaultCamera = engine.ecs.makeEntity({width:320, height:320})
                    .addCog('camera', {isMainCamera:true});
    }
}