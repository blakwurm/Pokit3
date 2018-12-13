// refactored from https://github.com/straker/kontra/blob/master/src/assets.js

export default class Bellhop {
    constructor(pokitOS) {
        console.log('constructing bellhop')
        this.pokitOS = pokitOS;
        this.__promises = new Map();
        this.__loadedAssets = new Map();
        this.totalAssets = 0;
        this.successfullyLoaded = 0;
    }

    getAsset(assetname) {
        return this.__loadedAssets.get(assetname);
    }

    async __handle_loader__(assetname, onloadthing) {
        this.totalAssets++;
        console.log('loading a new thing')
        let p = new Promise((resolve, reject) => onloadthing.onload = () => resolve(onloadthing))
        this.__promises.set(assetname, p);
        let thing = await p;
        this.successfullyLoaded++;
        console.log(onloadthing);
        this.__loadedAssets(assetname, thing);
        return thing;
    }

    loadImage(assetname, imgurl, width, height) {
        let i = new Image();
        if (width) {i.width = width;}
        if (height) {i.height = height;}
        let p = this.__handle_loader__(assetname, i);
        i.src = imgurl;
        return p; 
    }

    loadSound(assetname, soundurl) {
        let a = new Audio();
        let p = this.__handle_loader__(assetname, a);
        a.src = soundurl;
        return p;
    }
}

function handleAssetLoadFinished() {

}