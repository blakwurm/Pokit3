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
    async getImage(imgname, imgurl) {
        let huh = this.imgs.get(imgname)
        if (huh) {return huh}
        let i = new Image();
        this.imgs.set(imgname, i);
        i.src = imgurl;
        console.log(i)
        return i;
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