export class Mixer {
    constructor(){
        this._racks = [];
        this._ctx = new AudioContext();
    }

    createRack(){
        this._racks.push([]);
        return this._racks.length -1;
    }
}

export class AudioSource {
    
}