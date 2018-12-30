// refactored from https://github.com/straker/kontra/blob/master/src/assets.js
import {uploadTexture} from './jewls/jewlsRenderer.js';

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
        this.__loadedAssets.set(assetname, thing);
        console.log(onloadthing);
        return thing;
    }

    async loadImage(assetname, imgurl, width, height) {
        console.log('loading ' + assetname);
        let i = new Image();
        if (width) {i.width = width;}
        if (height) {i.height = height;}
        let p = this.__handle_loader__(assetname, i);
        i.src = imgurl;
        console.log('image almost there! ' + assetname)
        let img = await p;
        console.log('almost loaded ' + assetname);
        uploadTexture(assetname, img);
        console.log('loaded ' + assetname);
        return p;
    }

    loadSound(assetname, soundurl) {
        let a = new Audio();
        let p = this.__handle_loader__(assetname, a);
        a.src = soundurl;
        return p;
    }

    async loadTiledMap(assetname, mapurl, imageurl) {
        this.totalAssets++;
        let rawmap = await fetch(mapurl).then((x) => x.json());
        let layers = rawmap.layers.map(nabLayer);
        console.log(layers);
        rawmap.mapstructure = layers;
        this.__loadedAssets.set(assetname, rawmap);
        this.successfullyLoaded++;
        return rawmap;
    }
}

function nabLayer(layerdata) {
    if (layerdata.type == "tilelayer") {
        return processTileLayer(layerdata);
    }
}

function processTileLayer({width, height, data}) {
    let datapointer = 0;
    let mapvec = [];
    for (let x = 0; x < width; x++) {
        let maprow = []
        for (let y = 0; y < height; y++) {
            maprow.push(data[datapointer]);
            datapointer++;
        }
        mapvec.push(maprow);
    }
    return mapvec;
}