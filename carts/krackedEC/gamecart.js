import loadMap from './loadMap.js';
import './kontra.js';
import setupPC from './playerControl.js';

export class GameCart {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;

    }
    preload() {
        loadMap(this.pokitOS);
        console.log(kontra)
    }
    start(){
        // setupPC(this.pokitOS);
    }

    
}