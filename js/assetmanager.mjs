export let Types = {
    TEXT: 0,
    JSON: 1,
};

export class AssetManager{
    constructor(){
        this._assets = new Map();
        this._urls = new Map();
        this._typedAssets = new Map();
        this._decoders = new Map();
    }

    registerType(type){
        Types[type] = Object.keys(Types).length;
    }

    async queueAsset(id, url) {
        let asset = this._urls.get(url);
        if(!asset) {
            let response = await fetch(url);
        }
        return asset;
    }
}

function createWorker(fn) {
    var blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
    var url = URL.createObjectURL(blob);
    
    return new Worker(url);
  }