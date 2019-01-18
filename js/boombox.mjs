import {Types} from './assetmanager.mjs';

export class Mixer {
    constructor(){
        this._racks = [];
        this._srcs = new Map();
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
        
        engine.ecs.setSystem('audioSource', AudioSource);

        let entryNode = new AnalyserNode(this._ctx);
        entryNode.connect(this._ctx.destination);

        this._racks.push([entryNode,this._ctx.destination]);
    }

    createRack(){
        let entryNode = new AnalyserNode(this._ctx);
        let exitNode = new AnalyzerNode(this._ctx);
        entryNode.connect(exitNode);
        exitNode.connect(this._racks[0][0]);
        this._racks.push([entryNode,exitNode]);
        return this._racks.length -1;
    }

    addToRack(node, dest = 0, rack = 0){
        let lowerNode = this.getNode(dest, rack);
        let upperNode = this.getNode(dest-1, rack);
        upperNode.disconnect(lowerNode);
        upperNode.connect(node);
        node.connect(lowerNode);
        this._racks[rack].splice(dest, 0, node);
    }

    removeFromRack(index, rack =0){
        let lowerNode = this.getNode(dest + 1, rack);
        let node = this.getNode(dest, rack);
        let upperNode = this.getNode(dest-1, rack);
        upperNode.disconnect(node);
        upperNode.connect(lowerNode);
        node.disconnect(lowerNode);
        this._racks[rack].splice(index, 1);
    }

    getNode(index, rack=0) {
        this._racks[rack][index];
    }

    makeSource(buffer, rack = 0){
        let src = this._ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(this._racks[rack][0]);
        this._srcs[rack].push(src);
        return src;
    }
}

let AudioSource = class {
    constructor(engine){
        this.engine=engine
        this.startOnInit = false;
        this.loop = false;
        this.spatial = false;
        this.id = null;
        this.rack = 0;
        this.speed = 1;
    };
    init(entity, audioData) {
        Object.assign(this, audioData);
        let buffer = this.engine.assets.getAsset(this.id);
        this.src = this.engine.mixer.makeSource(buffer, this.rack);

        this.src.loop = this.loop;
        this.src.playbackRate = this.speed;
        if(this.startOnInit){
            this.src.start();
        }
    }
    play() {
        this.src.start();
    }
    stop() {
        this.src.stop();
    }
}