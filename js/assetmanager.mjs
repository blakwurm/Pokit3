export class AssetManager{
    constructor(){
        this.imgs = new Map();
        this.sounds = new Map();
        this.json = {};
        this.pokitOS = null;
        this.imgWorker = createWorker(function(e) {
            console.log(e)
        })
        this.assetPipe = new MessageChannel();
    }
    init(pokitOS) {this.pokitOS = pokitOS;}
    async queueImage(id, url) {
        let i = imgs.get(id);
        if(i) return id;

        return await new Promise((resolve)=>{
            let i = new Image();
            i.onload = ()=>resolve(id);
            i.src = url;
        });
    }
    async getJson(jsonName, src) {
        let huh = this.json[jsonName]
        if (huh) {return huh}
        let f = await fetch(src)
        let j = await f.json()
        this.json[jsonName] = j
        return j;
    }
}

function createWorker(fn) {
    var blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
    var url = URL.createObjectURL(blob);
    
    return new Worker(url);
  }