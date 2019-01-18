import {Types} from './assetmanager.mjs';

export class Mixer {
    constructor(){
        this._racks = [];
        this._ctx = new AudioContext();
    }

    async audioDecoder(_, response){
        let buffer = await response.arrayBuffer();
        let ctx = this._ctx;
        return await new Promise((resolve)=>ctx.decodeAudioData(buffer, resolve));
    }

    init(engine){
        this.pokitOS = engine;

        engine.assets.registerType('SOUND');
        engine.assets.registerDecoder(Types.SOUND, (_, response) => this.audioDecoder(_, response));
    }

    createRack(){
        this._racks.push([]);
        return this._racks.length -1;
    }

    playSound(buffer) {
        let src = this._ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(this._ctx.destination);
        src.start();
    }
}

export class AudioSource {
    
}