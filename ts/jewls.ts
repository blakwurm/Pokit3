import * as jewls from './jewls/opengl/opengl.js';
import {Types, IAsset} from './assetmanager.js';
import { ICog, PokitEntity } from './ecs.js';
import { PokitOS } from './pokitos.js';

export interface ITextureSystem extends ICog{
    id: string,
    spriteX?: number,
    spriteY?: number,
    width?: number,
    height?: number
}
let textureSystem = class implements ITextureSystem {
    private _engine: PokitOS;
    id: string;
    spriteX: number;
    sprityY: number;
    constructor(engine: PokitOS) {this._engine=engine}
    init (_, imgdata: IJsonSerializableObject) {
        console.log(this)
        Object.assign(this, {
            spriteX:0,
            spriteY:0,
        }, imgdata)
    }
};

export interface ICameraSystem extends ICog{
    isMainCamera: boolean;
}

let cameraSystem = class implements ICameraSystem{
    private _engine: PokitOS;
    isMainCamera: boolean;
    constructor(engine: PokitOS) {this._engine=engine}
    init(_, camData: IJsonSerializableObject){
        this.isMainCamera = <boolean>camData.isMainCamera;
    }
    onLoad (entity: PokitEntity) {
        jewls.createCamera(entity.id.toString(), entity.width, entity.height, this.isMainCamera);
    }
    update (entity: PokitEntity) {
        jewls.translateCamera(entity.id.toString(), entity.x, entity.y);
    }
    destroy (entity: PokitEntity) {
        jewls.deleteCamera(entity.id.toString());
    }
};

let actorSystem = class implements ICog {
    _engine: PokitOS;
    _tex: ITextureSystem;
    constructor(engine: PokitOS) {this._engine=engine}
    async init(entity: PokitEntity,_){
        this._tex = <ITextureSystem>entity.cogs.get('img');
    }
    async onLoad (entity: PokitEntity) {
        jewls.createActor(entity.id.toString(), this._tex.id, this._tex.width, this._tex.height);
    }
    update (entity: PokitEntity) {
        jewls.setActorSprite(entity.id.toString(), this._tex.spriteX, this._tex.spriteY);

        jewls.translateActor(entity.id.toString(), entity.x, entity.y, entity.z);
        jewls.rotateActor(entity.id.toString(), entity.rotation);
        jewls.scaleActor(entity.id.toString(), entity.scaleX, entity.scaleY);
    }
    destroy (entity: PokitEntity) {
        jewls.deleteActor(entity.id.toString());
    }
};

export interface ITileMapSystem extends ICog {
    id: string,
    zPad?: number
}

export interface ITileMap extends IAsset {
    width: number,
    tilewidth: number,
    tileheight: number,
    alphaTile: number,
    tilelayers: number[][]
}

let tileMapSystem = class extends actorSystem implements ITileMapSystem {
    private _img: IGpuImage;
    id: string;
    zPad: number;
    tileMap: ITileMap;

    constructor(engine: PokitOS){
        super(engine);
    }
    async init(entity: PokitEntity, info: IJsonSerializableObject){
        Object.assign(this, {zPad:0.1}, info);
        this.tileMap = <ITileMap>await super._engine.assets.getAsset(this.id);
        this._tex = <ITextureSystem>entity.cogs.get('img');
        this._img = <IGpuImage>await super._engine.assets.getAsset(this._tex.id);
    }
    async onLoad(entity: PokitEntity) {
        let tileMap = this.tileMap;
        jewls.createTileMap(entity.id.toString(), this._tex.id, tileMap.width, this._img.width/tileMap.tilewidth, tileMap.tilewidth, tileMap.tileheight, this.zPad, tileMap.alphaTile, tileMap.tilelayers)
    }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

let alexIsStupid = class extends actorSystem {
    async init (entity: PokitEntity, data: IJsonSerializableObject){
        let id = uuidv4();
        entity.addCog("img", {id: id})
        let imgData = new Array<number[]>(entity.width * entity.height);
        imgData.fill(<number[]>data.color);
        let flat: number[] = [].concat.apply([], imgData);
        jewls.createRawTexture(id, entity.width, entity.height, new Uint8Array(flat))
        super.init(entity, data);
    }
    destroy(entity: PokitEntity){
        jewls.deleteTexture(this._tex.id);
        super.destroy(entity);
    }
}

export interface IGpuImage extends IAsset{
    id: string,
    height: number,
    width: number
}

async function decodeImage(id: string, response: Response){
    let i = new Image();
    await new Promise(async (resolve)=>{
        let blob = await response.blob();
        i.onload = resolve;
        i.src = URL.createObjectURL(blob);
    })

    jewls.createImageTexture(id, i);

    return {id:id, height:i.height, width:i.width};
}

async function destructImage(asset: IAsset){
    jewls.deleteTexture(asset.id);
}

export class Renderer implements IRenderer {
    private _canvas: HTMLCanvasElement;
    private _engine: PokitOS;
    render: (cullFunc: CullingFunction)=>void;
    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._engine = null;
    }
    async init(engine: PokitOS) {
        this._engine = engine;
        await jewls.initContext(this._canvas);

        engine.assets.registerType('IMAGE');
        engine.assets.registerDecoder(Types.IMAGE, decodeImage);
        engine.assets.registerDestructor(Types.IMAGE, destructImage);
        this.render = jewls.render;

        engine.ecs.setCog('img', textureSystem);
        engine.ecs.setCog('spriteActor', actorSystem);
        engine.ecs.setCog('camera', cameraSystem);
        engine.ecs.setCog('alexIsStupid', alexIsStupid);

        engine.ecs.defaultCamera = engine.ecs.makeEntity({width:320, height:320})
                    .addCog('camera', {isMainCamera:true});
        engine.ecs.defaultCamera.flags.add('persistent');
    }
}