import loadMap from './loadMap.js';
import './kontra.js';
export class GameCart {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;

    }
    preload() {
        loadMap(this.pokitOS);
        console.log(kontra)
    }
    start(){

    }

    
}