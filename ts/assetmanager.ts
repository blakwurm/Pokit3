import { PokitOS } from "./pokitos";

interface Enum {
    [number: string]: any
}

export interface IAsset {
    id: string,
    type: number,
    url: string,
    data: any
}

export type Decoder = (id: string, data: Response) => any;
export type Destructor = (asset: IAsset) => void;

export let Types : Enum = {};

export class AssetManager {
    private _assets: Map<string, IAsset>;
    private _urls: Map<string, IAsset>;
    private _typedAssets: Map<number, Set<IAsset>>;
    private _decoders: Map<number, Decoder>;
    private _destructors: Map<number, Destructor>;
    private _engine: PokitOS;

    constructor(){
        this._assets = new Map();
        this._urls = new Map();
        this._typedAssets = new Map();
        this._decoders = new Map();
        this._destructors = new Map();

        this.registerType('TEXT');
        this.registerType('JSON');

        this._decoders.set(Types.TEXT,async (_,x)=>{
            return await x.text();
        })

        this._decoders.set(Types.JSON,async (_,x)=>{
            return await x.json();
        })
    }

    init(engine: PokitOS){
        this._engine = engine;
    }

    registerType(type: string){
        Types[type] = Object.keys(Types).length;
        this._typedAssets.set(Types[type], new Set());
    }

    registerDecoder(type: number, decoder: Decoder){
        this._decoders.set(type, decoder);
    }

    registerDestructor(type: number, destructor: Destructor){
        this._destructors.set(type, destructor);
    }

    async queueAsset(id: string, url: string, type: number): Promise<any> {
        let asset = this._urls.get(url);
        if(!asset) {
            let response = await fetch(url);
            let decode = this._decoders.get(type);
            asset = {id:id, type:type, url:url, data:decode(id, response)};
            this._assets.set(id, asset);
            this._urls.set(url, asset);
            this._typedAssets.get(type).add(asset);
        }
        return asset.data;
    }

    getAsset(id: string): IAsset{
        return this._assets.get(id);
    }

    cleanupAsset(id: string){
        let asset = this._assets.get(id);
        let destruct = this._destructors.get(asset.type);
        if(destruct){
            destruct(asset);
        }
        this._assets.delete(id);
        this._urls.delete(asset.url);
        this._typedAssets.get(asset.type).delete(asset);
    }
}

function createWorker(fn) {
    var blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
    var url = URL.createObjectURL(blob);
    
    return new Worker(url);
  }