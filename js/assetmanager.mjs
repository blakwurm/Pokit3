export class AssetManager{
    constructor(){
        this.imgs = new Map();
        this.sounds = new Map();
    }
    async getImage(imgname, imgurl) {
        let i = new Image();
        this.imgs.set(imgname, i);
        i.src = imgurl;
        console.log(i)
        return i;
    }
}